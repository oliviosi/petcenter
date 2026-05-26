## ADDED Requirements

### Requirement: Tenant can view the canonical storefront link
The system SHALL expose the petshop's canonical public storefront link in the authenticated tenant admin experience using the current storefront slug and the configured public frontend origin.

#### Scenario: Canonical link is shown for a configured storefront
- **WHEN** an authenticated tenant user opens storefront link management for a petshop that has a storefront slug
- **THEN** the system shows the canonical public link that points to that petshop's storefront entry

### Requirement: Tenant can understand storefront link availability state
The system SHALL communicate whether the canonical storefront link is active, preview-only, or unavailable based on the storefront slug and publication readiness of the petshop profile.

#### Scenario: Active link is available
- **WHEN** the petshop storefront has a valid slug and is publicly reachable
- **THEN** the system marks the canonical storefront link as active and explains that it can be shared with clients

#### Scenario: Preview link is shown before publication
- **WHEN** the petshop storefront has a valid slug but is not yet publicly reachable
- **THEN** the system shows the predicted storefront link as preview-only and explains why it is not yet ready for client sharing

#### Scenario: Link is unavailable
- **WHEN** the petshop storefront does not have a valid slug
- **THEN** the system shows that the canonical storefront link is unavailable and explains what must be configured first

### Requirement: Tenant can copy the active storefront link
The system SHALL allow the authenticated tenant user to copy the canonical storefront link when that link is active for public use.

#### Scenario: Tenant copies active link
- **WHEN** an authenticated tenant user requests the copy action for an active storefront link
- **THEN** the system provides the canonical public storefront link for manual sharing
