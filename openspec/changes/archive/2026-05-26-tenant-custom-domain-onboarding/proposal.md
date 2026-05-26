## Why

The product now supports a storefront-first public journey and a tenant-visible canonical storefront link, but that link still lives under the shared petcenter host and route model. To unlock a stronger white-label offer, tenants need a guided way to connect their own domain or subdomain and understand when that custom entry point is ready to replace the shared link.

## What Changes

- Add a tenant-facing capability for onboarding a custom domain or subdomain for the petshop storefront.
- Extend the admin storefront console to show domain onboarding state, required DNS actions, verification progress, and which public entry URL is currently canonical.
- Define how the public storefront behaves while a custom domain is pending, active, failed verification, or removed, including fallback to the shared petcenter-hosted link.
- Prepare the storefront-first public shell to support host-based entry once a tenant domain is active, without removing the existing slug-based fallback in this slice.

## Capabilities

### New Capabilities
- `tenant-custom-domain-onboarding`: tenant console flows and rules for registering, validating, activating, and monitoring a custom storefront domain.

### Modified Capabilities
- `tenant-storefront-link-management`: the canonical storefront link must support switching between the shared petcenter host and an active tenant-owned domain.
- `tenant-public-profile-console`: the storefront console must communicate domain onboarding state alongside publication and link-sharing state.
- `single-petshop-public-shell`: the public storefront entry must support host-based tenant access while preserving slug-based fallback when a custom domain is not active.

## Impact

- Frontend admin storefront management surfaces in `apps/frontend`
- Public routing and host-aware storefront entry behavior in the frontend shell
- Backend/domain infrastructure contracts needed for domain registration, verification, activation, and fallback
- OpenSpec coverage for tenant domain onboarding and storefront URL ownership
