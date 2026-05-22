## Purpose
Define tenant-bound service management requirements.

## Requirements
### Requirement: Tenant users can manage services
The system SHALL allow authenticated tenant users to create, list, update, activate, and deactivate services belonging to their authenticated `Empresa`.

#### Scenario: Service is created
- **WHEN** an authenticated tenant user submits valid service data
- **THEN** the system creates a service associated with the authenticated `Empresa`

#### Scenario: Services are listed
- **WHEN** an authenticated tenant user requests the service list
- **THEN** the system returns only services associated with the authenticated `Empresa`

#### Scenario: Service is deactivated
- **WHEN** an authenticated tenant user deactivates one of the tenant's services
- **THEN** the system preserves the service record and marks it as inactive

### Requirement: Service data supports operational pricing and duration
The system SHALL store enough operational data for each service to support future booking flows, including display name, duration, and base price.

#### Scenario: Service stores operational attributes
- **WHEN** an authenticated tenant user creates or updates a service
- **THEN** the system persists the service name, duration, base price, and active state within the authenticated tenant scope

### Requirement: Only active services participate in public petshop discovery
The system SHALL expose only active services in public petshop discovery responses.

#### Scenario: Inactive service is omitted from public detail
- **WHEN** a petshop public detail is requested
- **THEN** the system excludes services that are inactive from the public response
