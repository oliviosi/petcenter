## ADDED Requirements

### Requirement: Tenant can understand certificate-readiness progress
The system SHALL communicate whether certificate provisioning has started, whether HTTPS readiness is still pending, and when the latest certificate-readiness attempt ran for the desired storefront domain.

#### Scenario: Tenant reviews TLS readiness after DNS success
- **WHEN** an authenticated tenant user opens storefront domain onboarding after DNS verification has already succeeded but certificate readiness is still incomplete
- **THEN** the system shows that certificate provisioning is the current blocking step before the custom domain can become active

## MODIFIED Requirements

### Requirement: Tenant can understand domain onboarding state and DNS instructions
The system SHALL communicate the onboarding state of the desired storefront domain, including the required DNS instructions, whether DNS verification or certificate readiness is currently pending, actively processing, blocked by a recoverable failure, or complete, and the latest recoverable outcome shown to the tenant.

#### Scenario: Tenant reviews pending domain setup
- **WHEN** an authenticated tenant user opens storefront domain onboarding before DNS is correctly configured
- **THEN** the system shows the desired domain, the required DNS configuration, and that the domain is not yet active

#### Scenario: Tenant reviews failed verification
- **WHEN** domain verification has not succeeded for the desired storefront domain
- **THEN** the system shows a recoverable failure or blocked state together with guidance for the next retry

#### Scenario: Tenant reviews automated verification status
- **WHEN** automated verification has already attempted or scheduled checks for the desired storefront domain
- **THEN** the system shows that verification is being handled automatically and clarifies the latest known verification outcome

#### Scenario: Tenant reviews TLS provisioning status
- **WHEN** DNS verification has already succeeded but HTTPS readiness is still pending
- **THEN** the system distinguishes certificate-readiness progress from DNS progress and explains that the custom domain is not yet canonical

### Requirement: Only a verified custom domain becomes active
The system SHALL treat a storefront custom domain as active only after DNS verification and certificate readiness succeed, and SHALL promote that domain automatically only when the full readiness pipeline completes.

#### Scenario: Domain verification succeeds
- **WHEN** the desired storefront domain is successfully verified
- **THEN** the system advances the domain into the remaining readiness steps instead of exposing it as active immediately
