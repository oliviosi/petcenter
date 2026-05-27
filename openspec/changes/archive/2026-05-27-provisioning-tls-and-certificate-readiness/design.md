## Context

The previous domain-verification change moved custom storefront domains from manual onboarding into automated DNS verification, but it still activates the domain immediately after DNS success. That shortcut is acceptable for internal testing, yet it is incomplete for production-grade storefront delivery because HTTPS readiness depends on certificate issuance, propagation, and successful edge activation after DNS is already correct.

This change introduces a second operational stage between DNS verification and final canonical activation. The backend must persist TLS-readiness state, background processing must continue after DNS succeeds, and the admin storefront experience must show that a domain can be DNS-valid while still waiting for certificate provisioning. The shared-host fallback must remain the public-safe default until the full pipeline is complete.

## Goals / Non-Goals

**Goals:**
- Separate DNS verification success from full storefront activation.
- Model certificate-readiness as a distinct operational state with retries, latest outcome, and completion timestamps.
- Keep the shared-host fallback canonical until HTTPS readiness succeeds.
- Expose the staged readiness pipeline clearly in `/admin/profile`.
- Preserve the provider-agnostic architecture so certificate readiness can be driven by configurable platform checks instead of vendor SDK lock-in.

**Non-Goals:**
- Building an end-user UI for managing certificates directly.
- Integrating registrar-side DNS automation or CDN-specific certificate APIs in this slice.
- Supporting apex-domain routing strategy changes in the same change.
- Reworking the current domain-verification worker into a general background-jobs framework.

## Decisions

### 1. Introduce certificate-readiness as a second stage after DNS verification
The system should treat domain activation as a two-step pipeline: DNS verified first, TLS/certificate ready second. DNS success should advance the domain into certificate provisioning instead of marking it active immediately.

**Why this approach**
- It reflects the operational reality of custom domains: HTTPS readiness often lags behind DNS propagation.
- It prevents the tenant-facing canonical link from switching before the platform can serve the domain safely.
- It preserves a clean mental model: “verified” and “ready to use” are not the same state.

**Alternatives considered**
- Keep the current DNS-success-equals-active rule: rejected because it can promote a custom URL too early.
- Hide TLS internally and keep one visible status: rejected because the admin console would lose the ability to explain why the shared-host fallback is still canonical.

### 2. Persist TLS-readiness metadata on the existing `Empresa` aggregate
Certificate-readiness metadata should live alongside the current desired-domain and DNS-verification fields, with separate timestamps and failure state for TLS provisioning.

**Why this approach**
- The storefront aggregate already owns the desired domain, active domain, and canonical activation rules.
- Keeping both stages together simplifies tenant-facing state mapping in the admin APIs.
- It avoids violating the repository rule against introducing cross-cutting shared modules prematurely.

**Alternatives considered**
- Create a separate certificate aggregate or shared readiness module: rejected because it adds indirection before a second comparable workflow exists.

### 3. Use readiness polling, not certificate-provider callbacks
The platform should continue with the same architectural style used for DNS: background polling against configurable readiness criteria instead of provider-specific callbacks.

**Why this approach**
- It stays consistent with the current implementation model and keeps provider concerns abstract.
- It avoids coupling the monolith to one CDN or certificate authority API.
- It supports local and non-production environments more easily through configurable readiness targets.

**Alternatives considered**
- Depend on external webhook callbacks from a certificate provider: rejected because the product is not yet committed to one provider.

### 4. Promote to active only after end-to-end readiness succeeds
The custom domain should become canonical only when both DNS verification and certificate readiness have succeeded.

**Why this approach**
- It aligns the canonical link with what tenants can safely share immediately.
- It makes the shared-host fallback rule explicit and durable during the full provisioning window.

**Alternatives considered**
- Activate on DNS success and later backfill certificate state: rejected because it can expose tenants to mixed or broken readiness.

### 5. Expose DNS and TLS as separate tenant-facing progress signals
The admin experience should show which stage is complete and which stage is still blocking activation, rather than collapsing everything into a single status label.

**Why this approach**
- It gives tenants actionable clarity when support or setup troubleshooting is needed.
- It allows future extension into richer operational guidance without redefining the whole model.

**Alternatives considered**
- Keep a single linear custom-domain status with overloaded meanings: rejected because “failed” or “verifying” becomes ambiguous once TLS is added.

## Risks / Trade-offs

- **[The state model becomes more complex]** → Mitigation: keep DNS and TLS as distinct operational fields and map them into simple tenant-facing messaging.
- **[Provider-agnostic checks may be less precise than vendor-native signals]** → Mitigation: define readiness through configurable checks now and keep the abstraction flexible for future provider-specific adapters.
- **[Long certificate issuance times can delay canonical activation]** → Mitigation: keep shared-host fallback active and show clear progress and retry timestamps in the admin console.
- **[Background processing now spans two stages]** → Mitigation: keep each stage idempotent and ordered so repeated polling cannot incorrectly skip ahead.
- **[Teams may expect TLS support to include apex domains or custom CDN features]** → Mitigation: explicitly keep apex-domain strategy and provider integrations out of scope for this slice.

## Migration Plan

1. Add persistence fields for certificate-readiness status, timestamps, failure reason, and retry timing.
2. Update the domain-verification workflow so DNS success transitions into TLS provisioning instead of immediate activation.
3. Implement a certificate-readiness service and background polling path using configurable readiness checks.
4. Extend admin storefront responses and `/admin/profile` to show stage-by-stage readiness.
5. Rollback by disabling certificate-readiness automation and keeping the shared-host fallback canonical; existing domains remain on the safe default until the full readiness path is restored.

## Open Questions

- What exact platform signal should define TLS readiness in the first production slice: HTTPS probe, edge status lookup, or another configurable health check?
- Whether the first version should expose a tenant-visible “certificate issuing” state separately from “TLS retrying”.
- Whether the eventual active-domain promotion should record both DNS verification time and HTTPS readiness time independently in the long-term contract.
