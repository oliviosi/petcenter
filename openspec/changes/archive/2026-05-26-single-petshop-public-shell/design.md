## Context

The public product currently behaves like a marketplace: the primary shell starts at `/`, pushes users toward `/petshops`, and treats petshop detail and booking as later steps in a discovery funnel. That no longer matches the intended commercial model, where each contracted petshop should have its own direct public entry point and the client should experience a storefront for one specific petshop instead of a multi-petshop catalog.

The codebase already has a strong foundation for this shift. Public detail and booking pages are slug-based, and booking submission, status follow-up, and feedback follow-up already operate downstream from a single petshop context. The main gap is the shell and routing priority: public discovery still presents catalog browsing as the default entry instead of a tenant-owned storefront journey.

This change is therefore a product-model and shell-level refocus, not a booking-core rewrite. It should preserve current public booking contracts and tenant-managed storefront data while changing what the public shell treats as the default path.

## Goals / Non-Goals

**Goals:**
- Make a petshop-specific storefront the primary public entry point for the booking journey.
- Reuse existing slug-based detail and booking flows wherever possible instead of creating a parallel booking implementation.
- Reduce the public catalog from the main product funnel to a secondary or optional discovery surface.
- Keep public booking status and public feedback follow-up stable after the storefront-to-booking transition.
- Align public routing, copy, and information architecture with the one-link-per-petshop commercial direction.

**Non-Goals:**
- Introducing custom domains or subdomain-based tenant routing in this slice.
- Changing backend booking queue behavior, booking contracts, or public feedback/status tokens.
- Reworking tenant admin profile management beyond what is needed to support direct storefront access.
- Removing the catalog infrastructure entirely if it still serves as fallback or secondary discovery.

## Decisions

### 1. Treat the storefront as the primary public shell and keep booking downstream
The public shell will shift from a catalog-first experience to a storefront-first experience, where the user lands in a single petshop context before moving into booking.

**Why this approach**
- It matches the target business model without rewriting the booking core.
- The current `/petshops/[slug]` and `/petshops/[slug]/book` flow already carries the correct petshop context.
- It avoids mixing a major visual shift with unnecessary contract churn.

**Alternatives considered**
- Send users directly to booking as the primary entry: rejected because it loses storefront context, trust-building content, and brand differentiation.
- Keep catalog-first UX and only add optional direct links: rejected because it would preserve the wrong mental model as the main product experience.

### 2. Keep slug-based petshop access in this slice
The change will continue to rely on slug-based petshop addressing rather than introducing domain-based or root-level tenant routing immediately.

**Why this approach**
- Slug-based routes already exist and are operational.
- It lowers routing and infrastructure complexity while still delivering a one-link-per-petshop public experience.
- It preserves a clean migration path toward future custom-domain white-label work.

**Alternatives considered**
- Root-level slug routing such as `/{slug}`: rejected for now because it increases route-collision risk and broadens the change unnecessarily.
- Custom domains or subdomains: rejected for now because they belong to a later infrastructure-oriented white-label change.

### 3. Demote catalog search instead of removing it immediately
The catalog capability should become secondary or optional rather than being removed outright in the same slice.

**Why this approach**
- Existing code and specs depend on catalog infrastructure.
- Some public fallback or internal transition use cases may still benefit from catalog access while the product direction changes.
- This avoids making the change larger than necessary.

**Alternatives considered**
- Hard-remove the public catalog immediately: rejected because it would bundle product-model refocus with broader cleanup and migration work.

### 4. Reuse tenant-maintained public profile as the storefront source of truth
The tenant-managed storefront profile will remain the source of truth for public identity, summary content, and operational storefront context.

**Why this approach**
- The admin console already owns slug, description, city, neighborhood, and visibility state.
- The storefront experience should remain tenant-maintained rather than duplicating profile data elsewhere.
- This keeps multi-tenant boundaries and ownership clear.

**Alternatives considered**
- Introduce a separate storefront configuration model: rejected because it would duplicate scope and add backend complexity without first proving the shell change.

## Risks / Trade-offs

- **[Catalog and storefront models may coexist awkwardly during transition]** → Mitigation: define clearly that storefront is primary and catalog is secondary; reflect that distinction in specs and copy.
- **[Homepage behavior may become ambiguous]** → Mitigation: make homepage behavior an explicit requirement in the new capability rather than leaving it implicit.
- **[Future white-label domain work may reshape routes again]** → Mitigation: keep this slice route-light and centered on the existing slug model so a later host-based change can build on it cleanly.
- **[Some existing public search expectations will no longer describe the main journey]** → Mitigation: update the affected specs directly instead of treating this as frontend-only copy work.

## Migration Plan

1. Update OpenSpec requirements so the public shell is defined around a petshop-specific storefront journey.
2. Rework the public frontend entry points and route priorities to point users into a single petshop context first.
3. Preserve the current downstream booking, booking status, and feedback flow behavior.
4. Leave catalog infrastructure available only if still needed as a secondary discovery surface.
5. If rollback is needed, restore the catalog-first shell behavior without changing booking APIs or tenant storefront data.

## Open Questions

- Whether `/` should become a minimal neutral shell, a configurable redirect target, or a fallback-only entry during the single-petshop experience.
