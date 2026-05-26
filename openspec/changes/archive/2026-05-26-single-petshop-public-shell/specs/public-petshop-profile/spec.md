## MODIFIED Requirements

### Requirement: Petshops expose a public profile for catalog discovery
The system SHALL maintain a public storefront profile for each petshop that is sufficient for direct single-petshop access, optional catalog discovery, public detail pages, and the transition into slot lookup, including the public rating summary when available. Authenticated tenant users SHALL be able to view and maintain that public profile through the tenant admin console.

#### Scenario: Public profile is available
- **WHEN** a petshop is configured to appear in the public experience
- **THEN** the system exposes its stable identifier together with its public identity and contact/location summary, including public name, slug, description, city, neighborhood, and any available public rating summary

#### Scenario: Tenant edits the public storefront profile
- **WHEN** an authenticated tenant user updates slug, description, city, neighborhood, contact summary, address summary, or public visibility in the admin console
- **THEN** the system persists that storefront profile for the authenticated petshop
