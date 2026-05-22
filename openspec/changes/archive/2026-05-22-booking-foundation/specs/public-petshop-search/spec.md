## MODIFIED Requirements

### Requirement: Clients can browse a public catalog of petshops
The system SHALL provide an unauthenticated endpoint that lists publicly visible petshops in a simple catalog format, including the stable identifier required for public slot lookup.

#### Scenario: Public catalog is requested
- **WHEN** a client requests the public petshop catalog without filters
- **THEN** the system returns listed petshops that are active and public, including the stable identifier needed for slot lookup
