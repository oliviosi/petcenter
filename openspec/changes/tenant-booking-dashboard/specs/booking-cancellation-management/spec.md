## MODIFIED Requirements

### Requirement: Tenant users can cancel eligible bookings
The system SHALL allow authenticated tenant users to cancel a booking belonging to their authenticated `Empresa` when that booking is still in `requested` or `confirmed` state through the tenant booking dashboard.

#### Scenario: Requested booking is canceled
- **WHEN** an authenticated tenant user cancels a booking in `requested` state that belongs to the authenticated `Empresa` from the tenant booking dashboard
- **THEN** the system marks the booking as `cancelled` and reflects the resulting state in the tenant booking dashboard

#### Scenario: Confirmed booking is canceled
- **WHEN** an authenticated tenant user cancels a booking in `confirmed` state that belongs to the authenticated `Empresa` from the tenant booking dashboard
- **THEN** the system marks the booking as `cancelled` and reflects the resulting state in the tenant booking dashboard
