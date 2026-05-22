## Why

The platform already supports tenant authentication and internal petshop operations, but clients still cannot discover petshops through a public catalog. A first public discovery slice is needed now so the product can expose real petshop, professional, and service data without waiting for the full booking workflow.

## What Changes

- Add a public petshop profile surface based on a simple catalog model rather than geolocation-first discovery.
- Add public listing and detail endpoints for active petshops.
- Add public filtering by basic catalog attributes such as name, city, neighborhood, and offered services.
- Expose only public and active operational data needed for discovery, including active professionals and active services.
- Extend tenant-managed petshop data with the public profile attributes required for catalog browsing.

## Capabilities

### New Capabilities
- `public-petshop-profile`: Expose the public catalog profile of a petshop, including public identity and contact/location summary.
- `public-petshop-search`: Allow clients to browse and filter active petshops through a simple public catalog.

### Modified Capabilities
- `professional-management`: Add the public-readability constraints needed so only active professionals participate in public petshop discovery.
- `service-management`: Add the public-readability constraints needed so only active services participate in public petshop discovery.

## Impact

- Affected code: `apps/backend` public endpoints, `Empresa` model/persistence, and read models that compose company, professionals, and services.
- APIs: adds unauthenticated read endpoints for petshop listing and petshop detail.
- Dependencies: continues using the existing .NET 10 backend stack without new infrastructure dependencies.
- Systems: establishes the first customer-facing discovery layer that later booking flows will consume.
