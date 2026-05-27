## MODIFIED Requirements

### Requirement: Certificate-readiness records latest outcome and retry timing
The system SHALL persist certificate-readiness progress, including the latest provisioning outcome, the next planned retry when readiness is not yet complete, and the completion time when HTTPS becomes ready for both subdomain and apex/root domains, and SHALL continue recording readiness outcomes after activation so degraded HTTPS service can be detected and recovered automatically.

#### Scenario: Certificate readiness remains incomplete
- **WHEN** the certificate-readiness check does not yet confirm that HTTPS is available for the desired storefront domain
- **THEN** the system records a recoverable incomplete outcome and schedules another readiness attempt

#### Scenario: Monitoring detects HTTPS regression after activation
- **WHEN** a readiness check finds that a previously active custom domain is no longer ready to serve securely
- **THEN** the system records the degraded HTTPS outcome and keeps automatic recovery attempts scheduled

### Requirement: Full domain activation waits for HTTPS readiness
The system SHALL promote the desired storefront domain to fully active only after certificate readiness succeeds, regardless of whether that domain is apex/root or subdomain, and SHALL remove canonical active status again if later monitoring shows that HTTPS readiness has regressed.

#### Scenario: TLS readiness succeeds
- **WHEN** certificate-readiness confirms that the desired storefront domain is ready to serve securely
- **THEN** the system marks the custom domain as fully active for the tenant storefront

#### Scenario: Previously active domain loses HTTPS readiness
- **WHEN** monitoring later confirms that a previously active custom domain is no longer HTTPS-ready
- **THEN** the system stops treating that domain as fully active until certificate readiness succeeds again
