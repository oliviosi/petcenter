## MODIFIED Requirements

### Requirement: Tenant users can list bookings inside their authenticated scope
The system SHALL allow authenticated tenant users to list bookings belonging only to their authenticated `Empresa`, including operational outcomes such as cancellation and no-show.

#### Scenario: Tenant booking list is requested
- **WHEN** an authenticated tenant user requests the booking list
- **THEN** the system returns only bookings that belong to the authenticated `Empresa`

#### Scenario: Booking list is filtered
- **WHEN** an authenticated tenant user requests the booking list with date range, state, or professional filters
- **THEN** the system returns only bookings matching those filters inside the authenticated tenant scope

#### Scenario: Booking list includes adjustment metadata
- **WHEN** an authenticated tenant user lists bookings that ended as `cancelled` or `no-show`
- **THEN** the system returns the adjustment timestamp and reason associated with each adjusted booking

### Requirement: Tenant users can inspect booking operational details
The system SHALL allow authenticated tenant users to retrieve the operational details of a booking belonging to their authenticated `Empresa`, including cancellation or no-show details when present.

#### Scenario: Booking detail is requested
- **WHEN** an authenticated tenant user requests a booking that belongs to the authenticated `Empresa`
- **THEN** the system returns the booking state, slot, professional, service, owner contact, pet snapshot, and any rejection details, completion details, or adjustment details associated with that booking

#### Scenario: Cross-tenant booking detail is requested
- **WHEN** an authenticated tenant user requests a booking belonging to another `Empresa`
- **THEN** the system rejects the operation
