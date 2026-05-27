## Context

The current custom-domain pipeline ends at first successful activation: once DNS verification and certificate readiness succeed, the domain becomes canonical and the shared-host route stops being treated as the primary storefront URL. That covers the onboarding path well, but it leaves a production gap because active domains can later regress if the tenant changes DNS, HTTPS stops resolving safely, or the platform edge temporarily loses readiness for that hostname.

This change extends the same provider-agnostic architecture already used for DNS and TLS readiness. The product already persists staged domain state on `Empresa`, runs background processing for readiness, and maps operational status into `/admin/profile`. The missing piece is defining what happens after activation: how active domains continue to be checked, how regressions are recorded, when canonical fallback returns to the shared-host route, and how the tenant understands that recovery is still being handled automatically.

## Goals / Non-Goals

**Goals:**
- Continue background readiness checks for fully active custom domains after activation.
- Detect both DNS drift and HTTPS readiness regressions for domains that were previously active.
- Record the latest healthy monitoring signal separately from the latest degraded outcome so the tenant can understand what changed.
- Restore the shared-host storefront route as the canonical fallback whenever an active custom domain is no longer fully ready.
- Reuse the existing recovery pipeline so a degraded domain can become active again automatically after readiness is restored.

**Non-Goals:**
- Building tenant-facing controls for manually pausing or resuming monitoring.
- Integrating registrar-side automation, provider dashboards, or CDN-native health webhooks.
- Introducing wildcard-domain handling or changing apex/subdomain onboarding rules again.
- Replacing the current staged verification architecture with a generic background-jobs framework.

## Decisions

### 1. Treat active-domain monitoring as an extension of the existing readiness pipeline
After a custom domain becomes active, the same background worker family should continue evaluating it on a monitoring cadence instead of considering activation terminal.

**Why this approach**
- It extends the current lifecycle without introducing a separate operational subsystem.
- DNS verification and certificate readiness already represent the two signals that define whether a domain is safe to serve.
- It allows degraded domains to flow back through the same recovery model that already exists for pre-activation failures.

**Alternatives considered**
- Build a second, post-activation health subsystem: rejected because it duplicates readiness logic and operational state.

### 2. Persist last healthy and last degraded monitoring timestamps separately
The aggregate should keep both the latest known healthy monitoring confirmation and the latest degraded monitoring outcome, rather than overloading one timestamp or one failure field.

**Why this approach**
- Tenants and operators need to know whether the domain was ever healthy recently and when it most recently regressed.
- It keeps the UI and API able to distinguish “still degraded” from “healthy until just now.”
- It avoids hiding important state transitions inside one generic retry timestamp.

**Alternatives considered**
- Reuse only the existing verification timestamps: rejected because they describe onboarding completion, not ongoing health.

### 3. Canonical fallback should switch back to the shared host as soon as active readiness regresses
If an active custom domain fails DNS monitoring or HTTPS readiness monitoring, the platform should stop treating that custom domain as canonical until end-to-end readiness is restored.

**Why this approach**
- The shared-host route is the safe fallback already established by previous changes.
- It prevents the tenant-facing canonical link from pointing to a hostname that is no longer reliably serving traffic.
- It keeps the contract simple: only fully ready custom domains are canonical, regardless of whether they are newly onboarding or previously active.

**Alternatives considered**
- Keep the degraded custom domain canonical while monitoring retries continue: rejected because it weakens the safety rule already established for staged readiness.

### 4. Recovery should remain automatic and idempotent
Once a degraded active domain becomes healthy again, the platform should restore canonical activation without requiring the tenant to re-enter the domain or trigger a manual recovery step.

**Why this approach**
- It matches the background-automation model already used during initial onboarding.
- It avoids forcing tenants to perform unnecessary administrative steps for transient outages or corrected DNS drift.
- It keeps the operational contract symmetric: the same signals that can remove canonical status can restore it.

**Alternatives considered**
- Require a manual “reactivate domain” action: rejected because it adds support burden and breaks the automation model.

### 5. `/admin/profile` should expose post-activation monitoring as a recoverable operational state
The admin console should distinguish a previously active domain that became degraded from a domain that never finished onboarding, while still presenting both as recoverable flows managed by the platform.

**Why this approach**
- The tenant needs to understand whether the problem is initial setup or an operational regression.
- It enables clearer support messaging without changing the core safety contract.
- It fits naturally into the existing storefront profile area that already shows canonical link, DNS progress, and TLS progress.

**Alternatives considered**
- Collapse degraded-active and pending-onboarding states into one generic failure message: rejected because it hides the operational history and makes support harder.

## Risks / Trade-offs

- **[Monitoring active domains increases operational load]** → Mitigation: reuse the existing worker model and configurable cadences rather than introducing per-domain custom behavior.
- **[Transient DNS or HTTPS failures may cause churn in canonical fallback]** → Mitigation: use the same explicit readiness criteria and retry scheduling model already established for staged verification.
- **[State mapping becomes harder once onboarding and post-activation recovery coexist]** → Mitigation: keep “last healthy” and “last degraded” as explicit metadata and expose degraded-active messaging separately in the admin API.
- **[Tenants may be surprised when canonical fallback switches back automatically]** → Mitigation: make the fallback rule explicit in admin copy and canonical-link status.

## Migration Plan

1. Extend the custom-domain state model to support post-activation monitoring metadata for active domains.
2. Update the background readiness workflow so active domains stay eligible for DNS and HTTPS re-checks on a monitoring cadence.
3. When monitoring detects degraded readiness, record the degraded outcome and revert canonical storefront selection to the shared-host fallback.
4. Keep automatic retries active so the custom domain becomes canonical again once readiness is restored.
5. Roll back by disabling active-domain monitoring and preserving the current “activation is terminal” behavior while leaving the shared-host fallback as the safe default for degraded domains.

## Open Questions

- Should the first production slice expose a tenant-visible distinction between “temporarily degraded” and “removed from canonical service,” or is one degraded-active state enough?
- Do we want the first slice to monitor active domains on the same cadence as onboarding retries, or introduce a separate steady-state monitoring interval?
- Should operational alerts remain admin-console-only in the first slice, or is there a follow-up change for proactive notifications?
