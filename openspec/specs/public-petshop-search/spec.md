## Purpose
Define public petshop catalog browsing, filtering, and slug-based detail lookup requirements.

## Requirements
### Requirement: Clients can browse a public catalog of petshops
The system SHALL provide an unauthenticated endpoint that lists publicly visible petshops in a simple catalog format, including the stable identifier required for public slot lookup.

#### Scenario: Public catalog is requested
- **WHEN** a client requests the public petshop catalog without filters
- **THEN** the system returns listed petshops that are active and public, including the stable identifier needed for slot lookup

### Requirement: Clients can filter the public catalog by basic attributes
The system SHALL allow clients to filter the public petshop catalog by petshop name, city, neighborhood, and offered service.

#### Scenario: Catalog is filtered by city and service
- **WHEN** a client requests the public petshop catalog with city and service filters
- **THEN** the system returns only listed petshops matching those filter values

### Requirement: Public petshop detail uses slug-based lookup
The system SHALL allow clients to request a public petshop detail using the petshop slug.

#### Scenario: Detail is requested by slug
- **WHEN** a client requests a public petshop detail with a valid listed petshop slug
- **THEN** the system returns the matching public petshop detail
