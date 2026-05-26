## Context

The admin console already lets tenant users authenticate, manage bookings, and configure professionals, services, assignments, and availability. What remains missing is the storefront control surface: the petshop still cannot review or update the public profile data that powers catalog discovery and public detail pages, even though the backend already exposes authenticated read/update endpoints for that profile.

This is a cross-cutting frontend change because it expands the authenticated admin console navigation again, introduces a new bridge between internal operations and external discovery, and needs to translate backend validation rules around `publica` and required profile fields into a clear publishing workflow. The backend contracts are already sufficient, so the core work is admin UX, state feedback, and API normalization.

## Goals / Non-Goals

**Goals:**
- Add a tenant-facing admin section for reading and updating the petshop public profile.
- Reuse the existing authenticated session model and existing `GET/PUT /petshops/public-profile` backend contracts.
- Make publication state understandable, including what fields are required to publish the storefront.
- Give operators clear validation, success, unpublished, and recoverable error states in the admin console.
- Expand the admin navigation so storefront maintenance lives beside bookings and setup.

**Non-Goals:**
- Creating a richer CMS, media manager, or theme editor for the public storefront.
- Changing public catalog query behavior beyond what the existing profile fields already affect.
- Introducing new backend endpoints when the existing profile endpoints already cover the first slice.
- Reworking public detail rendering or public booking flows beyond consuming the updated profile data they already depend on.

## Decisions

### 1. Add a dedicated `/admin/profile` section inside the current console
The public storefront profile will live as its own section in the existing authenticated admin console instead of being embedded into bookings, professionals, or services.

**Why this approach**
- The profile belongs to the petshop as a whole, not to one professional or one booking workflow.
- It fits the current console expansion pattern cleanly.
- It creates a stable home for future storefront controls.

**Alternatives considered**
- Hide profile settings inside another setup page: rejected because it blurs a company-level concern into operational setup.

### 2. Treat publication as a guided state, not just a boolean toggle
The UI should make it obvious that enabling `publica` means the storefront can appear in public discovery only when the required fields are valid, and that disabling it removes the petshop from discovery.

**Why this approach**
- The backend validator already enforces stronger requirements when publishing.
- Operators need to understand the business impact of toggling visibility.

**Alternatives considered**
- Present `publica` as a bare checkbox with no context: rejected because it hides validation and business consequences.

### 3. Reuse the current server-first admin pattern
The page should follow the same admin pattern already used elsewhere: server-side authenticated data fetch, server actions for mutations, shared admin API client, and explicit empty/error/success states.

**Why this approach**
- Keeps the admin console internally consistent.
- Avoids introducing a second interaction model immediately after the admin shell was established.

**Alternatives considered**
- Build a richer client-side state management layer: rejected because the first slice does not need it.

### 4. Show storefront preview cues without building a full preview system
The first slice should expose practical cues such as slug, current publication state, and a link target or note about how the data feeds the public catalog, but it should not attempt a pixel-perfect live preview.

**Why this approach**
- Operators need confidence that profile changes affect the storefront.
- A full preview system adds a lot of UI complexity for limited incremental value at this stage.

**Alternatives considered**
- No storefront cues at all: rejected because it weakens the connection between admin inputs and public outcomes.
- Full live preview pane: rejected because it is heavier than the current product maturity requires.

## Risks / Trade-offs

- **[Publishing rules are conditional]** -> Users may be surprised when a profile can be saved but not published. Mitigation: explain required fields and surface validation clearly when `publica` is enabled.
- **[Profile maintenance overlaps with public discovery semantics]** -> Small wording mistakes in admin UX can confuse what becomes public. Mitigation: use explicit pt-BR copy describing public visibility consequences.
- **[The console keeps expanding]** -> Navigation complexity may increase over time. Mitigation: add the profile as a clear top-level section with concise purpose.
- **[Slug conflicts are operationally sensitive]** -> Conflicts can block publication unexpectedly. Mitigation: surface backend validation errors directly in the form.

## Migration Plan

1. Extend the admin navigation with a public profile/storefront section.
2. Add authenticated fetch and mutation support for the public profile endpoints.
3. Implement the admin page and publishing workflow with explicit validation and visibility messaging.
4. Update documentation and tests around storefront maintenance.
5. Rollback would remove the admin profile UI while leaving backend profile endpoints unchanged.

## Open Questions

- None at proposal time; the existing backend contracts define the first slice clearly enough.
