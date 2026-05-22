## ADDED Requirements

### Requirement: Clients can submit feedback for completed bookings
The system SHALL allow a client to submit one feedback record for a completed booking using the booking identifier and a valid feedback access token.

#### Scenario: Feedback is submitted
- **WHEN** a client submits feedback for a completed booking with a valid feedback access token
- **THEN** the system stores a single feedback record linked to that booking

#### Scenario: Feedback is submitted twice
- **WHEN** a client tries to submit feedback for a booking that already has a stored feedback record
- **THEN** the system rejects the operation

### Requirement: Feedback captures separate ratings for professional and petshop
The system SHALL store separate ratings for the professional and the petshop, together with an optional comment, for each accepted feedback submission.

#### Scenario: Feedback captures structured ratings
- **WHEN** a client submits valid feedback
- **THEN** the system stores the professional rating, the petshop rating, and the optional comment linked to the booking

#### Scenario: Rating is invalid
- **WHEN** a client submits a rating outside the accepted scale
- **THEN** the system rejects the request with a validation error
