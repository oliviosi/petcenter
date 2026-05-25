## ADDED Requirements

### Requirement: Tenant dashboard exposes tenant-scoped booking operations
The system SHALL provide an authenticated tenant-facing dashboard that lets users list, inspect, and operate on bookings belonging only to their authenticated `Empresa`.

#### Scenario: Tenant opens the booking dashboard
- **WHEN** an authenticated tenant user opens the booking dashboard
- **THEN** the system exposes tenant-scoped booking operations without showing bookings from any other `Empresa`

### Requirement: Tenant dashboard provides a dedicated login entry
The system SHALL provide a dedicated frontend login entry for tenant users that authenticates through the existing backend auth contract before granting access to the dashboard.

#### Scenario: Tenant signs in from the dashboard entry point
- **WHEN** a tenant user submits valid credentials on the frontend admin login route
- **THEN** the system authenticates with the existing backend auth endpoint and grants access to the tenant dashboard

### Requirement: Tenant dashboard provides booking list and detail flows
The system SHALL expose a booking list flow and a booking detail flow in the tenant dashboard using the existing authenticated booking APIs.

#### Scenario: Tenant navigates from list to detail
- **WHEN** an authenticated tenant user selects a booking from the dashboard list
- **THEN** the system shows the operational detail for that booking inside the tenant dashboard

### Requirement: Tenant dashboard supports operational filters and clear states
The system SHALL provide tenant-facing filters and clear loading, empty, success, and recoverable error states for booking operations.

#### Scenario: Tenant filters bookings
- **WHEN** an authenticated tenant user filters bookings by state, date range, or professional
- **THEN** the system shows only bookings that match those filters inside the authenticated tenant scope

#### Scenario: Dashboard opens with the default operational window
- **WHEN** an authenticated tenant user opens the booking dashboard without custom filters
- **THEN** the system defaults the booking list to today's and upcoming bookings ordered by slot date

#### Scenario: No bookings match the current filters
- **WHEN** an authenticated tenant user applies filters that return no tenant-scoped bookings
- **THEN** the system shows a clear empty-state response in the dashboard

### Requirement: Tenant dashboard can trigger operational booking transitions
The system SHALL allow authenticated tenant users to initiate completion, cancellation, and no-show flows for eligible bookings from the tenant dashboard using the existing booking operation contracts.

#### Scenario: Tenant performs an operational action
- **WHEN** an authenticated tenant user submits a valid completion, cancellation, or no-show action for an eligible booking from the dashboard
- **THEN** the system applies that operational transition and shows the resulting state in the tenant dashboard

### Requirement: Tenant dashboard keeps rejected bookings accessible
The system SHALL keep rejected bookings accessible in the same tenant dashboard through state filters and detail navigation, even when they are not part of the default operational view.

#### Scenario: Tenant inspects rejected bookings
- **WHEN** an authenticated tenant user filters the dashboard to rejected bookings
- **THEN** the system shows rejected bookings that belong to the authenticated `Empresa` and allows the user to inspect their details in the same dashboard experience
