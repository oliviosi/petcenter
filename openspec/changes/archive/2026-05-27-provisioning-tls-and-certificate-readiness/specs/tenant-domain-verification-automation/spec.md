## MODIFIED Requirements

### Requirement: Desired storefront domains are verified asynchronously
The system SHALL evaluate eligible desired storefront domains asynchronously after they are saved, using background verification instead of requiring a tenant-triggered foreground check, and SHALL advance DNS-verified domains into certificate-readiness provisioning rather than activating them immediately.

#### Scenario: Saved domain enters automated verification flow
- **WHEN** an authenticated tenant user saves a valid desired storefront domain
- **THEN** the system schedules background verification attempts for that domain without requiring the tenant to keep the admin screen open

### Requirement: Automated verification records latest outcome and retry timing
The system SHALL persist the latest DNS-verification outcome for a desired storefront domain, including whether the last DNS check is still in progress, failed, or succeeded, together with the next planned retry timing when applicable.

#### Scenario: Verification attempt fails but remains recoverable
- **WHEN** an automated verification attempt does not find the expected DNS configuration
- **THEN** the system records a recoverable failed outcome and keeps a future retry scheduled for the same desired domain

### Requirement: Successful automated verification activates the storefront domain
The system SHALL treat successful automated DNS verification as the prerequisite for certificate-readiness provisioning, and SHALL NOT promote the desired storefront domain directly to active until HTTPS readiness succeeds.

#### Scenario: Verification succeeds in background processing
- **WHEN** an automated verification attempt confirms that the desired storefront domain matches the expected configuration
- **THEN** the system records DNS verification success and transitions the domain into certificate-readiness provisioning instead of marking it active immediately
