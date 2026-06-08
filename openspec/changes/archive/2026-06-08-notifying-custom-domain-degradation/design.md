## Context

The storefront domain workflow now detects post-activation degradation and automatically falls back to the shared-host canonical URL, but the platform still relies on the tenant opening `/admin/profile` to discover that something changed. That leaves the system operationally aware but not communicative: the monitoring layer knows a domain degraded or recovered, yet the tenant has no proactive signal to investigate DNS, confirm recovery, or understand why the canonical link changed.

This change should build directly on the monitoring slice instead of introducing a separate notification platform. The codebase already persists domain lifecycle state on `Empresa`, already has tenant-scoped admin flows, and already maps domain status into frontend messaging. The missing piece is an initial notification contract for state transitions that matter operationally: degraded after activation and recovered after degradation.

## Goals / Non-Goals

**Goals:**
- Notify the tenant when a previously active custom domain degrades after activation.
- Notify the tenant again when that degraded domain recovers and becomes canonical once more.
- Deduplicate repeated notifications so recurring background checks do not spam the tenant while the domain remains in the same state.
- Expose the latest notification context in `/admin/profile` so the tenant can understand what alert was sent and why.
- Keep notification scope tightly aligned with active-domain monitoring transitions rather than generalizing to all domain lifecycle events.

**Non-Goals:**
- Building a general-purpose notification center for the whole admin product.
- Adding SMS, WhatsApp, push notifications, or arbitrary outbound channels in this slice.
- Notifying for every onboarding retry or every transient pre-activation verification failure.
- Introducing user-level notification preferences or multi-recipient routing rules.

## Decisions

### 1. Notify only on meaningful state transitions
The first slice should emit notifications only when a previously active custom domain enters a degraded state and when that same domain later recovers.

**Why this approach**
- Those are the moments with the clearest tenant impact: a storefront URL stopped being canonical, or it became canonical again.
- It avoids noise from the existing retry-heavy monitoring loop.
- It keeps the change small and directly tied to the monitoring state machine that now exists.

**Alternatives considered**
- Notify on every failed monitoring attempt: rejected because it would quickly spam tenants during recovery windows.
- Notify for all onboarding failures too: rejected because that broadens the change into a more general notification system.

### 2. Use one persisted latest-notification record per domain state transition
The backend should persist the latest notification category, reason, sent-at timestamp, and delivery status alongside the existing custom-domain monitoring metadata.

**Why this approach**
- `/admin/profile` needs a stable contract for showing what the tenant was last told.
- The monitoring worker needs a simple deduplication mechanism that can decide whether the current state transition has already been notified.
- Persisting the latest outbound result keeps the initial design operationally observable without needing a separate notification ledger yet.

**Alternatives considered**
- Store notification state only in logs: rejected because the admin UI would have no tenant-facing source of truth.
- Build a full notification history table now: rejected because the first slice only needs latest-context visibility and deduplication.

### 3. Initial delivery should combine transactional email with persistent admin-surface context
The first production slice should attempt an email notification to the tenant account while also exposing the latest alert state in `/admin/profile`.

**Why this approach**
- Email provides the proactive signal that the current product is missing.
- Admin-surface context lets the tenant verify what happened even if email delivery fails or is missed.
- This keeps the channel model simple: one outbound channel plus one in-product confirmation surface.

**Alternatives considered**
- Admin-only notification banner: rejected because it still requires the tenant to discover the problem by logging in.
- Email-only notification with no admin trace: rejected because it weakens supportability and makes delivery failures opaque.

### 4. Deduplicate by monitored state category, not by raw failure message
Deduplication should key off coarse state transitions such as `degraded` and `recovered`, rather than the exact DNS/TLS failure text.

**Why this approach**
- Monitoring error messages may vary slightly across repeated checks even while the tenant-impacting state stays the same.
- The tenant cares that the domain is degraded or recovered, not whether the latest wording changed from one attempt to the next.
- This keeps the state machine stable and easier to reason about in both backend and UI.

**Alternatives considered**
- Deduplicate by exact error string: rejected because it is brittle and can generate duplicate alerts for effectively the same outage.

### 5. Notification sending should remain inside the domain monitoring workflow boundary
The monitoring flow should trigger notification attempts as part of its existing state-transition handling rather than creating a new independent scheduler.

**Why this approach**
- The monitoring workflow already knows exactly when a domain changes state.
- It avoids introducing another asynchronous subsystem while the requirement is still narrow.
- It keeps the implementation closer to the business event that matters: degraded and recovered transitions.

## Risks / Trade-offs

- **[Email delivery introduces infrastructure dependency]** → Mitigation: keep admin-surface notification context as the durable fallback even when outbound delivery fails.
- **[Latest-only persistence loses long-term history]** → Mitigation: scope the first slice to current-state communication and leave full notification history for a later change if needed.
- **[State-transition deduplication can hide repeated outages]** → Mitigation: notify again only when the domain first recovers and then degrades in a new cycle.
- **[Monitoring and notifications become more tightly coupled]** → Mitigation: keep the notification trigger limited to two explicit transitions rather than embedding generic messaging rules into the worker.

## Migration Plan

1. Extend the custom-domain monitoring model with latest-notification metadata for degraded and recovered alerts.
2. Update the monitoring workflow so degraded and recovered transitions attempt notification delivery exactly once per state cycle.
3. Expose latest notification context through tenant admin profile responses and UI messaging.
4. Roll back by disabling outbound delivery while preserving the current monitoring and fallback logic; admin context can continue to show operational state even without sent notifications.

## Open Questions

- Should the first slice send notifications only to the authenticated tenant owner account, or to every active admin user in the same `Empresa`?
- Does the initial email copy need separate templates for DNS degradation versus HTTPS degradation, or is one degraded-domain template enough?
- Should a failed email delivery itself become tenant-visible in `/admin/profile`, or should the UI only expose that a notification attempt was made?
