## MODIFIED Requirements

### Requirement: Tenant admin console exposes storefront profile management
The system SHALL provide an authenticated tenant admin console section for viewing and editing the petshop public storefront profile, including the canonical public storefront link, its current availability state, the onboarding state of any desired custom storefront domain, the latest DNS-verification context available for that domain, the latest certificate-readiness context available for that domain, and apex-specific DNS guidance when the desired domain is a root domain.

#### Scenario: Tenant opens the storefront section
- **WHEN** an authenticated tenant user opens the storefront profile section in the admin console
- **THEN** the system shows the tenant-scoped public profile management flow together with storefront link management and custom-domain onboarding context inside the same admin area as bookings and setup

### Requirement: Storefront profile section explains publication state
The system SHALL clearly communicate whether the petshop is currently public or hidden from discovery, how publication state affects public visibility, whether the displayed storefront link is active, preview-only, or unavailable, whether a desired custom domain is pending activation or already active, whether DNS verification or certificate readiness currently explains that state, and which DNS strategy applies when the desired domain is apex/root.

#### Scenario: Tenant reviews storefront visibility and domain readiness
- **WHEN** an authenticated tenant user views the storefront profile section
- **THEN** the system shows whether the petshop is public, explains the operational impact of publishing or hiding the storefront, and clarifies which storefront URL is canonical now versus which custom-domain target may still be pending

#### Scenario: Tenant reviews failed automated verification
- **WHEN** the desired custom domain most recently failed automated verification
- **THEN** the system shows the latest recoverable failure context and clarifies that the shared-host fallback remains the current public entry

#### Scenario: Tenant reviews pending certificate readiness
- **WHEN** DNS verification has already passed but certificate readiness is still incomplete
- **THEN** the system shows that HTTPS provisioning is still blocking canonical activation of the custom domain

#### Scenario: Tenant reviews apex DNS setup
- **WHEN** the desired custom domain is an apex/root domain
- **THEN** the system explains the apex-specific DNS strategy instead of reusing subdomain-only instructions
