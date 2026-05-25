## Context

The backend already exposes the tenant-scoped booking operations needed for a real operational dashboard: authenticated users can list bookings, inspect booking details, and transition eligible bookings through complete, cancel, and no-show flows within their `Empresa` scope. What is missing is the frontend surface that makes those operations usable in practice for petshop staff.

This is a cross-cutting change because it introduces the first authenticated tenant-facing experience in the frontend app, reuses JWT-backed tenant scoping, and must translate operational booking states into a dashboard flow without weakening the existing ownership rules. It also sits at the boundary between public booking intake and internal operational handling, so clarity of state transitions matters more than visual complexity in the first slice.

## Goals / Non-Goals

**Goals:**
- Add the first tenant-facing booking dashboard in the frontend application.
- Reuse existing authenticated backend endpoints for booking list, detail, completion, cancellation, and no-show.
- Define a route structure and interaction model for operational booking handling inside the tenant scope.
- Provide clear filtering, detail, action confirmation, success, empty, and recoverable error states for booking management.
- Preserve strict tenant scoping by relying only on authenticated backend contracts.

**Non-Goals:**
- Building a full admin suite beyond booking operations.
- Redesigning JWT authentication or backend ownership rules.
- Adding advanced calendar views, analytics, or staffing reports in this slice.
- Introducing real-time updates, push notifications, or cross-tenant operational views.

## Decisions

### 1. Add a dedicated authenticated tenant route area in the frontend
The frontend will gain an authenticated tenant-facing route group for booking operations rather than mixing dashboard pages into the public shell.

**Why this approach**
- Keeps public and tenant experiences clearly separated.
- Matches the security boundary already enforced by the backend.
- Gives the frontend a clean expansion path for future tenant/admin features.

**Alternatives considered**
- Reuse the public app shell with conditional UI: rejected because public and tenant concerns are fundamentally different.
- Delay tenant UI and rely on API tools/manual actions: rejected because the main product gap is operational usability.

### 2. Start with a list-detail-action workflow
The first slice will focus on a route pattern like:

`/admin/bookings` → booking list  
`/admin/bookings/[id]` → booking detail + operational actions

The list will support basic filtering by state, date range, and professional, while the detail page will be the place where operational state transitions are initiated.

**Why this approach**
- Mirrors the capabilities already present in the backend.
- Reduces complexity compared to building a calendar-first UI immediately.
- Gives operators a predictable place to inspect context before mutating state.

**Alternatives considered**
- Calendar-first dashboard: rejected because it adds layout complexity before core list/detail operations are proven.
- Inline action-only list with no detail view: rejected because booking operations need context like pet, owner, rejection/completion metadata, and reasons.

### 3. Use authenticated server-side data fetching with JWT propagation
The tenant dashboard will call authenticated backend endpoints using the tenant JWT and rely on backend scoping through the `empresa_id` claim rather than duplicating scoping rules in the frontend.

**Why this approach**
- Preserves the existing security model.
- Keeps tenant ownership enforcement centralized in the backend.
- Fits the Next.js app architecture already introduced for the frontend.

**Alternatives considered**
- Re-implement scoping logic in frontend queries: rejected because multi-tenancy bugs here are security incidents.
- Add new dashboard aggregation endpoints before a first UI exists: rejected because the current contracts are already sufficient for a first slice.

### 4. Require explicit confirmation flows for operational mutations
Completion, cancellation, and no-show actions will use explicit forms/dialog-like confirmation steps that collect the required operational inputs such as final price or reasons before calling the backend mutation endpoints.

**Why this approach**
- Booking state transitions are operationally meaningful and should not be one-click accidents.
- Existing backend contracts already expect structured inputs for these actions.
- It keeps mutation errors understandable and localized in the UI.

**Alternatives considered**
- Fire actions directly from buttons in the list: rejected because reason/final-price capture and confirmation would be awkward and error-prone.

### 5. Prioritize operational clarity over dashboard density
The first slice should optimize for staff confidence: obvious filters, readable state badges, clear mutation affordances, and explicit success/error feedback matter more than compressing many KPIs onto one screen.

**Why this approach**
- The product currently lacks any operational dashboard, so correctness and usability are more important than analytics polish.
- The booking lifecycle has multiple terminal and transitional states that operators must distinguish reliably.

**Alternatives considered**
- Start with metrics-heavy dashboard cards: rejected because they do not unlock the primary operational actions.

### 6. Include a dedicated `/admin/login` entry in the first slice
The first slice will include a dedicated tenant login route in the frontend so the dashboard can be entered through a complete browser flow instead of assuming an external token handoff already exists.

**Why this approach**
- The frontend currently has no authenticated tenant surface, so a dashboard without login would be incomplete in practice.
- The backend already exposes `/auth/login`, which is enough to support a simple first login flow without redefining auth contracts.
- It gives the admin area a stable entry point for future tenant features.

**Alternatives considered**
- Assume the JWT is injected by another system: rejected because that creates an implicit dependency the repository does not currently provide.

### 7. Default the booking list to today plus upcoming reservations
The booking dashboard will default to showing today's bookings and upcoming bookings ordered by slot date, while still allowing broader date filtering when the operator needs historical context.

**Why this approach**
- It matches the operational priority of petshop staff, who mainly need to act on current and near-future work.
- It reduces noise on first load while keeping history available through filters.

**Alternatives considered**
- Default to all bookings: rejected because it would dilute the main operational queue with older records.

### 8. Surface rejected bookings in the same dashboard through filters
Rejected bookings will remain available in the same dashboard experience, but they will not dominate the default view. Operators will reach them through state filters and detail pages when they need to audit failed requests.

**Why this approach**
- Keeps booking operations unified in a single operational surface.
- Preserves visibility into the full booking lifecycle, including queue rejections.
- Avoids fragmenting the first admin experience into multiple dashboards too early.

**Alternatives considered**
- Exclude rejected bookings entirely from the first slice: rejected because it hides meaningful operational outcomes.
- Show rejected bookings prominently by default: rejected because the first-load priority is actionable current work.

## Risks / Trade-offs

- **[Authenticated tenant UX introduces a new security-sensitive frontend surface]** -> Mishandling tokens or scoping could be risky. Mitigation: keep authorization entirely backend-enforced and use the authenticated contracts as-is.
- **[Current frontend has no tenant shell yet]** -> This expands the app beyond the public experience. Mitigation: keep the first slice route-scoped to bookings only.
- **[Operational flows may reveal contract awkwardness]** -> Completion, cancellation, or no-show payloads may feel clunky in the UI. Mitigation: expose genuine UX friction first before proposing new backend contracts.
- **[Operators may expect calendar or real-time views immediately]** -> The first list/detail slice may feel simpler than a full dashboard. Mitigation: make the first slice intentionally operational and leave richer views for follow-up changes.

## Migration Plan

1. Add an authenticated tenant-facing route area and shared dashboard shell in the frontend.
2. Implement booking list and detail pages against the existing authenticated booking endpoints.
3. Add operational action flows for complete, cancel, and no-show using the current backend contracts.
4. Validate authenticated filtering, action success, and error handling inside tenant scope.
5. Deploy behind the existing authentication model; rollback would remove the tenant UI while leaving backend operations unchanged.
