## MODIFIED Requirements

### Requirement: Booking confirmation remains asynchronous
The system SHALL keep a booking in `requested` state until it receives `booking.confirmed` or `booking.rejected`, and it MUST NOT mark the slot as confirmed before the confirmation event arrives. After a booking reaches `confirmed`, tenant operational flows may later transition it to `completed`.

#### Scenario: Booking is confirmed
- **WHEN** the system receives `booking.confirmed` for an existing requested booking
- **THEN** the system marks that booking as `confirmed`

#### Scenario: Booking is rejected
- **WHEN** the system receives `booking.rejected` for an existing requested booking
- **THEN** the system marks that booking as `rejected` and stores the rejection reason
