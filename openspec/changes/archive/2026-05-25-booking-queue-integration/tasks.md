## 1. Messaging configuration

- [x] 1.1 Add RabbitMQ booking integration options and startup validation for connection, exchange, queue, and routing settings.
- [x] 1.2 Register the booking messaging services and hosted consumer infrastructure in the backend dependency injection setup.

## 2. Outbound booking publication

- [x] 2.1 Replace the logging-only booking event publisher with a RabbitMQ-backed publisher that sends `booking.requested` using the frozen contract.
- [x] 2.2 Update booking creation coverage to verify accepted bookings publish through the production messaging abstraction and surface publish failures explicitly.

## 3. Inbound booking outcome consumption

- [x] 3.1 Implement RabbitMQ consumers for `booking.confirmed` and `booking.rejected` that deserialize the frozen contracts and delegate to the existing booking lifecycle services.
- [x] 3.2 Ensure inbound message acknowledgements happen only after successful handling and preserve idempotent processing through `inbox_entries`.

## 4. Operational hardening

- [x] 4.1 Add backend tests for broker configuration validation, duplicate outcome deliveries, and late queue outcomes after requested-state cancellation.
- [x] 4.2 Document the required RabbitMQ configuration and local setup expectations for running the booking queue integration.
