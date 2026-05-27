## ADDED Requirements

### Requirement: Tenant can register an apex storefront domain
The system SHALL allow an authenticated tenant user to register an apex/root domain as the desired storefront domain in addition to a subdomain.

#### Scenario: Tenant saves an apex domain
- **WHEN** an authenticated tenant user provides a valid apex/root domain in the admin experience
- **THEN** the system stores that domain as a supported desired storefront domain instead of rejecting it for not being a subdomain

### Requirement: Apex domains provide root-domain-specific DNS guidance
The system SHALL present DNS guidance for apex domains using a root-domain-compatible strategy instead of subdomain CNAME-only guidance.

#### Scenario: Tenant reviews apex DNS instructions
- **WHEN** the desired storefront domain is an apex/root domain
- **THEN** the system shows DNS instructions that are appropriate for root-domain setup

### Requirement: Apex domains can pass readiness using supported root-domain DNS outcomes
The system SHALL verify an apex/root domain when its resolved DNS outcome matches one of the platform-supported apex target patterns.

#### Scenario: Apex domain resolves to the supported platform target
- **WHEN** the desired apex/root domain resolves to a supported platform apex target
- **THEN** the system treats the domain as DNS-verified and continues the staged readiness pipeline
