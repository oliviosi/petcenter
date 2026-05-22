## ADDED Requirements

### Requirement: Tenant users can manage professionals
The system SHALL allow authenticated tenant users to create, list, update, activate, and deactivate professionals belonging to their authenticated `Empresa`.

#### Scenario: Professional is created
- **WHEN** an authenticated tenant user submits valid professional data
- **THEN** the system creates a professional associated with the authenticated `Empresa`

#### Scenario: Professionals are listed
- **WHEN** an authenticated tenant user requests the professional list
- **THEN** the system returns only professionals associated with the authenticated `Empresa`

#### Scenario: Professional is deactivated
- **WHEN** an authenticated tenant user deactivates one of the tenant's professionals
- **THEN** the system preserves the professional record and marks it as inactive

### Requirement: Professional operations reject cross-tenant access
The system SHALL reject attempts to read or mutate professionals that do not belong to the authenticated `Empresa`.

#### Scenario: Cross-tenant professional access is attempted
- **WHEN** an authenticated tenant user requests or updates a professional belonging to another `Empresa`
- **THEN** the system rejects the operation
