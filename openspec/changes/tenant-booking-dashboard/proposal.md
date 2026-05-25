## Why

The backend already exposes tenant-scoped booking listing, detail, completion, cancellation, and no-show operations, but the product still lacks a tenant-facing operational surface that lets petshops actually use those capabilities day to day. After closing the public booking journey, the next highest-value step is giving authenticated tenant users a dashboard to manage the reservations they receive.

## What Changes

- Add a tenant-facing booking dashboard for operational visibility over reservations inside the authenticated `Empresa` scope.
- Add a dedicated tenant login entry in the frontend so authenticated operators can reach the dashboard through a complete browser flow.
- Define the dashboard flow for booking list, booking detail, and operational actions such as complete, cancel, and no-show.
- Define tenant-facing filtering, loading, empty, success, and recoverable error states for booking operations, with a default focus on today plus upcoming bookings.
- Establish the first authenticated admin-facing frontend surface for booking operations in the monorepo.

## Capabilities

### New Capabilities
- `tenant-booking-dashboard`: Authenticated tenant dashboard experience for listing, inspecting, and operating on bookings that belong to the authenticated `Empresa`.

### Modified Capabilities
- `tenant-booking-operations`: Clarify the client-facing dashboard expectations for presenting tenant-scoped booking lists and details.
- `booking-completion-management`: Clarify the dashboard-driven operational flow for completing confirmed bookings.
- `booking-cancellation-management`: Clarify the dashboard-driven operational flow for cancelling eligible bookings.
- `booking-no-show-management`: Clarify the dashboard-driven operational flow for marking confirmed bookings as no-show.

## Impact

- Affects the frontend application surface by introducing authenticated tenant booking management pages and actions.
- Reuses the existing backend auth contract so the first admin area has a complete entry flow instead of depending on an external token handoff.
- Reuses existing tenant-scoped backend booking endpoints without changing multi-tenant ownership rules.
- Establishes the first operational dashboard experience for petshops to handle incoming reservations in practice.
