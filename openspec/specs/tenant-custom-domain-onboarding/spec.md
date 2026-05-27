## Purpose
Define tenant-facing requirements for registering, verifying, provisioning, activating, and removing a custom storefront domain.

## Requirements
### Requirement: Tenant can register a desired storefront domain
The system SHALL allow an authenticated tenant user to register one desired custom storefront domain, whether it is a subdomain or an apex/root domain, for the petshop storefront.

#### Scenario: Tenant saves a desired domain
- **WHEN** an authenticated tenant user provides a valid desired storefront domain in the admin experience
- **THEN** the system stores that desired domain for onboarding instead of activating it immediately

### Requirement: Tenant can understand automated verification progress
The system SHALL communicate whether automated DNS verification has started, when the latest verification attempt ran, and whether another retry is still pending for the desired storefront domain.

#### Scenario: Tenant reviews verification progress after saving a domain
- **WHEN** an authenticated tenant user opens storefront domain onboarding after saving a desired domain that is being processed automatically
- **THEN** the system shows that automated verification is in progress or scheduled, together with the latest verification progress context available

### Requirement: Tenant can understand certificate-readiness progress
The system SHALL communicate whether certificate provisioning has started, whether HTTPS readiness is still pending, and when the latest certificate-readiness attempt ran for the desired storefront domain.

#### Scenario: Tenant reviews TLS readiness after DNS success
- **WHEN** an authenticated tenant user opens storefront domain onboarding after DNS verification has already succeeded but certificate readiness is still incomplete
- **THEN** the system shows that certificate provisioning is the current blocking step before the custom domain can become active

### Requirement: Tenant can understand domain onboarding state and DNS instructions
The system SHALL communicate the onboarding or recovery state of the desired storefront domain, including the required DNS instructions for the selected domain type, whether DNS verification or certificate readiness is currently pending, actively processing, blocked by a recoverable failure, or complete, and the latest recoverable outcome shown to the tenant, including when a previously active custom domain has become degraded and is being recovered automatically.

#### Scenario: Tenant reviews pending domain setup
- **WHEN** an authenticated tenant user opens storefront domain onboarding before DNS is correctly configured
- **THEN** the system shows the desired domain, the required DNS configuration, and that the domain is not yet active

#### Scenario: Tenant reviews failed verification
- **WHEN** domain verification has not yet passed full readiness for the desired storefront domain
- **THEN** the system shows a recoverable failure or blocked state together with guidance for the next retry

#### Scenario: Tenant reviews automated verification status
- **WHEN** automated verification has already attempted or scheduled checks for the desired storefront domain
- **THEN** the system shows that verification is being handled automatically and clarifies the latest known verification outcome

#### Scenario: Tenant reviews TLS provisioning status
- **WHEN** DNS verification has already succeeded but HTTPS readiness is still pending
- **THEN** the system distinguishes certificate-readiness progress from DNS progress and explains that the custom domain is not yet canonical

#### Scenario: Tenant reviews apex onboarding guidance
- **WHEN** the desired storefront domain is an apex/root domain
- **THEN** the system shows onboarding guidance that differs from the subdomain path when the required DNS strategy is different

#### Scenario: Tenant reviews degraded active domain recovery
- **WHEN** a previously active custom domain has lost readiness after activation
- **THEN** the system explains that the domain is being recovered automatically and that the shared-host fallback is currently canonical

### Requirement: Only a fully ready custom domain becomes active
The system SHALL treat a storefront custom domain as active only after DNS verification and certificate readiness succeed, and SHALL promote that domain automatically only when the full readiness pipeline completes.

#### Scenario: Domain verification succeeds
- **WHEN** the desired storefront domain is successfully verified
- **THEN** the system advances the domain into the remaining readiness steps instead of exposing it as active immediately

### Requirement: Tenant can remove or replace the desired custom domain
The system SHALL allow the tenant to remove the current desired or active storefront domain and return the storefront to the shared-host fallback link.

#### Scenario: Tenant removes active custom domain
- **WHEN** an authenticated tenant user removes the active storefront custom domain
- **THEN** the system stops treating that domain as canonical and restores the shared-host storefront link as the tenant-facing fallback entry
