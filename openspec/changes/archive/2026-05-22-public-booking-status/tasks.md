## 1. Public status access foundation

- [x] 1.1 Extend booking persistence with protected booking status token storage and the supporting service or helper used to generate and validate public status tokens.
- [x] 1.2 Extend booking creation contracts and application flow so each accepted booking request returns the raw booking status access mechanism alongside the existing booking identifiers and feedback token.

## 2. Public booking status APIs

- [x] 2.1 Add the public booking status lookup endpoint that validates booking id plus status token and returns a narrow public status response model.
- [x] 2.2 Map persisted booking lifecycle states into public client-facing status payloads, including pending, confirmed, rejected, cancelled, completed, and no-show outcomes with their relevant timestamps and rejection details when applicable.

## 3. Verification

- [x] 3.1 Add or update automated tests covering valid and invalid status token validation, status lookup across all supported lifecycle states, and booking creation returning the status access mechanism.
- [x] 3.2 Verify backend build, tests, and public booking status endpoint contracts after the status-tracking flow is wired end to end.
