## MODIFIED Requirements

### Requirement: Clients can browse a public catalog of petshops
The system SHALL keep the public petshop catalog as a secondary or optional discovery surface rather than the primary public booking shell, while still listing publicly visible petshops when that catalog is explicitly used.

#### Scenario: Secondary public catalog is requested
- **WHEN** a client explicitly requests the public petshop catalog
- **THEN** the system returns listed petshops that are active and public, including the stable identifier needed for slot lookup and any available public rating summary

### Requirement: Clients can filter the public catalog by basic attributes
The system SHALL allow clients to filter the secondary public petshop catalog by petshop name, city, neighborhood, offered service, and public rating threshold.

#### Scenario: Catalog is filtered by city and service
- **WHEN** a client requests the public petshop catalog with city and service filters
- **THEN** the system returns only listed petshops matching those filter values

#### Scenario: Catalog is filtered by minimum rating
- **WHEN** a client requests the public petshop catalog with a minimum public rating filter
- **THEN** the system returns only listed petshops whose public rating summary meets or exceeds that threshold
