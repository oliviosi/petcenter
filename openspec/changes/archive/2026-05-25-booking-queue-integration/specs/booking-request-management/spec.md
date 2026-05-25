## MODIFIED Requirements

### Requirement: Booking requests publish the frozen queue contract
The system SHALL publish `booking.requested` only after persisting the booking request, using the frozen message contract with `bookingId`, `empresaId`, `professionalId`, `serviceId`, `clientId`, `requestedAt`, `slotStart`, and `slotEnd`, and it SHALL send that event through the configured RabbitMQ booking exchange.

#### Scenario: Request is persisted before publish
- **WHEN** a booking request is accepted
- **THEN** the system persists the booking in `requested` state before publishing the corresponding `booking.requested` event to the configured RabbitMQ booking exchange
