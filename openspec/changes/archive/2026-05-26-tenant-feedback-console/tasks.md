## 1. Backend feedback read surfaces

- [x] 1.1 Add tenant-scoped backend contracts and queries for feedback summary metrics and filtered feedback entry listing based on stored `BookingFeedback` records.
- [x] 1.2 Expose authenticated feedback summary and feedback list endpoints that derive `EmpresaId` from the JWT and reject cross-tenant access.

## 2. Frontend data integration and navigation

- [x] 2.1 Extend the frontend shared API client and types to consume the tenant feedback summary and feedback list endpoints.
- [x] 2.2 Expand the authenticated admin navigation to include the feedback section alongside bookings, storefront profile, professionals, and services.

## 3. Tenant feedback console experience

- [x] 3.1 Implement `/admin/feedback` with server-side loading, tenant-facing summary cards, and professional rating breakdowns.
- [x] 3.2 Implement the filtered feedback list with booking context, optional comments, empty states, recoverable error handling, and links back to `/admin/bookings/[id]`.

## 4. Validation and documentation

- [x] 4.1 Add or update backend/frontend tests covering tenant scoping, feedback summary aggregation, filtered feedback listing, and admin console states.
- [x] 4.2 Update repository documentation for the new feedback console route and its operational purpose.
