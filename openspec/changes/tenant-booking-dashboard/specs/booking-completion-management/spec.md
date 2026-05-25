## MODIFIED Requirements

### Requirement: Tenant users can complete confirmed bookings
The system SHALL allow authenticated tenant users to complete a confirmed booking belonging to their authenticated `Empresa` through the tenant booking dashboard. A completed booking becomes eligible for feedback submission when the client later presents the valid booking-backed feedback access token and no feedback has yet been stored.

#### Scenario: Confirmed booking is completed
- **WHEN** an authenticated tenant user completes a confirmed booking with a valid final charged price from the tenant booking dashboard
- **THEN** the system marks the booking as `completed`, stores the final charged price, makes the booking eligible for later feedback submission, and reflects the resulting state in the tenant booking dashboard

#### Scenario: Non-confirmed booking is targeted for completion
- **WHEN** an authenticated tenant user tries to complete a booking that is not in `confirmed` state
- **THEN** the system rejects the operation
