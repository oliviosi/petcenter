## ADDED Requirements

### Requirement: Clients can query booking status with booking-backed token proof
The system SHALL allow a client to query the current lifecycle status of a booking using the booking identifier together with a valid booking-backed status access token.

#### Scenario: Valid token is provided for status lookup
- **WHEN** a client requests the status of a booking with the correct booking status access token
- **THEN** the system returns the current lifecycle status of that booking

#### Scenario: Invalid token is provided for status lookup
- **WHEN** a client requests the status of a booking with an invalid booking status access token
- **THEN** the system rejects the request

### Requirement: Public booking status exposes current client-relevant outcome details
The system SHALL return the current booking state and the public outcome details relevant to that state, including rejection details when the booking was rejected.

#### Scenario: Booking is still pending
- **WHEN** a client requests the status of a booking that remains in `requested`
- **THEN** the system reports that the booking is still awaiting asynchronous resolution

#### Scenario: Booking has a terminal or progressed outcome
- **WHEN** a client requests the status of a booking that is `confirmed`, `rejected`, `cancelled`, `completed`, or `no-show`
- **THEN** the system returns that current state together with the public details associated with that outcome
