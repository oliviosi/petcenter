## MODIFIED Requirements

### Requirement: Tenant can view the canonical storefront link
The system SHALL expose the petshop's canonical public storefront link in the authenticated tenant admin experience using the active custom domain only after automated verification has completed successfully, or the shared-host storefront route when no active custom domain exists.

#### Scenario: Shared-host canonical link is shown
- **WHEN** an authenticated tenant user opens storefront link management and the petshop does not yet have an active custom domain
- **THEN** the system shows the shared-host storefront link as the canonical public entry

#### Scenario: Custom-domain canonical link is shown
- **WHEN** an authenticated tenant user opens storefront link management and the petshop has an active verified custom domain
- **THEN** the system shows the custom-domain storefront link as the canonical public entry

### Requirement: Tenant can understand storefront link availability state
The system SHALL communicate whether the canonical storefront link is active, preview-only, or unavailable based on publication readiness, slug availability, and custom-domain onboarding state, and SHALL keep the shared-host fallback as the active canonical link while automated verification is still pending or has most recently failed.

#### Scenario: Active shared-host link remains available during onboarding
- **WHEN** the petshop storefront is publicly reachable on the shared host while a custom domain is still pending activation
- **THEN** the system keeps the shared-host link active and explains that the custom domain is not yet canonical

#### Scenario: Preview state reflects pending custom domain activation
- **WHEN** the tenant has registered a desired custom domain that is not yet active
- **THEN** the system distinguishes that pending domain from the current canonical storefront link and explains the activation dependency

#### Scenario: Link is unavailable
- **WHEN** the petshop storefront does not have a valid slug and does not have an active custom domain
- **THEN** the system shows that the canonical storefront link is unavailable and explains what must be configured first

#### Scenario: Failed verification keeps fallback canonical
- **WHEN** the most recent automated verification for the desired custom domain has failed
- **THEN** the system keeps the shared-host fallback as the canonical storefront link and explains that automatic retries or future recovery are still required before switching URLs
