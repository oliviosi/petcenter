## MODIFIED Requirements

### Requirement: Clients can browse a public catalog of petshops
The system SHALL provide an unauthenticated endpoint that lists publicly visible petshops in a simple catalog format, including the stable identifier required for public slot lookup and the public petshop rating summary when available. The fields used to populate that catalog SHALL come from the tenant-maintained public storefront profile.

#### Scenario: Public catalog is requested
- **WHEN** a client requests the public petshop catalog without filters
- **THEN** the system returns listed petshops that are active and public, including the stable identifier needed for slot lookup and any available public rating summary

### Requirement: Clients can filter the public catalog by basic attributes
The system SHALL allow clients to filter the public petshop catalog by petshop name, city, neighborhood, offered service, and public rating threshold.

#### Scenario: Catalog is filtered by city and service
- **WHEN** a client requests the public petshop catalog with city and service filters
- **THEN** the system returns only listed petshops matching those filter values

#### Scenario: Catalog is filtered by minimum rating
- **WHEN** a client requests the public petshop catalog with a minimum public rating filter
- **THEN** the system returns only listed petshops whose public rating summary meets or exceeds that threshold

### Requirement: Public catalog can be ordered by rating summary
The system SHALL allow clients to order listed petshops by their public rating summary, placing unrated petshops after rated petshops in rating-based ordering.

#### Scenario: Catalog is ordered by rating
- **WHEN** a client requests the public petshop catalog ordered by public rating
- **THEN** the system returns rated petshops ordered by their rating summary before any unrated petshops

### Requirement: Public petshop detail uses slug-based lookup
The system SHALL allow clients to request a public petshop detail using the petshop slug.

#### Scenario: Detail is requested by slug
- **WHEN** a client requests a public petshop detail with a valid listed petshop slug
- **THEN** the system returns the matching public petshop detail
