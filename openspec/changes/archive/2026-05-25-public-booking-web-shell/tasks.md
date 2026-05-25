## 1. Frontend app foundation

- [x] 1.1 Create the `apps/frontend` Next.js application surface with the baseline configuration required by the repository stack.
- [x] 1.2 Establish the shared public layout, design-token usage, API base configuration, and route skeleton for the booking shell.

## 2. Public discovery experience

- [x] 2.1 Implement the public petshop catalog route with loading, empty, and recoverable error states backed by the existing catalog API.
- [x] 2.2 Implement the public petshop detail route with active professionals, services, rating summary, and a clear transition into booking.

## 3. Booking funnel

- [x] 3.1 Implement the booking route that loads slots, allows professional/service selection as needed, and captures owner contact plus pet name and species.
- [x] 3.2 Submit bookings through the existing public booking API and transition successful submissions into the public booking status route.

## 4. Public status experience

- [x] 4.1 Implement the public booking status route that handles `requested`, `confirmed`, `rejected`, `cancelled`, `completed`, and `no-show` with client-facing messaging.
- [x] 4.2 Define how the browser preserves and reuses the booking status token for follow-up status lookups in the first slice.

## 5. Hardening and delivery

- [x] 5.1 Add frontend tests or route-level verification for the core public journey states, including loading, empty, validation, and failure handling.
- [x] 5.2 Document local setup and runtime configuration for running the public booking web shell against the backend API.
