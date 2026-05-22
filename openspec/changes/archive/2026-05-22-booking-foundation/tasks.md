## 1. Booking Domain Foundation

- [x] 1.1 Add tenant-scoped persistence models and EF mappings for professional-service assignments and booking records.
- [x] 1.2 Create the database migration for assignment relationships, booking tables, booking state fields, and supporting constraints/indexes.
- [x] 1.3 Add repository contracts and domain validations for assignment uniqueness, active-state checks, and valid booking state transitions.

## 2. Professional-Service Assignment APIs

- [x] 2.1 Implement authenticated endpoints, validators, and application services to create, list, and delete professional-service assignments inside the authenticated `Empresa`.
- [x] 2.2 Enforce ownership and active-state verification so assignments reject cross-tenant, inactive, and duplicate combinations.

## 3. Public Booking Read APIs

- [x] 3.1 Extend public petshop catalog and detail responses to expose the stable identifiers required for slot lookup and booking requests.
- [x] 3.2 Implement the unauthenticated `/petshops/{id}/slots` endpoint with service filtering, a bounded date interval, defaulting to 7 days from the current date, and optional professional filtering.
- [x] 3.3 Generate slot responses from active assignments, service duration, recurring weekly availability across the requested interval, enforce the 30-day maximum horizon, and exclude overlaps with confirmed bookings.

## 4. Booking Request Lifecycle

- [x] 4.1 Implement `POST /bookings` validation and application flow to capture owner contact plus pet name/species, persist booking requests in `requested` state, and return the initial lifecycle state immediately.
- [x] 4.2 Publish `booking.requested` after persistence using the frozen queue contract fields and a narrow messaging boundary.
- [x] 4.3 Consume `booking.confirmed` and `booking.rejected` idempotently to update booking lifecycle state and rejection reason without premature confirmation.

## 5. Verification

- [x] 5.1 Add or update automated tests covering assignment rules, public slot generation, booking request validation, and asynchronous booking state transitions.
- [x] 5.2 Verify the backend build, tests, and booking-related endpoint contracts after the new booking foundation is wired end to end.
