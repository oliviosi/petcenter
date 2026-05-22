## MODIFIED Requirements

### Requirement: Clients can submit booking requests for bookable slots
The system SHALL allow clients to submit a booking request to `POST /bookings` for a public petshop slot that is currently bookable.

#### Scenario: Booking request is accepted
- **WHEN** a client submits a booking request for an active public petshop, an active professional-service assignment, and a slot that matches the service duration and weekly availability
- **THEN** the system stores a booking request in `requested` state with a generated booking identifier, returns that initial lifecycle state immediately, and issues both the booking status access mechanism needed for later public status lookup and the feedback access mechanism needed for a later post-service feedback submission

#### Scenario: Slot is not bookable
- **WHEN** a client submits a booking request for a slot that does not match the requested petshop, professional, service, duration, or recurring availability rules
- **THEN** the system rejects the request
