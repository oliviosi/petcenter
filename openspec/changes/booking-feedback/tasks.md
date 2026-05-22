## 1. Feedback Eligibility Foundation

- [x] 1.1 Extend booking persistence with the feedback access mechanism, protected token storage, and feedback-submitted tracking needed for later public feedback validation.
- [x] 1.2 Add a feedback entity, mappings, and repository rules that enforce one feedback record per booking.

## 2. Public Feedback APIs

- [x] 2.1 Extend booking creation contracts to issue the feedback access mechanism alongside the booking identifier for later post-service use.
- [x] 2.2 Implement the public feedback eligibility endpoint that validates booking id plus feedback token and reports whether feedback can still be submitted.
- [x] 2.3 Implement the public feedback submission endpoint, validation, and application flow for professional rating, petshop rating, and optional comment tied to a completed booking.

## 3. Feedback Integrity Rules

- [x] 3.1 Enforce that only completed, token-validated, and not-yet-rated bookings can accept feedback submissions.
- [x] 3.2 Reject invalid tokens, duplicate submissions, and ratings outside the accepted scale.

## 4. Verification

- [x] 4.1 Add or update automated tests covering token-backed eligibility, single-submission enforcement, completed-booking requirements, and rating validation.
- [x] 4.2 Verify backend build, tests, and public feedback endpoint contracts after the feedback flow is wired end to end.
