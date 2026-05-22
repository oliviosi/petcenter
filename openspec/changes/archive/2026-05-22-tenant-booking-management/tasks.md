## 1. Booking Lifecycle Extension

- [x] 1.1 Extend the booking domain, persistence mappings, and migration to support the `completed` state plus final-price and completion metadata.
- [x] 1.2 Add domain and repository rules that allow completion only from `confirmed` and keep all booking lifecycle transitions tenant-safe.

## 2. Tenant Booking Read APIs

- [x] 2.1 Implement authenticated booking list endpoints and request models that filter tenant bookings by date range, state, and professional inside the authenticated `Empresa`.
- [x] 2.2 Implement an authenticated booking detail endpoint that returns the operational booking view needed by tenant users, including slot, service, professional, owner contact, pet snapshot, rejection details, and completion details.
- [x] 2.3 Enforce cross-tenant rejection for all tenant booking read operations.

## 3. Booking Completion APIs

- [x] 3.1 Implement the authenticated booking completion endpoint, validation, and application service to store the final charged price and mark a confirmed booking as `completed`.
- [x] 3.2 Reject booking completion for non-confirmed states, invalid final prices, and cross-tenant access attempts.

## 4. Verification

- [x] 4.1 Add or update automated tests covering tenant booking filters, booking detail access rules, lifecycle transitions into `completed`, and final-price validation.
- [x] 4.2 Verify backend build, tests, and tenant booking endpoint contracts after the new operational booking management flow is wired end to end.
