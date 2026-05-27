## MODIFIED Requirements

### Requirement: Tenant admin console exposes storefront profile management
The system SHALL provide an authenticated tenant admin console section for viewing and editing the petshop public storefront profile, including the canonical public storefront link, its current availability state, the onboarding state of any desired custom storefront domain, and the latest automated verification context available for that domain.

#### Scenario: Tenant opens the storefront section
- **WHEN** an authenticated tenant user opens the storefront profile section in the admin console
- **THEN** the system shows the tenant-scoped public profile management flow together with storefront link management and custom-domain onboarding context inside the same admin area as bookings and setup

### Requirement: Storefront profile section explains publication state
The system SHALL clearly communicate whether the petshop is currently public or hidden from discovery, how publication state affects public visibility, whether the displayed storefront link is active, preview-only, or unavailable, whether a desired custom domain is pending activation or already active, and what automated verification outcome currently explains that state.

#### Scenario: Tenant reviews storefront visibility and domain readiness
- **WHEN** an authenticated tenant user views the storefront profile section
- **THEN** the system shows whether the petshop is public, explains the operational impact of publishing or hiding the storefront, and clarifies which storefront URL is canonical now versus which custom-domain target may still be pending

#### Scenario: Tenant reviews failed automated verification
- **WHEN** the desired custom domain most recently failed automated verification
- **THEN** the system shows the latest recoverable failure context and clarifies that the shared-host fallback remains the current public entry

### Requirement: Storefront profile section handles validation and recovery clearly
The system SHALL provide clear validation, success, unpublished, and recoverable error states when the tenant updates the public storefront profile, including recoverable automated verification failures for the desired storefront domain.

#### Scenario: Public storefront data is incomplete for publication
- **WHEN** an authenticated tenant user tries to publish the storefront without the required public profile fields
- **THEN** the system shows explicit validation feedback explaining what must be completed before publication

#### Scenario: Domain verification remains recoverable
- **WHEN** an authenticated tenant user reviews a desired domain that has not yet passed automated verification
- **THEN** the system presents that state as recoverable guidance instead of implying the onboarding flow is permanently blocked
