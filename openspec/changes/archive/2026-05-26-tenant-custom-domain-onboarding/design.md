## Context

The storefront-first product model is now in place: each petshop has a public storefront, the tenant can manage publication state, and the admin console already exposes the canonical storefront link. The remaining white-label gap is URL ownership. Even with the correct storefront flow, a shared `petcenter` host still makes the product feel platform-owned rather than tenant-owned.

This change crosses admin experience, public routing expectations, and infrastructure contracts. The product needs a guided onboarding flow where the tenant can register a custom domain or subdomain, see exactly which DNS record is required, understand whether verification is pending or complete, and know which URL is currently canonical. At the same time, the public shell must remain safe: if a custom domain is not ready, traffic must continue to work through the existing slug-based fallback on the shared host.

## Goals / Non-Goals

**Goals:**
- Add a tenant-facing onboarding flow for connecting a custom storefront domain or subdomain.
- Define domain lifecycle states such as pending setup, verifying, active, failed, and removed.
- Make the canonical storefront URL switch explicitly between shared-host fallback and custom-domain entry when activation succeeds.
- Allow the storefront-first public shell to resolve a tenant storefront from the request host when a custom domain is active.
- Preserve slug-based fallback routes while the custom domain is not active or if it is removed later.

**Non-Goals:**
- Building a generic multi-domain CMS or arbitrary domain marketplace.
- Supporting multiple simultaneously active custom storefront domains for one tenant in the first slice.
- Replacing the existing slug-based routing as an immediate hard cutover.
- Delivering full visual brand customization in the same slice.

## Decisions

### 1. Treat custom-domain onboarding as a stateful workflow, not a single input
The system should model domain onboarding as a lifecycle with explicit operational states instead of just storing a hostname string.

**Why this approach**
- Domain connection has real intermediate states: waiting for DNS, verifying ownership, activation, and failure recovery.
- Tenants need to understand why a domain is not yet live, not just that a value was saved.
- It keeps the admin UX aligned with the operational reality of external DNS propagation.

**Alternatives considered**
- Save the desired domain with no lifecycle state: rejected because it hides operational progress and failure handling.

### 2. Keep one canonical public URL at a time with shared-host fallback
The product should always expose one canonical storefront URL to the tenant: either the active custom domain when verified, or the shared petcenter-hosted storefront link while custom-domain onboarding is incomplete.

**Why this approach**
- Tenants need a single answer to “which link should I share now?”
- It avoids downtime or ambiguity during DNS propagation and rollback.
- It reuses the existing storefront-link-management model instead of creating competing URLs.

**Alternatives considered**
- Show both URLs as equally canonical: rejected because it weakens trust and creates operational confusion.

### 3. Resolve storefront context by host first, slug fallback second
When a request arrives on an active custom domain, the public shell should resolve the tenant storefront from the host. If no active custom-domain mapping exists, the shared-host slug route remains the fallback entry.

**Why this approach**
- Host-based entry is the essence of the white-label step.
- Slug-based fallback preserves continuity and rollback safety.
- This lets the custom-domain slice build on the existing storefront-first architecture instead of replacing it wholesale.

**Alternatives considered**
- Hard-switch immediately to domain-only access: rejected because it increases migration risk and removes fallback.
- Keep custom domains only as redirects into slug routes: rejected because it preserves the wrong product feel for white-label.

### 4. Keep domain onboarding inside the existing storefront console
The first slice should extend `/admin/profile` rather than creating a separate domain-management area.

**Why this approach**
- URL ownership is part of storefront ownership.
- The admin console already contains publication state and canonical link context.
- It keeps future white-label setup concentrated in one tenant-facing workflow.

**Alternatives considered**
- Create a standalone `/admin/domains` section immediately: rejected because it fragments the storefront setup experience too early.

### 5. Scope the first slice to one active custom domain per tenant
The first implementation should support a single desired custom domain and a single active mapping per tenant storefront.

**Why this approach**
- One storefront, one canonical public entry is consistent with the current single-petshop commercial model.
- It reduces infrastructure and UI complexity while proving the workflow.

**Alternatives considered**
- Allow multiple active domains from the start: rejected because it complicates canonical-link rules, onboarding, and support flows without immediate product need.

## Risks / Trade-offs

- **[DNS propagation is outside product control]** → Mitigation: model verification as asynchronous state with explicit tenant-facing guidance.
- **[Host-based routing increases operational complexity]** → Mitigation: keep slug-based fallback active and avoid removing the shared-host route in this slice.
- **[Canonical URL may change during activation]** → Mitigation: clearly show which link is canonical now versus which domain is pending activation.
- **[Misconfigured domains can create broken public entry]** → Mitigation: require successful verification before marking the custom domain active for storefront sharing.
- **[Infrastructure details may vary between environments]** → Mitigation: define capability-level behavior and onboarding states without over-coupling the spec to one DNS provider implementation.

## Migration Plan

1. Extend OpenSpec coverage for tenant custom-domain onboarding and update the affected storefront capabilities.
2. Add tenant-facing domain onboarding states and DNS guidance in the storefront console.
3. Define canonical-link switching between shared-host fallback and active custom domain.
4. Add host-aware storefront entry behavior in the public shell while preserving shared-host slug access.
5. Rollback by disabling custom-domain activation and keeping the shared petcenter-hosted storefront link as the only canonical public entry.

## Open Questions

- Whether the first slice should allow apex domains, subdomains only, or both from day one.
- Whether activation should switch traffic automatically after verification or require an explicit tenant confirmation step.
