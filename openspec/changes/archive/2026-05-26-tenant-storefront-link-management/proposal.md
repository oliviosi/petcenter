## Why

After moving the public experience to a single-petshop storefront model, the next operational gap is link ownership inside the tenant console. Petshops need a clear way to view, copy, validate, and share their canonical public storefront link so they can distribute the correct entry point to clients without depending on catalog discovery.

## What Changes

- Add a tenant-facing capability for managing the canonical public storefront link assigned to the petshop.
- Expand the admin storefront console so tenants can see the active public link, understand whether it is shareable, and copy it directly from the product.
- Define how the product communicates link availability when the storefront is unpublished, incomplete, or missing the required public slug.
- Prepare the admin experience for future white-label evolutions by making the current direct link explicit, without introducing custom domains in this slice.

## Capabilities

### New Capabilities
- `tenant-storefront-link-management`: tenant console flows and rules for exposing, validating, and sharing the petshop's canonical public storefront link.

### Modified Capabilities
- `tenant-public-profile-console`: the storefront profile console must communicate the canonical public entry link and its availability state as part of storefront management.

## Impact

- Frontend admin profile/storefront management surfaces in `apps/frontend`
- Storefront URL composition and visibility guidance in the tenant console
- OpenSpec coverage for tenant-admin storefront operations
