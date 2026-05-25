## MODIFIED Requirements

### Requirement: Public booking status exposes current client-relevant outcome details
The system SHALL return and present the current booking state and the public outcome details relevant to that state, including rejection details when the booking was rejected and a client-facing explanation when the booking is still awaiting asynchronous resolution.

#### Scenario: Booking is still pending
- **WHEN** a client requests the status of a booking that remains in `requested`
- **THEN** the system reports that the booking is still awaiting asynchronous resolution and presents that state in client-facing terms suitable for the public booking shell

#### Scenario: Booking has a terminal or progressed outcome
- **WHEN** a client requests the status of a booking that is `confirmed`, `rejected`, `cancelled`, `completed`, or `no-show`
- **THEN** the system returns that current state together with the public details associated with that outcome and presents that outcome in client-facing terms suitable for the public booking shell
