## Context

The repository currently contains only `apps/backend`, while the public booking journey is already described across existing OpenSpec capabilities and supported by backend endpoints for catalog discovery, petshop detail, slot discovery, booking creation, booking status lookup, and feedback eligibility/submission. The missing piece is a browser-facing shell that turns those contracts into a usable product flow for unauthenticated clients.

This change is cross-cutting because it introduces the first frontend application surface in the monorepo, defines a route map for the public booking journey, and must bridge asynchronous booking resolution into understandable user-facing states without leaking queue implementation details. It also has to respect the repository language rules, design-token rules, and the existing backend contracts rather than inventing new public APIs.

## Goals / Non-Goals

**Goals:**
- Establish the first public web application shell for browsing petshops and creating bookings.
- Reuse existing backend APIs and tokens for catalog, detail, slot discovery, booking creation, and booking status follow-up.
- Define a route structure and client-state model that can represent the asynchronous booking lifecycle clearly to end users.
- Specify loading, empty, and error states so the first slice feels coherent rather than just “API wiring”.
- Keep the public journey fully unauthenticated.

**Non-Goals:**
- Redesigning backend booking APIs or message contracts.
- Building tenant/admin interfaces.
- Implementing SEO, analytics, localization infrastructure beyond the existing language rules, or advanced account features.
- Delivering the full post-service feedback UI in the same slice unless it is needed only as a future integration point.

## Decisions

### 1. Create a dedicated frontend app for the public shell
The change will establish a frontend application surface under `apps/frontend` aligned with the repository’s planned Next.js 16 App Router architecture, rather than embedding server-rendered pages into the backend.

**Why this approach**
- Matches the monorepo shape already documented in the project instructions.
- Keeps browser UX concerns separate from the API and queue-backed booking lifecycle.
- Gives the product a durable public surface that can later expand into richer discovery and booking experiences.

**Alternatives considered**
- Render public pages directly from the backend: rejected because it conflicts with the intended frontend architecture and mixes API and UI concerns.
- Delay app creation and only document screens: rejected because the main value of the change is defining an executable public shell.

### 2. Model the journey as a route-based funnel
The public shell will use a simple route hierarchy that mirrors the booking journey:

`/petshops` → catalog  
`/petshops/[slug]` → public petshop detail  
`/petshops/[slug]/book` → slot selection + booking form  
`/bookings/[bookingId]` → public booking status

The booking status token will be carried from booking creation into the status page flow without requiring login.

**Why this approach**
- Gives users shareable and resumable URLs.
- Maps cleanly to the existing slug-based petshop lookup and booking-based status lookup.
- Keeps the async booking lifecycle isolated to a single follow-up surface.

**Alternatives considered**
- Single-page wizard without route transitions: rejected because browser recovery, deep-linking, and debugging become harder.
- Use petshop ID everywhere in the public UI: rejected because slug-based detail already exists and is better for public UX.

### 3. Treat asynchronous booking resolution as a first-class status experience
The shell will not pretend booking confirmation is synchronous. After submission, it will direct users to a status view that explains `requested`, `confirmed`, `rejected`, `cancelled`, `completed`, and `no-show` in user-facing language and exposes only the details relevant to that state.

**Why this approach**
- Aligns with the product rule that booking confirmation is always asynchronous.
- Avoids misleading the user immediately after submission.
- Creates a stable place for future additions such as feedback eligibility or retry flows.

**Alternatives considered**
- Show a success page that implies confirmation: rejected because it misrepresents the booking lifecycle.
- Poll silently in the background and only reveal the final state: rejected because the user still needs an explicit public status URL and resilient recovery path.

### 4. Use the existing backend APIs as the integration boundary
The shell will consume the current public backend endpoints for catalog listing, public petshop detail, slot discovery, booking creation, and booking status. New frontend requirements should not imply new backend endpoints unless later discovery proves a real contract gap.

**Why this approach**
- The backend contracts already exist and are covered by specs.
- It keeps this change focused on productization, not API redesign.
- It exposes genuine UX gaps quickly if the existing contracts are insufficient.

**Alternatives considered**
- Add frontend-only aggregation endpoints now: rejected because it increases scope before the shell proves where composition pain actually exists.

### 5. Prioritize resilient UX states in the first slice
The first slice will explicitly cover loading, empty, validation, and failure states for public browsing and booking actions, instead of treating them as polish for later.

**Why this approach**
- The system is public and unauthenticated; trust depends heavily on clarity.
- Booking is asynchronous, which naturally creates more intermediate states.
- Early UX discipline reduces churn when the frontend app is first introduced.

**Alternatives considered**
- Deliver only happy-path screens first: rejected because the booking flow would feel unreliable and incomplete immediately.

## Risks / Trade-offs

- **[Frontend app creation expands scope]** → Introducing `apps/frontend` is larger than a screen-only change. Mitigation: keep the first slice route-focused and reuse existing APIs instead of redesigning contracts.
- **[Existing backend responses may be awkward for direct UI consumption]** → The shell may expose gaps in response shape or missing presentation fields. Mitigation: treat those as discoveries for follow-up changes unless they block the first public slice.
- **[Async booking may feel “slow” or uncertain]** → Users may expect instant confirmation. Mitigation: make `requested` an explicit, well-explained public status state with a stable follow-up page.
- **[No current frontend codebase exists]** → There is no implementation baseline yet. Mitigation: define a narrow initial route map and shared UX expectations so the first implementation can stay disciplined.

## Migration Plan

1. Add the frontend app surface and public routing structure in the monorepo.
2. Implement the catalog, detail, booking, and status pages against the existing backend APIs.
3. Verify the browser flow against async booking states produced by the queue-backed backend.
4. Deploy the frontend together with environment configuration for the backend base URL.
5. If rollback is needed, remove the frontend deployment while preserving the backend APIs and booking lifecycle unchanged.

## Open Questions

- Should the first slice include the post-completion feedback form, or should the shell stop at booking status and leave feedback as a follow-up change?
- Do we want the status page to poll automatically while a booking is `requested`, or should the first slice use manual refresh/retry semantics?
- Should the public shell start directly at `/petshops`, or should there be a lightweight landing page ahead of the catalog?
