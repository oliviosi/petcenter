## Why

The custom-domain onboarding flow now models tenant intent and public fallback behavior, but the platform still depends on manual state transitions to move a desired domain from setup into activation. That leaves the white-label journey operationally incomplete: tenants can register a domain, but the product does not yet verify DNS, retry failed checks, or activate the canonical URL automatically when the domain becomes valid.

## What Changes

- Add asynchronous domain-verification orchestration so a saved desired storefront domain can move through verification attempts without manual state changes in application code.
- Define how the platform detects DNS readiness, records verification attempts and failures, and transitions the tenant storefront domain between `pending_setup`, `verifying`, `active`, and `failed`.
- Extend the tenant admin storefront console to show verification progress, latest check outcome, retry guidance, and whether activation happened automatically after a successful verification.
- Preserve the existing shared-host fallback as the canonical storefront link until verification succeeds, then switch canonical sharing to the active custom domain.
- Add operational rules for retry cadence, recoverable failure handling, and verification restart when a tenant updates or removes the desired domain.

## Capabilities

### New Capabilities
- `tenant-domain-verification-automation`: background verification lifecycle for tenant storefront domains, including DNS checks, retries, activation, and recoverable failure reporting.

### Modified Capabilities
- `tenant-custom-domain-onboarding`: onboarding requirements expand from guided state visibility into actual verification progress, latest outcome visibility, and automatic activation after successful verification.
- `tenant-public-profile-console`: `/admin/profile` must show verification execution state, last-check feedback, and retry-oriented guidance in the existing storefront workflow.
- `tenant-storefront-link-management`: canonical-link behavior must remain on the shared-host fallback until automated verification activates the custom domain.

## Impact

- Backend `Empresas` domain, persistence, and application services for verification state transitions and activation rules.
- A new background verification process or scheduled execution path in the backend.
- Frontend admin storefront profile surfaces in `apps/frontend` for progress, outcome, and retry messaging.
- OpenSpec coverage for automated domain verification behavior and canonical-link switching rules driven by real verification results.
