## MODIFIED Requirements

### Requirement: Tenant admin console exposes storefront profile management
The system SHALL provide an authenticated tenant admin console section for viewing and editing the petshop public storefront profile, including the canonical public storefront link, its current availability state, and the onboarding state of any desired custom storefront domain.

#### Scenario: Tenant opens the storefront section
- **WHEN** an authenticated tenant user opens the storefront profile section in the admin console
- **THEN** the system shows the tenant-scoped public profile management flow together with storefront link management and custom-domain onboarding context inside the same admin area as bookings and setup

### Requirement: Storefront profile section explains publication state
The system SHALL clearly communicate whether the petshop is currently public or hidden from discovery, how publication state affects public visibility, whether the displayed storefront link is active, preview-only, or unavailable, and whether a desired custom domain is pending activation or already active.

#### Scenario: Tenant reviews storefront visibility and domain readiness
- **WHEN** an authenticated tenant user views the storefront profile section
- **THEN** the system shows whether the petshop is public, explains the operational impact of publishing or hiding the storefront, and clarifies which storefront URL is canonical now versus which custom-domain target may still be pending
