## Why

The tenant admin console now covers bookings, professionals, services, assignments, and availability, but the petshop still cannot control its own public storefront from the web interface. The backend already exposes tenant-scoped public profile endpoints, so the next highest-value step is giving operators a self-service console for publishing, updating, and validating the petshop presence that powers public discovery.

## What Changes

- Add an authenticated tenant admin section for viewing and editing the petshop public profile used by public discovery and detail pages.
- Expose the public storefront fields already supported by the backend, including slug, description, city, neighborhood, contact summary, address summary, and public visibility state.
- Define publish/unpublish feedback, profile completeness guidance, validation handling, and recoverable error states inside the admin console.
- Expand the admin navigation so the public profile becomes part of the same tenant operations console as bookings and setup.

## Capabilities

### New Capabilities
- `tenant-public-profile-console`: Authenticated tenant admin console flow for maintaining the petshop public profile and publication state.

### Modified Capabilities
- `public-petshop-profile`: Extend requirements to cover tenant-facing admin maintenance of the public profile and storefront visibility state.
- `public-petshop-search`: Extend requirements to clarify the operational dependency between admin-managed public profile fields and public catalog discovery.

## Impact

- Affects `apps/frontend` by expanding the authenticated admin console with a public profile section.
- Reuses existing authenticated backend endpoints for `GET /petshops/public-profile` and `PUT /petshops/public-profile`.
- Strengthens the bridge between tenant setup workflows and public discovery without changing multi-tenant backend ownership rules.
