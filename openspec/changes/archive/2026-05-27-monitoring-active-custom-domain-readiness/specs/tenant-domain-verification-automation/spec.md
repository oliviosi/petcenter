## MODIFIED Requirements

### Requirement: Desired storefront domains are verified asynchronously
The system SHALL evaluate eligible desired storefront domains asynchronously after they are saved, using background verification instead of requiring a tenant-triggered foreground check, SHALL support both subdomain and apex/root domains in that flow, and SHALL continue background verification for domains that have already become active so post-activation DNS drift can be detected automatically.

#### Scenario: Saved domain enters automated verification flow
- **WHEN** an authenticated tenant user saves a valid desired storefront domain
- **THEN** the system schedules background verification attempts for that domain without requiring the tenant to keep the admin screen open

#### Scenario: Active domain stays eligible for DNS monitoring
- **WHEN** a custom storefront domain has already become active
- **THEN** the system continues scheduling background DNS verification checks for that domain on the monitoring cadence

### Requirement: Automated verification records latest outcome and retry timing
The system SHALL persist the latest DNS-verification outcome for a desired storefront domain, including whether the last DNS check is still in progress, failed, or succeeded, together with the next planned retry timing when applicable, regardless of whether the domain is subdomain or apex/root, and SHALL also record when a previously active domain most recently lost DNS readiness.

#### Scenario: Verification attempt fails but remains recoverable
- **WHEN** an automated verification attempt does not find the expected DNS configuration
- **THEN** the system records a recoverable failed outcome and keeps a future retry scheduled for the same desired domain

#### Scenario: Monitoring detects DNS drift after activation
- **WHEN** background DNS verification finds that a previously active custom domain no longer matches the expected configuration
- **THEN** the system records a degraded DNS outcome and keeps automatic recovery attempts scheduled
