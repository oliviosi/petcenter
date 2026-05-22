## 1. Booking lifecycle adjustments

- [x] 1.1 Extend the booking domain and persistence with `cancelled` and `no-show` states plus timestamp/reason fields for each adjustment outcome.
- [x] 1.2 Implement domain transition rules so cancellation is allowed only from `requested` or `confirmed`, no-show is allowed only from `confirmed`, and ineligible terminal states are rejected.
- [x] 1.3 Update asynchronous booking outcome handling so late `booking.confirmed` or `booking.rejected` events do not reopen a booking already canceled from `requested`.

## 2. Tenant adjustment APIs and reads

- [x] 2.1 Add authenticated tenant endpoints to cancel a booking and mark a booking as no-show, including tenant ownership checks and reason validation.
- [x] 2.2 Extend tenant booking list/detail contracts and repository projections to return cancellation and no-show metadata when present.
- [x] 2.3 Ensure adjusted bookings remain visible in tenant operational filters and expose the new lifecycle states consistently in responses.

## 3. Verification

- [x] 3.1 Add or update automated tests covering valid and invalid cancellation transitions, valid and invalid no-show transitions, cross-tenant rejection, and required reason validation.
- [x] 3.2 Add or update automated tests covering late queue events after requested-state cancellation and tenant list/detail responses for canceled and no-show bookings.
- [x] 3.3 Verify backend build, tests, and protected booking endpoint contracts after the adjustment flow is wired end to end.
