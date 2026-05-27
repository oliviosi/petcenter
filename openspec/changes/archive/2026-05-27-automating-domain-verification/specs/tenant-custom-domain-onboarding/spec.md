## ADDED Requirements

### Requirement: Tenant can understand automated verification progress
The system SHALL communicate whether automated verification has started, when the latest verification attempt ran, and whether another retry is still pending for the desired storefront domain.

#### Scenario: Tenant reviews verification progress after saving a domain
- **WHEN** an authenticated tenant user opens storefront domain onboarding after saving a desired domain that is being processed automatically
- **THEN** the system shows that automated verification is in progress or scheduled, together with the latest verification progress context available

## MODIFIED Requirements

### Requirement: Tenant can understand domain onboarding state and DNS instructions
The system SHALL communicate the onboarding state of the desired storefront domain, including the required DNS instructions, whether automated verification is pending setup, actively verifying, active, failed, or removed, and the latest recoverable outcome shown to the tenant.

#### Scenario: Tenant reviews pending domain setup
- **WHEN** an authenticated tenant user opens storefront domain onboarding before DNS is correctly configured
- **THEN** the system shows the desired domain, the required DNS configuration, and that the domain is not yet active

#### Scenario: Tenant reviews failed verification
- **WHEN** domain verification has not succeeded for the desired storefront domain
- **THEN** the system shows a recoverable failure or blocked state together with guidance for the next retry

#### Scenario: Tenant reviews automated verification status
- **WHEN** automated verification has already attempted or scheduled checks for the desired storefront domain
- **THEN** the system shows that verification is being handled automatically and clarifies the latest known verification outcome

### Requirement: Only a verified custom domain becomes active
The system SHALL treat a storefront custom domain as active only after verification succeeds, and SHALL activate that domain automatically once automated verification confirms the expected configuration.

#### Scenario: Domain verification succeeds
- **WHEN** the desired storefront domain is successfully verified
- **THEN** the system marks that domain as active for the tenant storefront
