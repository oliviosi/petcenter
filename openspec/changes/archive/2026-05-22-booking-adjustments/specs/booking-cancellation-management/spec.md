## ADDED Requirements

### Requirement: Tenant users can cancel eligible bookings
The system SHALL allow authenticated tenant users to cancel a booking belonging to their authenticated `Empresa` when that booking is still in `requested` or `confirmed` state.

#### Scenario: Requested booking is canceled
- **WHEN** an authenticated tenant user cancels a booking in `requested` state that belongs to the authenticated `Empresa`
- **THEN** the system marks the booking as `cancelled`

#### Scenario: Confirmed booking is canceled
- **WHEN** an authenticated tenant user cancels a booking in `confirmed` state that belongs to the authenticated `Empresa`
- **THEN** the system marks the booking as `cancelled`

### Requirement: Cancellation stores operational reason and ownership rules
The system SHALL require a cancellation reason, store the cancellation timestamp, and reject cancellation attempts for bookings outside the authenticated tenant scope or already in an ineligible terminal state.

#### Scenario: Cancellation reason is stored
- **WHEN** an authenticated tenant user cancels an eligible booking with a valid reason
- **THEN** the system stores the cancellation reason and cancellation timestamp on that booking

#### Scenario: Cross-tenant cancellation is attempted
- **WHEN** an authenticated tenant user tries to cancel a booking belonging to another `Empresa`
- **THEN** the system rejects the operation

#### Scenario: Ineligible booking is targeted for cancellation
- **WHEN** an authenticated tenant user tries to cancel a booking that is already `rejected`, `completed`, `cancelled`, or `no-show`
- **THEN** the system rejects the operation
