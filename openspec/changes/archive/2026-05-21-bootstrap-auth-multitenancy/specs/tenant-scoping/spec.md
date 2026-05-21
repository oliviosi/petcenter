## ADDED Requirements

### Requirement: Protected tenant operations derive `EmpresaId` from the validated token
The system SHALL derive `EmpresaId` for protected operations from the validated bearer token and SHALL pass that value through the application flow as the tenant scope.

#### Scenario: Tenant scope is resolved from authentication
- **WHEN** a protected endpoint receives a valid bearer token
- **THEN** the endpoint resolves `EmpresaId` from the validated token claims and uses it as the tenant scope for the operation

### Requirement: Tenant-bound data access is isolated by `EmpresaId`
The system SHALL scope tenant-bound operations to the authenticated `EmpresaId` and SHALL NOT trust caller-supplied tenant identifiers in the request payload.

#### Scenario: Caller attempts to force another tenant
- **WHEN** a client sends a protected request containing an `EmpresaId` different from the authenticated token
- **THEN** the system ignores or rejects the caller-supplied tenant identifier and preserves the authenticated tenant scope

#### Scenario: Tenant data is filtered by authenticated scope
- **WHEN** a protected operation reads tenant-bound data
- **THEN** the system returns only records associated with the authenticated `EmpresaId`
