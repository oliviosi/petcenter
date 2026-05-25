## Purpose
Define tenant-bound professional availability management requirements.

## Requirements
### Requirement: Tenant users can manage recurring weekly availability for professionals
The system SHALL allow authenticated tenant users to define recurring weekly availability windows for professionals belonging to their authenticated `Empresa`, and SHALL expose that workflow through the professional setup flow in the tenant admin console.

#### Scenario: Availability window is created
- **WHEN** an authenticated tenant user submits a valid weekday and start/end times for one of the tenant's professionals from the admin console
- **THEN** the system stores the availability window for that professional

#### Scenario: Availability windows are listed
- **WHEN** an authenticated tenant user requests availability for one of the tenant's professionals from the admin console
- **THEN** the system returns only availability windows associated with that professional inside the authenticated tenant scope

### Requirement: Availability operations verify professional ownership
The system SHALL verify that the targeted professional belongs to the authenticated `Empresa` before creating, listing, updating, or deleting availability windows.

#### Scenario: Cross-tenant availability access is attempted
- **WHEN** an authenticated tenant user targets availability for a professional belonging to another `Empresa`
- **THEN** the system rejects the operation

### Requirement: Availability windows use weekly day and time ranges
The system SHALL represent professional availability as recurring weekly windows defined by weekday, start time, and end time.

#### Scenario: Availability window is invalid
- **WHEN** an authenticated tenant user submits an availability window with an end time that is not after the start time
- **THEN** the system rejects the request with a validation error
