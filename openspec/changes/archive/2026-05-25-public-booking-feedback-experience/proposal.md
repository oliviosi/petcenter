## Why

The product already supports booking-backed feedback eligibility and submission in the backend, and the public web shell already reaches the booking status page, but the user-facing journey still stops before clients can actually rate the completed service. Adding the public feedback experience now completes the post-service loop and turns booking completion into new public rating data that strengthens future discovery.

## What Changes

- Add a public browser experience for checking feedback eligibility and submitting feedback after a completed booking.
- Extend the public status journey so eligible completed bookings can transition into a feedback flow without requiring accounts or tenant authentication.
- Define the user-facing states for eligible, ineligible, already-submitted, invalid-token, submission-success, and recoverable error scenarios.
- Define how the frontend reuses the feedback access token already issued at booking creation time.

## Capabilities

### New Capabilities
- `public-booking-feedback-experience`: Public frontend flow for entering the booking-backed feedback journey, validating eligibility, submitting ratings, and handling client-facing post-submission states.

### Modified Capabilities
- `public-booking-web-shell`: Extend the public shell journey so post-booking flows can continue from status into feedback when the booking becomes eligible.
- `public-booking-status`: Clarify the public status presentation expectations for completed bookings that can transition into the feedback experience.

## Impact

- Affects the frontend public booking shell under `apps/frontend`, especially the status page and new feedback routes/components.
- Reuses existing backend APIs for feedback eligibility and feedback submission without changing tenant or booking contracts.
- Increases the practical value of existing public rating summaries by enabling the user-facing path that produces new feedback records.
