## ADDED Requirements

### Requirement: Active custom domains continue readiness monitoring after activation
The system SHALL continue evaluating a fully active custom storefront domain after activation using background DNS and HTTPS readiness checks instead of treating first activation as terminal.

#### Scenario: Active domain enters monitoring cadence
- **WHEN** a tenant custom storefront domain has already become fully active
- **THEN** the system keeps scheduling background readiness checks for that domain

### Requirement: Monitoring records healthy and degraded outcomes for active domains
The system SHALL persist the latest healthy monitoring confirmation and the latest degraded monitoring outcome for a custom storefront domain that has already been active.

#### Scenario: Monitoring confirms the domain remains healthy
- **WHEN** a background monitoring check confirms that an active custom domain still satisfies DNS and HTTPS readiness
- **THEN** the system records a new healthy monitoring confirmation without changing the canonical storefront link

#### Scenario: Monitoring detects degraded readiness
- **WHEN** a background monitoring check finds that a previously active custom domain no longer satisfies DNS or HTTPS readiness
- **THEN** the system records the degraded outcome and keeps automated recovery active for that domain

### Requirement: Degraded active domains lose canonical status until readiness is restored
The system SHALL stop treating a previously active custom domain as canonical whenever post-activation monitoring detects degraded readiness, and SHALL restore canonical status only after full readiness returns.

#### Scenario: Active domain regresses after activation
- **WHEN** a previously active custom domain fails post-activation readiness monitoring
- **THEN** the system restores the shared-host storefront route as the canonical public entry until the custom domain becomes fully ready again

#### Scenario: Degraded domain becomes healthy again
- **WHEN** automated recovery later confirms that a previously degraded active custom domain has regained DNS and HTTPS readiness
- **THEN** the system promotes that custom domain back to canonical automatically
