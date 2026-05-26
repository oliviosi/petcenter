## Purpose
Define the petshop-specific public entry experience where the unauthenticated journey starts from one storefront instead of multi-petshop discovery.

## Requirements
### Requirement: Public shell starts from a single petshop storefront
The system SHALL provide a public shell whose primary unauthenticated entry point is a storefront for one specific petshop instead of a catalog-first marketplace journey.

#### Scenario: Client opens a petshop-specific public link
- **WHEN** a client opens the public entry link assigned to a specific petshop
- **THEN** the system shows that petshop's storefront context and the path into booking without requiring the client to browse other petshops first

### Requirement: Single-petshop storefront leads into the existing booking lifecycle
The system SHALL preserve the transition from storefront to slot discovery, booking submission, booking status follow-up, and booking-backed feedback follow-up for the selected petshop.

#### Scenario: Client continues from storefront to booking lifecycle
- **WHEN** a client continues from a petshop storefront into booking
- **THEN** the system keeps the client within that petshop-specific journey through booking, status, and feedback follow-up routes

### Requirement: Public shell defines homepage behavior for the single-petshop model
The system SHALL define homepage behavior that does not present multi-petshop discovery as the primary public product experience.

#### Scenario: Client opens the public homepage
- **WHEN** a client opens the public homepage in the single-petshop model
- **THEN** the system either redirects into the intended petshop storefront or presents a neutral shell that orients the client toward a specific petshop entry instead of emphasizing catalog browsing
