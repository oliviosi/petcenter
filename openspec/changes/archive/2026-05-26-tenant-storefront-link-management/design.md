## Context

The product now treats each petshop storefront as the main public entry point, but the tenant console still stops at profile editing and publication status. Operators can update slug and visibility, yet they do not have a first-class management surface for the exact public link they should distribute to clients.

This is primarily an admin-console change with product-model implications. The canonical storefront route already exists in the public shell as `/petshops/[slug]`, and the authenticated public profile flow already exposes the slug and publication state. The main gap is operational clarity: the system should tell the tenant what the current public link is, whether it is already shareable, and why it may still be unavailable.

## Goals / Non-Goals

**Goals:**
- Expose the canonical public storefront link inside the tenant admin console.
- Make link availability understandable across published, unpublished, incomplete, and missing-slug states.
- Reuse the existing storefront profile data and routing model instead of adding new backend contracts.
- Keep the UX ready for future white-label evolution by making the current slug-based link explicit.

**Non-Goals:**
- Introducing custom domains, subdomains, or host-based tenant routing.
- Creating a full storefront preview system, QR-code generator, or campaign-sharing toolkit.
- Changing the public storefront route structure away from `/petshops/[slug]`.
- Adding a new backend entity just to persist link metadata already derivable from the storefront profile.

## Decisions

### 1. Derive the canonical storefront link from the current public route model
The admin console will treat the canonical storefront link as the public frontend origin plus `/petshops/{slug}`.

**Why this approach**
- The single-petshop storefront experience already depends on slug-based public routes.
- The existing public profile data already owns the slug, so no duplicate source of truth is needed.
- It keeps this slice lightweight while still making the tenant-facing link explicit.

**Alternatives considered**
- Persist a separate canonical-link field in the backend: rejected because it would duplicate route-derived data.
- Introduce root-level tenant links now: rejected because it expands scope into routing and collision management.

### 2. Model storefront link availability as active, preview, or unavailable
The UI should distinguish between a link that is already public and shareable, a predicted link path that exists but is not yet public, and a fully unavailable state when the slug is missing.

**Why this approach**
- Tenants need to know not only the target URL but also whether clients can use it right now.
- Publication and validation already create meaningful operational states in the storefront workflow.
- It avoids a misleading copy action when the storefront cannot yet be accessed publicly.

**Alternatives considered**
- Show the same link regardless of state: rejected because it blurs whether the storefront is actually reachable.
- Hide the link until the storefront is public: rejected because it removes useful setup guidance before publication.

### 3. Keep link management inside the existing storefront profile section
The link surface should extend the current `/admin/profile` experience instead of introducing a separate admin area.

**Why this approach**
- Link ownership is part of storefront maintenance, not a separate operational domain.
- The existing section already communicates slug and publication context.
- It minimizes navigation growth while keeping future storefront controls in one place.

**Alternatives considered**
- Create a dedicated “links” page: rejected because it would fragment storefront management too early.

### 4. Limit the first slice to product-native actions
The first implementation should support actions such as copy/open and explanatory states, without direct integrations with WhatsApp, QR generation, or external shorteners.

**Why this approach**
- The immediate problem is clarity around the canonical public link.
- Product-native actions are enough to unlock manual sharing by the tenant.
- It preserves room for later growth without over-designing the first slice.

**Alternatives considered**
- Bundle sharing integrations immediately: rejected because it increases UI and dependency scope before validating the core link-management need.

## Risks / Trade-offs

- **[Link availability can be confused with publication readiness]** → Mitigation: explicitly label active, preview, and unavailable states in pt-BR with clear explanations.
- **[Frontend origin can vary by environment]** → Mitigation: base canonical-link construction on the configured public app origin used by the frontend instead of hardcoded host assumptions.
- **[Operators may expect richer sharing tools]** → Mitigation: frame this slice as canonical link management only, not a full marketing/share toolkit.
- **[Future white-label routing may replace the slug path]** → Mitigation: isolate copy and state concepts from host-level assumptions so a later custom-domain change can swap the route target cleanly.

## Migration Plan

1. Extend OpenSpec coverage for tenant storefront link management and align the storefront console requirements.
2. Add the canonical link panel and availability-state messaging to the admin storefront profile experience.
3. Reuse existing slug/publication data to derive the current link target and the appropriate UI state.
4. Update tests and documentation around how tenants access and share the storefront link.
5. If rollback is needed, remove the dedicated link-management UI while keeping the underlying slug-based public storefront routes unchanged.

## Open Questions

- None at proposal time; the current slug-based storefront model is sufficient for the first link-management slice.
