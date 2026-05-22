## ADDED Requirements

### Requirement: Clients can submit booking requests for bookable slots
The system SHALL allow clients to submit a booking request to `POST /bookings` for a public petshop slot that is currently bookable.

#### Scenario: Booking request is accepted
- **WHEN** a client submits a booking request for an active public petshop, an active professional-service assignment, and a slot that matches the service duration and weekly availability
- **THEN** the system stores a booking request in `requested` state with a generated booking identifier and returns that initial lifecycle state immediately

#### Scenario: Slot is not bookable
- **WHEN** a client submits a booking request for a slot that does not match the requested petshop, professional, service, duration, or recurring availability rules
- **THEN** the system rejects the request

### Requirement: Booking requests store client and pet intake data
The system SHALL store the client and pet snapshot submitted with the booking request together with the requested slot, requiring owner contact plus pet name and species in the first slice.

#### Scenario: Client and pet data are captured
- **WHEN** a client submits a valid booking request
- **THEN** the system stores the owner contact and the pet name and species required for the petshop to identify the appointment request

### Requirement: Booking requests publish the frozen queue contract
The system SHALL publish `booking.requested` only after persisting the booking request, using the frozen message contract with `bookingId`, `empresaId`, `professionalId`, `serviceId`, `clientId`, `requestedAt`, `slotStart`, and `slotEnd`.

#### Scenario: Request is persisted before publish
- **WHEN** a booking request is accepted
- **THEN** the system persists the booking in `requested` state before publishing the corresponding `booking.requested` event

### Requirement: Booking confirmation remains asynchronous
The system SHALL keep a booking in `requested` state until it receives `booking.confirmed` or `booking.rejected`, and it MUST NOT mark the slot as confirmed before the confirmation event arrives.

#### Scenario: Booking is confirmed
- **WHEN** the system receives `booking.confirmed` for an existing requested booking
- **THEN** the system marks that booking as `confirmed`

#### Scenario: Booking is rejected
- **WHEN** the system receives `booking.rejected` for an existing requested booking
- **THEN** the system marks that booking as `rejected` and stores the rejection reason
