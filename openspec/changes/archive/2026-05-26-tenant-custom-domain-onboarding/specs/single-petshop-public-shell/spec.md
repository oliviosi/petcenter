## MODIFIED Requirements

### Requirement: Public shell starts from a single petshop storefront
The system SHALL provide a public shell whose primary unauthenticated entry point is a storefront for one specific petshop, reached either by an active tenant custom domain or by the shared-host fallback storefront route.

#### Scenario: Client opens an active custom domain
- **WHEN** a client opens an active custom domain assigned to a specific petshop
- **THEN** the system shows that petshop's storefront context and the path into booking without requiring slug-based discovery first

#### Scenario: Client opens the shared-host fallback link
- **WHEN** a client opens the shared-host public entry link assigned to a specific petshop and no active custom domain is being used for that visit
- **THEN** the system shows that petshop's storefront context through the existing fallback route

### Requirement: Public shell defines homepage behavior for the single-petshop model
The system SHALL define homepage behavior that does not present multi-petshop discovery as the primary public product experience, including host-based storefront entry when a tenant custom domain is active.

#### Scenario: Client opens the public homepage on a custom domain
- **WHEN** a client opens the homepage of an active tenant custom domain
- **THEN** the system resolves that host to the intended petshop storefront instead of presenting a neutral multi-tenant entry shell

#### Scenario: Client opens the shared-host public homepage
- **WHEN** a client opens the shared-host public homepage in the single-petshop model
- **THEN** the system either redirects into the intended petshop storefront or presents a neutral shell that orients the client toward a specific petshop entry instead of emphasizing catalog browsing
