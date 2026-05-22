## Purpose
Define tenant-bound booking operational visibility requirements.

## Requirements
### Requirement: Tenant users can list bookings inside their authenticated scope
The system SHALL allow authenticated tenant users to list bookings belonging only to their authenticated `Empresa`.

#### Scenario: Tenant booking list is requested
- **WHEN** an authenticated tenant user requests the booking list
- **THEN** the system returns only bookings that belong to the authenticated `Empresa`

#### Scenario: Booking list is filtered
- **WHEN** an authenticated tenant user requests the booking list with date range, state, or professional filters
- **THEN** the system returns only bookings matching those filters inside the authenticated tenant scope

### Requirement: Tenant users can inspect booking operational details
The system SHALL allow authenticated tenant users to retrieve the operational details of a booking belonging to their authenticated `Empresa`.

#### Scenario: Booking detail is requested
- **WHEN** an authenticated tenant user requests a booking that belongs to the authenticated `Empresa`
- **THEN** the system returns the booking state, slot, professional, service, owner contact, pet snapshot, and any rejection details or completion details associated with that booking

#### Scenario: Cross-tenant booking detail is requested
- **WHEN** an authenticated tenant user requests a booking belonging to another `Empresa`
- **THEN** the system rejects the operation
