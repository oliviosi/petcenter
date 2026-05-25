## MODIFIED Requirements

### Requirement: Tenant users can mark confirmed bookings as no-show
The system SHALL allow authenticated tenant users to mark a confirmed booking belonging to their authenticated `Empresa` as `no-show` when the client does not attend the appointment through the tenant booking dashboard.

#### Scenario: Confirmed booking is marked as no-show
- **WHEN** an authenticated tenant user marks a confirmed booking belonging to the authenticated `Empresa` as no-show from the tenant booking dashboard
- **THEN** the system marks the booking as `no-show` and reflects the resulting state in the tenant booking dashboard

#### Scenario: Non-confirmed booking is targeted for no-show
- **WHEN** an authenticated tenant user tries to mark a booking as no-show while it is not in `confirmed` state
- **THEN** the system rejects the operation
