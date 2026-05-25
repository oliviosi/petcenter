## ADDED Requirements

### Requirement: Tenant admin console exposes operational setup sections
The system SHALL expand the authenticated tenant admin console with setup sections for professionals and services in addition to the existing booking dashboard.

#### Scenario: Tenant opens the admin console navigation
- **WHEN** an authenticated tenant user opens the admin console
- **THEN** the system exposes navigation to bookings, professionals, and services inside the same tenant-scoped admin area

### Requirement: Tenant console provides professional setup flow
The system SHALL provide a tenant-facing professional setup flow with a professional list and a professional detail view that centralizes profile editing, assigned services, and recurring weekly availability.

#### Scenario: Tenant opens a professional setup view
- **WHEN** an authenticated tenant user selects a professional in the admin console
- **THEN** the system shows that professional's setup view with profile data, assigned services, and recurring weekly availability

### Requirement: Tenant console provides service setup flow
The system SHALL provide a tenant-facing services setup flow for listing and maintaining services that belong to the authenticated `Empresa`.

#### Scenario: Tenant opens the services setup view
- **WHEN** an authenticated tenant user opens the services section
- **THEN** the system shows the tenant-scoped services management flow inside the admin console

### Requirement: Tenant console shows setup state feedback clearly
The system SHALL provide clear loading, empty, validation, activation, success, and recoverable error states for setup workflows that affect public visibility and slot generation.

#### Scenario: Setup data is missing
- **WHEN** an authenticated tenant user opens a setup section that has no professionals, services, assignments, or availability configured yet
- **THEN** the system shows a clear empty-state response that guides the next operational setup step
