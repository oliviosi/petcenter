## Purpose
Define tenant-facing requirements for asynchronous verification of custom storefront domains and automatic activation after successful verification.

## Requirements
### Requirement: Desired storefront domains are verified asynchronously
The system SHALL evaluate eligible desired storefront domains asynchronously after they are saved, using background verification instead of requiring a tenant-triggered foreground check.

#### Scenario: Saved domain enters automated verification flow
- **WHEN** an authenticated tenant user saves a valid desired storefront domain
- **THEN** the system schedules background verification attempts for that domain without requiring the tenant to keep the admin screen open

### Requirement: Automated verification records latest outcome and retry timing
The system SHALL persist the latest verification outcome for a desired storefront domain, including whether the last check is still in progress, failed, or succeeded, together with the next planned retry timing when applicable.

#### Scenario: Verification attempt fails but remains recoverable
- **WHEN** an automated verification attempt does not find the expected DNS configuration
- **THEN** the system records a recoverable failed outcome and keeps a future retry scheduled for the same desired domain

### Requirement: Successful automated verification activates the storefront domain
The system SHALL activate the desired storefront domain automatically after a background verification attempt succeeds.

#### Scenario: Verification succeeds in background processing
- **WHEN** an automated verification attempt confirms that the desired storefront domain matches the expected configuration
- **THEN** the system marks that domain as active for the tenant storefront without requiring a second tenant approval step
