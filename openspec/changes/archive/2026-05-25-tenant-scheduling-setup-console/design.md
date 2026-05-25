## Context

The repository now has an authenticated tenant admin shell and a first booking dashboard, but the setup side of the operation still lives only in backend endpoints. Tenant users can already authenticate and the backend already supports professional management, service management, professional-service assignments, and recurring weekly availability, yet there is no frontend path that lets a petshop configure those pieces through the admin console.

This change is cross-cutting inside the frontend because it expands the authenticated admin area from a single booking dashboard into a broader operations console. It also needs to coordinate four related backend capability surfaces into one coherent setup flow, especially around the professional detail page where assignments and availability naturally converge.

## Goals / Non-Goals

**Goals:**
- Expand the authenticated admin area with setup flows for professionals and services.
- Make professional setup the operational hub for assigning services and configuring recurring weekly availability.
- Reuse the existing tenant-scoped backend endpoints and auth/session flow already adopted by the admin dashboard.
- Provide clear activation, validation, empty, and recoverable error states for setup workflows that affect public visibility and slot generation.
- Keep the admin navigation coherent so bookings and operational setup feel like one tenant console.

**Non-Goals:**
- Creating new backend contracts when the existing ones already support the setup workflows.
- Building advanced calendar planning, drag-and-drop scheduling, or bulk editing in the first slice.
- Introducing a separate availability area disconnected from the professional context.
- Reworking public slot generation logic beyond what existing setup data already influences.

## Decisions

### 1. Treat the change as an admin console expansion, not an isolated feature
The existing admin shell will be extended so bookings become one section of a larger tenant operations console that also includes professionals and services.

**Why this approach**
- The tenant dashboard already established authentication, session handling, and navigation patterns.
- Keeping setup within the same shell reduces conceptual switching for operators.
- It creates a scalable home for future tenant-facing operational features.

**Alternatives considered**
- Launch a separate setup shell: rejected because it fragments the first admin experience.

### 2. Make the professional detail page the center of operational setup
The change will use a structure like:

`/admin/professionals` → professional list  
`/admin/professionals/[id]` → edit profile + assigned services + weekly availability  
`/admin/services` → service list and maintenance

Assignments and availability will live under the professional detail flow instead of as disconnected top-level pages.

**Why this approach**
- Availability and service assignment are both subordinate to a professional.
- It matches the backend route design under `/professionals/{professionalId}/...`.
- It avoids forcing operators to mentally join data across multiple distant screens.

**Alternatives considered**
- Separate top-level availability page: rejected because availability without a professional anchor is awkward.
- Separate top-level assignments page: rejected because assignments are best understood in the context of one professional.

### 3. Keep services as a standalone list but assignments inside professional setup
Services need their own list/create/edit/activate/deactivate management surface, but assigning services to professionals should happen from the professional detail page.

**Why this approach**
- Services are global tenant resources reused across multiple professionals.
- Assignments are relationship data and become clearer when selecting what one professional can perform.

**Alternatives considered**
- Manage assignments from the services list: rejected because it makes the operator jump between services to understand one professional's capacity.

### 4. Reuse the current auth/session model without new frontend auth abstraction
The setup console will use the same secure cookie-backed JWT session and authenticated request helpers already introduced for the booking dashboard.

**Why this approach**
- Avoids introducing a second admin auth pattern immediately after the first one landed.
- Preserves the existing tenant-scoping model where the backend is the source of truth.

**Alternatives considered**
- Build a richer auth state layer first: rejected because it adds infrastructure before new setup value is delivered.

### 5. Make activation state visible as an operational consequence
The setup UI should explicitly communicate that inactive professionals or services stop participating in public discovery or downstream assignment/setup flows.

**Why this approach**
- Activation is not just cosmetic; it changes the booking surface.
- Operators need to understand why something disappeared from the public side or from assignment options.

**Alternatives considered**
- Hide activation impact behind neutral toggles: rejected because it obscures a meaningful business effect.

## Risks / Trade-offs

- **[The change spans four related capabilities]** -> The admin UI could become scattered. Mitigation: center relationship-heavy flows on the professional detail page.
- **[Existing backend payloads use pt-BR field names]** -> Frontend mapping may become noisy. Mitigation: keep API normalization centralized in the existing client layer.
- **[Activation rules can confuse operators]** -> Inactive records may vanish from public/assignment contexts unexpectedly. Mitigation: surface explicit status and consequences in the UI.
- **[Availability UX can become too complex too quickly]** -> Weekly windows invite calendar-like ideas. Mitigation: keep the first slice to structured weekday + start/end time forms.

## Migration Plan

1. Extend the admin navigation and shared shell to include setup sections.
2. Add professionals and services list/detail maintenance flows.
3. Add professional-scoped assignment and availability management in the detail flow.
4. Validate the flows against existing authenticated backend endpoints and session handling.
5. Rollback would remove the new admin setup pages while leaving backend setup APIs unchanged.

## Open Questions

- None at proposal time; the current backend contracts and admin shell shape are sufficient for a first slice.
