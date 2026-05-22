## ADDED Requirements

### Requirement: Tenant users can mark confirmed bookings as no-show
The system SHALL allow authenticated tenant users to mark a confirmed booking belonging to their authenticated `Empresa` as `no-show` when the client does not attend the appointment.

#### Scenario: Confirmed booking is marked as no-show
- **WHEN** an authenticated tenant user marks a confirmed booking belonging to the authenticated `Empresa` as no-show
- **THEN** the system marks the booking as `no-show`

#### Scenario: Non-confirmed booking is targeted for no-show
- **WHEN** an authenticated tenant user tries to mark a booking as no-show while it is not in `confirmed` state
- **THEN** the system rejects the operation

### Requirement: No-show stores operational reason and ownership rules
The system SHALL require a no-show reason, store the no-show timestamp, and reject no-show attempts for bookings outside the authenticated tenant scope.

#### Scenario: No-show reason is stored
- **WHEN** an authenticated tenant user marks an eligible booking as no-show with a valid reason
- **THEN** the system stores the no-show reason and no-show timestamp on that booking

#### Scenario: Cross-tenant no-show is attempted
- **WHEN** an authenticated tenant user tries to mark a booking belonging to another `Empresa` as no-show
- **THEN** the system rejects the operation
