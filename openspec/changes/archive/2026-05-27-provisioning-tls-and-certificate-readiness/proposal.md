## Why

The platform now verifies DNS and automatically activates custom storefront domains, but production readiness still has a gap: a domain can pass DNS validation before HTTPS is actually available. That means the tenant may see the domain as active before certificate issuance or TLS readiness is complete, which risks promoting a custom URL that is not yet safe or reliable to share.

## What Changes

- Add certificate-readiness orchestration after DNS verification so a custom storefront domain is only considered fully active when HTTPS is ready.
- Introduce a separate readiness lifecycle for TLS provisioning, including pending issuance, recoverable failures, and successful certificate activation.
- Update tenant storefront onboarding and `/admin/profile` to distinguish DNS verification from certificate provisioning and show which step is still blocking the canonical switch.
- Keep the shared-host storefront as the canonical public fallback until both DNS verification and certificate readiness succeed.
- Define how the backend persists TLS-readiness metadata, retries certificate provisioning checks, and promotes the custom domain only after the full readiness pipeline completes.

## Capabilities

### New Capabilities
- `tenant-domain-certificate-readiness`: tracks TLS provisioning, certificate readiness, retry behavior, and final HTTPS activation for tenant storefront domains.

### Modified Capabilities
- `tenant-domain-verification-automation`: activation behavior changes so DNS success no longer promotes the domain directly; it must hand off into certificate-readiness orchestration first.
- `tenant-custom-domain-onboarding`: tenant-facing onboarding must show separate DNS and TLS readiness progress instead of treating domain activation as a single-stage flow.
- `tenant-public-profile-console`: `/admin/profile` must communicate certificate provisioning state, latest outcome, and whether HTTPS readiness is still blocking the custom domain from becoming canonical.
- `tenant-storefront-link-management`: canonical-link switching must wait for complete domain readiness, not DNS verification alone.

## Impact

- Backend `Empresas` domain and persistence for certificate-readiness metadata and multi-stage activation logic.
- Background processing in the backend for certificate issuance/readiness polling in addition to DNS verification.
- Tenant admin storefront APIs and UI messaging in `apps/frontend` for DNS-versus-TLS state visibility.
- OpenSpec contracts for staged custom-domain activation and shared-host fallback behavior until HTTPS is ready.
