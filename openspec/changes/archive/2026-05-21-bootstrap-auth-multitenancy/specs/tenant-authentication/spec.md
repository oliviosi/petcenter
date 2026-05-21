## ADDED Requirements

### Requirement: User login issues a tenant-bound bearer token
The system SHALL authenticate a user with email and password, validate the password against the stored hash, and issue a JWT bearer token bound to the user's `Empresa`.

#### Scenario: Successful login
- **WHEN** a user submits valid credentials for an active account
- **THEN** the system returns a successful response with a bearer token that includes the authenticated user identity and `EmpresaId`

#### Scenario: Invalid credentials
- **WHEN** a user submits an unknown email or an invalid password
- **THEN** the system rejects the request without issuing a token

### Requirement: Protected endpoints require a valid bearer token
The system SHALL require a valid JWT bearer token for protected endpoints and SHALL allow access only after token validation succeeds.

#### Scenario: Missing token
- **WHEN** a client calls a protected endpoint without an `Authorization: Bearer <token>` header
- **THEN** the system rejects the request as unauthorized

#### Scenario: Valid token
- **WHEN** a client calls a protected endpoint with a valid bearer token
- **THEN** the system allows the request to reach the protected handler

### Requirement: Authenticated clients can retrieve current session context
The system SHALL provide a protected endpoint that returns the authenticated user identity and a basic summary of the authenticated `Empresa`.

#### Scenario: Current session is retrieved
- **WHEN** an authenticated client calls the current session endpoint with a valid bearer token
- **THEN** the system returns the authenticated user identity together with the current `Empresa` identifier and display name
