## MODIFIED Requirements

### Requirement: Tenant can register a desired storefront domain
The system SHALL allow an authenticated tenant user to register one desired custom storefront domain, whether it is a subdomain or an apex/root domain, for the petshop storefront.

#### Scenario: Tenant saves a desired domain
- **WHEN** an authenticated tenant user provides a valid desired storefront domain in the admin experience
- **THEN** the system stores that desired domain for onboarding instead of activating it immediately

### Requirement: Tenant can understand domain onboarding state and DNS instructions
The system SHALL communicate the onboarding state of the desired storefront domain, including the required DNS instructions for the selected domain type, whether DNS verification or certificate readiness is currently pending, actively processing, blocked by a recoverable failure, or complete, and the latest recoverable outcome shown to the tenant.

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
