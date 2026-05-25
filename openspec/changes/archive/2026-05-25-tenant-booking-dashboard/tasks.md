## 1. Authenticated tenant shell

- [x] 1.1 Add the first authenticated tenant route area and shared dashboard shell in `apps/frontend`.
- [x] 1.2 Implement a dedicated `/admin/login` flow that authenticates against the existing backend auth contract and establishes the tenant session for the dashboard.
- [x] 1.3 Implement tenant JWT-aware request handling for authenticated booking dashboard calls without duplicating tenant scoping logic in the frontend.

## 2. Booking dashboard flows

- [x] 2.1 Implement the tenant booking list page with a default “today + upcoming” view, filters for state, date range, and professional, plus loading and empty states.
- [x] 2.2 Implement the tenant booking detail page with booking lifecycle context, owner/pet details, and terminal-state metadata, including rejected bookings when selected through the dashboard.

## 3. Operational booking actions

- [x] 3.1 Implement completion flow UI with explicit confirmation and final charged price submission for eligible confirmed bookings.
- [x] 3.2 Implement cancellation flow UI with explicit confirmation for eligible requested or confirmed bookings.
- [x] 3.3 Implement no-show flow UI with explicit confirmation and reason capture for eligible confirmed bookings.

## 4. Validation and documentation

- [x] 4.1 Add or update frontend tests that cover authenticated booking list, detail, filtering, and operational action states.
- [x] 4.2 Update frontend documentation for tenant dashboard setup, authenticated usage assumptions, and validation commands.
