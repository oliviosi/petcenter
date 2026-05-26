## MODIFIED Requirements

### Requirement: Tenant admin console exposes storefront profile management
The system SHALL provide an authenticated tenant admin console section for viewing and editing the petshop public storefront profile, including the canonical public storefront link and its current availability state.

#### Scenario: Tenant opens the storefront section
- **WHEN** an authenticated tenant user opens the storefront profile section in the admin console
- **THEN** the system shows the tenant-scoped public profile management flow together with the current storefront link surface inside the same admin area as bookings and setup

### Requirement: Storefront profile section explains publication state
The system SHALL clearly communicate whether the petshop is currently public or hidden from discovery, how publication state affects public visibility, and whether the canonical storefront link is active, preview-only, or unavailable.

#### Scenario: Tenant reviews storefront visibility
- **WHEN** an authenticated tenant user views the storefront profile section
- **THEN** the system shows whether the petshop is public, explains the operational impact of publishing or hiding the storefront, and clarifies whether the displayed storefront link can already be shared with clients
