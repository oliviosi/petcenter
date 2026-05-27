## Context

The previous custom-domain change established tenant-visible onboarding state, canonical-link switching rules, and host-aware public entry, but it intentionally stopped short of operational verification. The backend now stores desired and active domains plus lifecycle state, yet there is no automated process that checks DNS, records retry attempts, or promotes a domain to active when the expected record finally propagates.

This follow-up change spans backend domain logic, persistence, background execution, and frontend admin visibility. It also needs to stay aligned with the multi-tenant storefront-first model: the shared-host slug route remains the safe public fallback until verification succeeds, and verification must not require tenants or admins to perform manual state transitions in the database or application code.

## Goals / Non-Goals

**Goals:**
- Introduce an automated verification process that checks whether a desired storefront domain points to the expected target.
- Persist enough operational metadata to show progress, latest outcome, retry timing, and activation timing to tenant users.
- Automatically activate the verified domain and switch the canonical storefront URL after successful verification.
- Keep retries and failure handling recoverable without removing the existing fallback behavior.
- Make the design flexible enough to support environment-specific DNS targets without coupling the flow to one DNS provider SDK.

**Non-Goals:**
- Supporting provider-managed DNS setup or automated record creation inside third-party DNS consoles.
- Adding apex-domain-specific routing or certificate strategy in this slice.
- Introducing tenant confirmation as a second approval step after verification succeeds.
- Building a generalized workflow engine for arbitrary background jobs outside domain verification.

## Decisions

### 1. Use a backend polling verifier instead of provider callbacks
Domain readiness should be determined by a backend-owned verification loop that resolves DNS on a schedule and compares the result with the expected storefront target.

**Why this approach**
- DNS propagation is naturally eventual; polling matches the problem better than synchronous request/response checks.
- It avoids coupling the platform to a specific registrar or DNS provider integration.
- It works equally for manual retries and periodic background attempts.

**Alternatives considered**
- Trigger verification only from the admin UI: rejected because domains could become valid long after the user leaves the page.
- Rely on provider webhooks: rejected because the product currently has no provider-specific dependency and wants to stay implementation-agnostic.

### 2. Extend the existing `Empresa` domain state with verification metadata, not a new shared workflow module
Verification should continue to be modeled as tenant-scoped storefront state under `Empresas`, augmented with fields such as last verification attempt, next retry time, verified-at, and failure details.

**Why this approach**
- The desired domain, active domain, and canonical-link rules already belong to the storefront aggregate.
- It preserves the modular-monolith rule that modules remain self-contained instead of pushing cross-cutting state into a generic shared folder.
- The admin console and host-aware routing already read domain state from the tenant storefront context.

**Alternatives considered**
- Create a generic shared job or domain-management module immediately: rejected because it adds abstraction before there is a second comparable use case.

### 3. Auto-activate the custom domain immediately after successful verification
When verification succeeds, the platform should mark the desired domain as active automatically and switch canonical sharing away from the shared-host fallback.

**Why this approach**
- It closes the loop promised by automated verification without requiring a second tenant action.
- The existing onboarding spec already frames verification success as the gate for activation.
- It keeps the tenant answer to “which link should I share now?” unambiguous.

**Alternatives considered**
- Require explicit tenant approval after verification: rejected for this slice because it adds UI and state complexity without solving an immediate business risk.

### 4. Represent retries as scheduled next-attempt timestamps plus recoverable failure state
The verifier should store the latest attempt outcome, classify the domain as failed when the current attempt does not pass, and schedule a later retry instead of exhausting the workflow permanently.

**Why this approach**
- DNS failures are often temporary, so “failed” must still be recoverable.
- A scheduled next attempt gives the admin UI a concrete message beyond “still pending”.
- It keeps background processing simple without inventing a full queue protocol for this slice.

**Alternatives considered**
- Keep the domain in `verifying` forever until success: rejected because tenants need explicit visibility into failure and expected retry behavior.
- Stop retries after the first failure and require manual restart: rejected because it adds avoidable operator friction.

### 5. Surface verification status through the existing `/admin/profile` console
The admin storefront flow should show the latest verification attempt status, last checked feedback, and retry-oriented guidance in the same place where tenants already manage publication and the desired domain.

**Why this approach**
- Domain automation is an operational extension of the existing storefront ownership console.
- It avoids making tenants hunt for a second screen just to understand why their URL is not live yet.
- The canonical-link rules are already visible there, so verification progress belongs alongside them.

**Alternatives considered**
- Create a dedicated verification dashboard: rejected because it fragments the setup experience and adds navigation overhead too early.

## Risks / Trade-offs

- **[Polling can be noisy or too aggressive]** → Mitigation: store `nextRetryAt` and use bounded retry cadence with backoff instead of tight loops.
- **[Automatic activation changes the canonical URL without a fresh user action]** → Mitigation: make `/admin/profile` show the last verification outcome and clearly indicate when the domain became active.
- **[DNS resolution can vary across environments]** → Mitigation: keep the expected DNS target configurable via environment-backed settings rather than hardcoding one hostname.
- **[Background execution inside the API process is operationally simpler but less isolated]** → Mitigation: keep the verification worker narrow in scope and idempotent so it can later move to a separate process if needed.
- **[Stale desired domains may keep retrying for too long]** → Mitigation: reset the schedule when the tenant changes or removes the desired domain, and expose the current status clearly in the admin console.

## Migration Plan

1. Add persistence fields required for automated verification metadata and configurable verification target settings.
2. Implement a backend verification service plus scheduled/background execution that evaluates eligible desired domains.
3. Update tenant storefront APIs to expose verification progress, latest outcome, next retry timing, and activation timing.
4. Extend `/admin/profile` to show operational verification messaging while preserving the shared-host fallback until activation.
5. Rollback by disabling the verifier and leaving domains on the existing shared-host fallback; the desired-domain records may remain persisted without becoming active.

## Open Questions

- What exact retry cadence and failure threshold best balance propagation realism against noisy repeated checks?
- Whether the first operational slice should surface a manual “verify now” action in addition to automatic retries.
- Whether activation should also record certificate-readiness state now or continue treating DNS verification as the only activation gate in this slice.
