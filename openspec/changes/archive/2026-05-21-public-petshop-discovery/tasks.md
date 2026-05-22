## 1. Public Profile Foundation

- [x] 1.1 Extend `Empresa` with the public catalog fields needed for simple discovery, including slug, description, city, neighborhood, contact/address summary, and public listing state.
- [x] 1.2 Create the database migration and persistence updates for the new public profile fields and slug uniqueness constraints.
- [x] 1.3 Add tenant-facing maintenance support for the public petshop profile so catalog data can be managed safely.

## 2. Public Catalog Read APIs

- [x] 2.1 Implement an unauthenticated endpoint to list active public petshops in catalog format.
- [x] 2.2 Implement catalog filtering by petshop name, city, neighborhood, and offered service.
- [x] 2.3 Implement an unauthenticated slug-based detail endpoint for a public petshop profile.

## 3. Public Discovery Composition Rules

- [x] 3.1 Compose public petshop detail responses from the public petshop profile plus active professionals and active services only.
- [x] 3.2 Enforce that inactive or non-public petshops are excluded from public discovery responses.
- [x] 3.3 Keep the first public discovery slice limited to catalog data only, excluding hero images and professional availability summaries.
