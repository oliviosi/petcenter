## Purpose
Define tenant-facing admin console requirements for maintaining the petshop public storefront profile.

## Requirements
### Requirement: Tenant admin console exposes storefront profile management
The system SHALL provide an authenticated tenant admin console section for viewing and editing the petshop public storefront profile.

#### Scenario: Tenant opens the storefront section
- **WHEN** an authenticated tenant user opens the storefront profile section in the admin console
- **THEN** the system shows the tenant-scoped public profile management flow inside the same admin area as bookings and setup

### Requirement: Storefront profile section explains publication state
The system SHALL clearly communicate whether the petshop is currently public or hidden from discovery and how publication state affects public visibility.

#### Scenario: Tenant reviews storefront visibility
- **WHEN** an authenticated tenant user views the storefront profile section
- **THEN** the system shows whether the petshop is public and explains the operational impact of publishing or hiding the storefront

### Requirement: Storefront profile section handles validation and recovery clearly
The system SHALL provide clear validation, success, unpublished, and recoverable error states when the tenant updates the public storefront profile.

#### Scenario: Public storefront data is incomplete for publication
- **WHEN** an authenticated tenant user tries to publish the storefront without the required public profile fields
- **THEN** the system shows explicit validation feedback explaining what must be completed before publication
