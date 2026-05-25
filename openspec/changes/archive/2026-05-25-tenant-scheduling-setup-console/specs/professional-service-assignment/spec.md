## MODIFIED Requirements

### Requirement: Tenant users can manage professional-service assignments
The system SHALL allow authenticated tenant users to create, list, and delete assignments between professionals and services belonging to their authenticated `Empresa`, and SHALL expose those flows through the professional setup flow in the tenant admin console.

#### Scenario: Assignment is created
- **WHEN** an authenticated tenant user assigns one of the tenant's active services to one of the tenant's active professionals from the admin console
- **THEN** the system stores the professional-service assignment inside the authenticated tenant scope

#### Scenario: Assignments are listed for a professional
- **WHEN** an authenticated tenant user requests the assigned services for one of the tenant's professionals from the admin console
- **THEN** the system returns only services assigned to that professional inside the authenticated tenant scope

#### Scenario: Assignment is removed
- **WHEN** an authenticated tenant user removes one of the tenant's existing professional-service assignments from the admin console
- **THEN** the system deletes that assignment and keeps the professional and service records unchanged

### Requirement: Assignment operations verify ownership and active state
The system SHALL reject assignment operations when the targeted professional or service belongs to another `Empresa`, is inactive, or is already assigned in the same combination.

#### Scenario: Cross-tenant assignment is attempted
- **WHEN** an authenticated tenant user tries to assign a professional and service that are not both owned by the authenticated `Empresa`
- **THEN** the system rejects the operation

#### Scenario: Inactive record is targeted
- **WHEN** an authenticated tenant user tries to create an assignment for an inactive professional or inactive service
- **THEN** the system rejects the operation

#### Scenario: Duplicate assignment is attempted
- **WHEN** an authenticated tenant user tries to create an assignment that already exists for the same professional and service
- **THEN** the system rejects the operation
