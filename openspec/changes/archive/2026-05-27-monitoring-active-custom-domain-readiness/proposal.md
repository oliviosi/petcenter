## Why

The storefront domain pipeline now handles onboarding, asynchronous DNS verification, TLS readiness, and canonical activation for custom domains, but it still assumes that a fully active domain remains healthy after activation. In production, an active domain can later drift out of compliance because DNS records change, HTTPS readiness regresses, or the platform edge stops serving that hostname safely, and the current product contract does not define how the system should detect, surface, and recover from that state.

## What Changes

- Add post-activation monitoring for fully active custom storefront domains so the platform can re-evaluate DNS and HTTPS readiness after activation.
- Define how the platform records the latest healthy check, the latest degraded outcome, and the operational state of an active custom domain when readiness regresses.
- Keep the shared-host storefront route as the safe canonical fallback whenever an active custom domain is no longer fully ready.
- Extend the tenant admin storefront experience to explain active-domain health, degraded-domain recovery, and fallback behavior after activation.
- Preserve the existing staged onboarding pipeline; this slice adds ongoing monitoring after activation rather than changing how domains first become active.

## Capabilities

### New Capabilities
- `tenant-active-domain-monitoring`: monitoring and recovery rules for custom storefront domains after they have already become active.

### Modified Capabilities
- `tenant-custom-domain-onboarding`: onboarding and recovery messaging must cover the case where a previously active custom domain later becomes degraded.
- `tenant-domain-verification-automation`: background verification must continue monitoring active domains instead of stopping permanently after first success.
- `tenant-domain-certificate-readiness`: HTTPS readiness must support re-checking and degraded outcomes for domains that were previously active.
- `tenant-public-profile-console`: `/admin/profile` must explain post-activation health, degraded readiness, and fallback behavior for the current storefront domain.
- `tenant-storefront-link-management`: canonical-link behavior must define when the shared-host fallback becomes canonical again after an active custom domain loses readiness.

## Impact

- Backend `Empresas` domain lifecycle, background verification/readiness workers, and repository persistence for active-domain health metadata.
- Tenant admin API contracts and frontend messaging in `apps/frontend` for active-domain monitoring and degraded-state recovery.
- Operational configuration for ongoing DNS and HTTPS checks of active custom domains.
- OpenSpec requirements for custom-domain onboarding, background verification, TLS readiness, admin status visibility, and canonical link management.
