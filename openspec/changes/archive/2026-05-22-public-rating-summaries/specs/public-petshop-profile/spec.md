## MODIFIED Requirements

### Requirement: Petshops expose a public profile for catalog discovery
The system SHALL maintain a public catalog profile for each petshop that is sufficient for simple browsing, public detail pages, and the transition into slot lookup, including the public rating summary when available.

#### Scenario: Public profile is available
- **WHEN** a petshop is configured to appear in the public catalog
- **THEN** the system exposes its stable identifier together with its public identity and contact/location summary, including public name, slug, description, city, neighborhood, and any available public rating summary

### Requirement: Only public and active petshops appear in discovery
The system SHALL expose only petshops that are both active and marked as public in the catalog.

#### Scenario: Inactive petshop is hidden
- **WHEN** a petshop is inactive or not marked for public listing
- **THEN** the system excludes that petshop from public discovery responses

### Requirement: Petshop detail exposes active public operational data
The system SHALL expose only active professionals and active services in the public petshop detail response, including the stable identifiers required for slot lookup and booking requests, together with the petshop public rating summary when available.

#### Scenario: Petshop detail is requested
- **WHEN** a client requests the public detail of a listed petshop
- **THEN** the system returns the petshop public profile together with active professionals and active services belonging to that petshop, including their stable identifiers and any available public rating summary
