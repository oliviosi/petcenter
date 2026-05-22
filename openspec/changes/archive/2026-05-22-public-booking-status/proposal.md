## Why

The booking request flow is now asynchronous end to end, but the client still has no public way to check whether a requested booking was confirmed, rejected, cancelled, or otherwise progressed after creation. The next slice should expose a secure public booking status lookup so the client can follow the result of an appointment request without introducing a customer-account system.

## What Changes

- Add a public booking status lookup flow that allows a client to query the current lifecycle state of a booking after request creation.
- Introduce a booking status access token model so public status checks can be authorized without tenant authentication or customer accounts.
- Expose public status responses for booking lifecycle milestones, including pending resolution, confirmed, rejected, cancelled, completed, and no-show outcomes, plus rejection details when applicable.
- Extend booking creation contracts so the system returns the access mechanism required for later public status lookup.
- Keep this slice focused on status visibility only, excluding push notifications, customer accounts, realtime subscriptions, rescheduling flows, and public feedback summaries.

## Capabilities

### New Capabilities
- `public-booking-status`: Allow clients to securely query the current lifecycle state and public outcome details of a booking.
- `booking-status-eligibility`: Define the token-based access rules required for a client to prove it can view a booking status without tenant authentication.

### Modified Capabilities
- `booking-request-management`: Extend booking creation so the system preserves and returns the public status access mechanism needed for later status checks.

## Impact

- Affected code: `apps/backend` booking domain, persistence, public status endpoints, token validation, and booking creation contracts.
- APIs: adds public booking status lookup endpoints and extends booking creation responses with the status access mechanism.
- Dependencies: continues using the existing .NET 10 backend stack without introducing customer-account infrastructure or changing the frozen RabbitMQ booking contract.
- Systems: closes the client-side gap in the asynchronous booking journey by allowing public status tracking after booking intake.
