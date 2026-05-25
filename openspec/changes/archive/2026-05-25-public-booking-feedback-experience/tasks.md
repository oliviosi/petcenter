## 1. Feedback flow foundation

- [x] 1.1 Extend the frontend booking session model to preserve and reuse the feedback access token alongside the existing booking status context.
- [x] 1.2 Add the public feedback route skeleton and shared state components for eligible, ineligible, invalid-token, already-submitted, success, and recoverable error cases.

## 2. Status-to-feedback entry point

- [x] 2.1 Update the public booking status experience to expose a clear feedback entry point for completed bookings when browser context includes a usable feedback token.
- [x] 2.2 Ensure completed booking messaging stays clear when feedback is unavailable or cannot be continued in the current browser context.

## 3. Eligibility and submission

- [x] 3.1 Integrate the existing feedback eligibility endpoint so the feedback form only appears for eligible bookings.
- [x] 3.2 Implement the feedback form for professional rating, petshop rating, and optional comment using the existing public submission API.

## 4. Post-submission experience

- [x] 4.1 Add the success confirmation and duplicate-submission handling so the public flow does not imply repeat feedback is allowed.
- [x] 4.2 Define navigation paths back to the public shell after feedback success or ineligible outcomes.

## 5. Hardening and delivery

- [x] 5.1 Add frontend tests or route-level verification for eligibility, invalid-token, already-submitted, validation-error, and success scenarios.
- [x] 5.2 Document local setup and runtime expectations for the public feedback experience inside the frontend app documentation.
