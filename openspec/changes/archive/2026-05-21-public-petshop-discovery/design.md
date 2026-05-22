## Context

The backend already supports tenant authentication and operational management for petshops, professionals, services, and weekly availability. However, there is still no public catalog that lets clients discover active petshops and inspect the active professionals and services they offer.

The chosen direction is a simple catalog, not proximity-first discovery. That means the first public discovery slice should rely on explicit public profile fields such as city, neighborhood, description, and contact summary rather than latitude/longitude or distance calculations. The implementation must remain read-only and public-facing while preserving the existing tenant-scoped write model for operational maintenance.

## Goals / Non-Goals

**Goals:**
- Extend `Empresa` with the public profile data needed for catalog browsing.
- Add public list and detail endpoints for active petshops.
- Add simple catalog filters by public petshop attributes and offered services.
- Expose only active public records, including active professionals and active services.
- Keep the public discovery model compatible with future booking flows without introducing slot logic now.

**Non-Goals:**
- Geolocation-based ranking, radius search, or map features.
- Booking requests, slot availability computation, or RabbitMQ integration.
- Ratings, favorites, or recommendation algorithms.
- Full CMS-style media management for petshop pages.
- Assigning services to specific professionals in this change.

## Decisions

### 1. Extend `Empresa` instead of creating a separate public profile aggregate

The first public catalog should extend the existing `Empresa` model with a focused set of public fields such as slug, description, city, neighborhood, address summary, contact summary, and a flag that controls whether the petshop is publicly listed. This keeps the source of truth close to tenant identity and reduces duplication in the early product stage.

**Alternatives considered:**
- Create a separate public profile table now: rejected because it adds complexity before the public shape is proven.
- Keep using only the current `Empresa.Nome`: rejected because catalog browsing needs richer public information.

### 2. Keep public discovery read-only and unauthenticated

Public discovery endpoints should be exposed without authentication and should never reveal tenant-internal identifiers beyond what is needed for public detail routing. The public surface must compose only records that are intentionally public and currently active.

**Alternatives considered:**
- Reuse authenticated tenant endpoints for the public app: rejected because it mixes operational and customer-facing concerns.
- Require anonymous session bootstrap before discovery: rejected because it adds friction without immediate value.

### 3. Use slug-based public detail routes

Petshop detail pages should be addressed by a stable public slug rather than internal IDs. Slugs are more suitable for public URLs and decouple the catalog experience from internal database identifiers.

**Alternatives considered:**
- Use raw GUIDs in public routes: rejected because they are poor public identifiers.
- Use city + name as implicit key: rejected because uniqueness and rename handling become fragile.

### 4. Filter discovery through catalog-friendly attributes

The first public search should support filters by petshop name, city, neighborhood, and offered service name. This matches the chosen simple-catalog strategy and avoids premature complexity around distance, ranking, or advanced search infrastructure.

**Alternatives considered:**
- Add proximity and geospatial filtering now: rejected because the product explicitly chose a simple catalog for this phase.
- Support every operational filter at once: rejected because discovery should start with the most useful and understandable catalog filters.

### 5. Compose detail responses from active operational records only

Public petshop detail should include only active professionals and active services belonging to the petshop, and it should omit internal operational state not needed for discovery. This aligns public behavior with the operational lifecycle decisions from the previous change.

**Alternatives considered:**
- Show inactive records for history or completeness: rejected because it would confuse discovery users.
- Duplicate public copies of professionals and services now: rejected because the current operational records already contain the needed public fields.

## Risks / Trade-offs

- **[Risk] Extending `Empresa` for public needs may become crowded over time** -> Mitigation: keep the initial field set focused and split to a dedicated public aggregate later only if the model truly outgrows `Empresa`.
- **[Risk] Slug uniqueness and rename behavior can create migration friction** -> Mitigation: enforce uniqueness in persistence and treat slug changes as explicit admin actions.
- **[Risk] Public filters may be too limited for later growth** -> Mitigation: start with catalog-friendly filters and add richer discovery in later changes once usage patterns are known.
- **[Trade-off] Public detail composed from operational records couples discovery to internal activation state** -> Mitigation: accept the coupling because active/inactive state is already the intended lifecycle control.

## Migration Plan

1. Extend `Empresa` persistence with the public profile fields and listing controls needed for catalog browsing.
2. Add or adjust tenant-facing operations so public profile data can be maintained safely.
3. Add public read models and unauthenticated endpoints for petshop listing and detail.
4. Ensure discovery responses include only public and active petshops, professionals, and services.
5. Build future booking-oriented public flows on top of the public slug/detail model.

Rollback can remove the public endpoints and the new public profile fields without affecting the underlying authentication and operational modules.

## Resolved Defaults

- The first public catalog does not include hero image URLs; media support stays deferred to a later change.
- The detail endpoint exposes only the public petshop profile, active professionals, and active services; professional availability summaries stay out of scope for this slice.
