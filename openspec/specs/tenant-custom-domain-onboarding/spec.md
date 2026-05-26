## Purpose
Define tenant-facing requirements for registering, verifying, activating, and removing a custom storefront domain.

## Requirements
### Requirement: Tenant can register a desired storefront domain
The system SHALL allow an authenticated tenant user to register one desired custom domain or subdomain for the petshop storefront.

#### Scenario: Tenant saves a desired domain
- **WHEN** an authenticated tenant user provides a valid desired storefront domain in the admin experience
- **THEN** the system stores that desired domain for onboarding instead of activating it immediately

### Requirement: Tenant can understand domain onboarding state and DNS instructions
The system SHALL communicate the onboarding state of the desired storefront domain, including the required DNS instructions and whether the domain is pending setup, verifying, active, failed, or removed.

#### Scenario: Tenant reviews pending domain setup
- **WHEN** an authenticated tenant user opens storefront domain onboarding before DNS is correctly configured
- **THEN** the system shows the desired domain, the required DNS configuration, and that the domain is not yet active

#### Scenario: Tenant reviews failed verification
- **WHEN** domain verification has not succeeded for the desired storefront domain
- **THEN** the system shows a recoverable failure or blocked state together with guidance for the next retry

### Requirement: Only a verified custom domain becomes active
The system SHALL treat a storefront custom domain as active only after verification succeeds.

#### Scenario: Domain verification succeeds
- **WHEN** the desired storefront domain is successfully verified
- **THEN** the system marks that domain as active for the tenant storefront

### Requirement: Tenant can remove or replace the desired custom domain
The system SHALL allow the tenant to remove the current desired or active storefront domain and return the storefront to the shared-host fallback link.

#### Scenario: Tenant removes active custom domain
- **WHEN** an authenticated tenant user removes the active storefront custom domain
- **THEN** the system stops treating that domain as canonical and restores the shared-host storefront link as the tenant-facing fallback entry
