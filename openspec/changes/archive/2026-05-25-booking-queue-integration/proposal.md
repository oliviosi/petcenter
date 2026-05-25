## Why

The booking lifecycle already depends on asynchronous queue resolution in the product and existing specs, but the backend still uses a logging-only publisher and does not run a real RabbitMQ consumer. That leaves the most critical booking flow incomplete: requests are persisted in `requested` state without a production-ready path to `confirmed` or `rejected`.

## What Changes

- Add real RabbitMQ-backed publication for `booking.requested` after the booking request is persisted.
- Add backend consumers for `booking.confirmed` and `booking.rejected` so queue outcomes are applied automatically.
- Define runtime configuration and startup behavior for the booking messaging integration, including required exchange, queue, and binding settings.
- Define reliability expectations for message handling, including idempotent inbound processing and preservation of cancelled bookings when late queue outcomes arrive.

## Capabilities

### New Capabilities
- `booking-queue-integration`: Reliable RabbitMQ publication and consumption for the booking lifecycle, including broker configuration, inbound message processing, and operational guarantees for asynchronous queue resolution.

### Modified Capabilities
- `booking-request-management`: Clarify that booking requests are published to the queue through the production messaging integration rather than a non-delivering placeholder implementation.

## Impact

- Affected backend booking infrastructure under `apps/backend/Api/Modules/Bookings`.
- Dependency on RabbitMQ runtime configuration and client integration in the backend API.
- Startup and dependency injection changes in `Program.cs` and service registration.
- Operational impact on local and deployed environments that must provide broker connectivity for booking resolution.
