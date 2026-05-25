## ADDED Requirements

### Requirement: Backend publishes accepted booking requests to the booking broker
The system SHALL publish `booking.requested` to the configured RabbitMQ booking exchange only after persisting the accepted booking request, using the frozen message contract with `bookingId`, `empresaId`, `professionalId`, `serviceId`, `clientId`, `requestedAt`, `slotStart`, and `slotEnd`.

#### Scenario: Accepted request is published to RabbitMQ
- **WHEN** a booking request is accepted
- **THEN** the system persists the booking in `requested` state before publishing the corresponding `booking.requested` event to the configured RabbitMQ booking exchange

### Requirement: Backend consumes booking resolution events from RabbitMQ
The system SHALL consume `booking.confirmed` and `booking.rejected` from the configured RabbitMQ booking queues and apply those outcomes to the corresponding booking lifecycle.

#### Scenario: Confirmation event is consumed from RabbitMQ
- **WHEN** the API receives a valid `booking.confirmed` message from the configured RabbitMQ booking queue
- **THEN** the system applies the confirmation outcome to the addressed booking lifecycle

#### Scenario: Rejection event is consumed from RabbitMQ
- **WHEN** the API receives a valid `booking.rejected` message from the configured RabbitMQ booking queue
- **THEN** the system applies the rejection outcome to the addressed booking lifecycle

### Requirement: Booking outcome consumers process events idempotently
The system SHALL treat duplicate booking outcome deliveries as idempotent by using the inbound message identifier to avoid reprocessing an already handled queue event.

#### Scenario: Duplicate outcome event is redelivered
- **WHEN** the API receives a `booking.confirmed` or `booking.rejected` delivery whose `messageId` has already been processed
- **THEN** the system does not apply the booking outcome a second time

### Requirement: Booking messaging integration requires explicit broker configuration
The system SHALL require explicit RabbitMQ connection and booking topology configuration before enabling the booking messaging integration.

#### Scenario: Messaging configuration is incomplete
- **WHEN** the API starts without the required RabbitMQ connection or booking exchange and queue settings
- **THEN** the system refuses to start the booking messaging integration with invalid configuration
