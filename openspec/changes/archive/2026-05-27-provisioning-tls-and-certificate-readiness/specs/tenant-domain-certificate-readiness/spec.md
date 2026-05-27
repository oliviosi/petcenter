## ADDED Requirements

### Requirement: DNS-verified storefront domains enter certificate-readiness provisioning
The system SHALL transition a desired storefront domain into certificate-readiness provisioning after DNS verification succeeds, instead of activating the domain immediately.

#### Scenario: DNS success starts TLS readiness
- **WHEN** automated domain verification confirms that the desired storefront domain has the expected DNS configuration
- **THEN** the system starts certificate-readiness provisioning for that domain before promoting it to active

### Requirement: Certificate-readiness records latest outcome and retry timing
The system SHALL persist certificate-readiness progress, including the latest provisioning outcome, the next planned retry when readiness is not yet complete, and the completion time when HTTPS becomes ready.

#### Scenario: Certificate readiness remains incomplete
- **WHEN** the certificate-readiness check does not yet confirm that HTTPS is available for the desired storefront domain
- **THEN** the system records a recoverable incomplete outcome and schedules another readiness attempt

### Requirement: Full domain activation waits for HTTPS readiness
The system SHALL promote the desired storefront domain to fully active only after certificate readiness succeeds.

#### Scenario: TLS readiness succeeds
- **WHEN** certificate-readiness confirms that the desired storefront domain is ready to serve securely
- **THEN** the system marks the custom domain as fully active for the tenant storefront
