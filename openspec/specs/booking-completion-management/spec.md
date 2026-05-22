## Purpose
Define tenant-bound booking completion requirements.

## Requirements
### Requirement: Tenant users can complete confirmed bookings
The system SHALL allow authenticated tenant users to complete a confirmed booking belonging to their authenticated `Empresa`.

#### Scenario: Confirmed booking is completed
- **WHEN** an authenticated tenant user completes a confirmed booking with a valid final charged price
- **THEN** the system marks the booking as `completed` and stores the final charged price

#### Scenario: Non-confirmed booking is targeted for completion
- **WHEN** an authenticated tenant user tries to complete a booking that is not in `confirmed` state
- **THEN** the system rejects the operation

### Requirement: Booking completion verifies tenant ownership and final price validity
The system SHALL reject booking completion when the targeted booking belongs to another `Empresa` or the submitted final price is invalid.

#### Scenario: Cross-tenant completion is attempted
- **WHEN** an authenticated tenant user tries to complete a booking belonging to another `Empresa`
- **THEN** the system rejects the operation

#### Scenario: Final price is invalid
- **WHEN** an authenticated tenant user submits a negative or otherwise invalid final charged price
- **THEN** the system rejects the request with a validation error
