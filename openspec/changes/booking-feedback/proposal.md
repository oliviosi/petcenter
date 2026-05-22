## Why

The booking flow now reaches a completed service state, but the product still stops before the client can share post-appointment feedback. The next slice should capture ratings after completed bookings so the platform can close the customer journey with trustworthy, booking-backed reviews.

## What Changes

- Add a public feedback submission flow tied to completed bookings so clients can rate both the professional and the petshop after service delivery.
- Add booking-backed eligibility rules so feedback can be submitted only for completed bookings and only once per booking.
- Introduce a feedback access token model that lets a client prove feedback eligibility without requiring a full customer account system.
- Store structured feedback data with separate professional and petshop ratings plus an optional comment.
- Keep this slice focused on feedback submission and eligibility, excluding public rating summaries, moderation workflows, favorites, and recommendation logic.

## Capabilities

### New Capabilities
- `booking-feedback-submission`: Allow clients to submit a single post-service feedback record for a completed booking.
- `booking-feedback-eligibility`: Define the rules and access token required for a client to prove feedback eligibility without tenant authentication.

### Modified Capabilities
- `booking-request-management`: Extend booking creation so the system preserves the feedback access mechanism needed for a later post-service submission.
- `booking-completion-management`: Extend booking completion so completed bookings become eligible for feedback submission.

## Impact

- Affected code: `apps/backend` booking domain, persistence, public feedback endpoints, and validation around booking-backed feedback eligibility.
- APIs: adds public feedback submission endpoints and extends booking contracts with the feedback access mechanism and completion-driven eligibility.
- Dependencies: continues using the existing .NET 10 backend stack without introducing customer-account infrastructure.
- Systems: completes the documented customer journey after service completion while keeping review eligibility anchored to real bookings.
