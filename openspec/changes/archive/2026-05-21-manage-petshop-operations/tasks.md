## 1. Operational Domain Foundation

- [x] 1.1 Add tenant-scoped domain models and EF mappings for professionals, services, and professional availability.
- [x] 1.2 Create the database migration for the new operational tables, constraints, and relationships.

## 2. Professional and Service Management

- [x] 2.1 Implement authenticated endpoints, validation, and application services to create, list, update, and activate/deactivate professionals within the authenticated `Empresa`.
- [x] 2.2 Implement authenticated endpoints, validation, and application services to create, list, update, and activate/deactivate services within the authenticated `Empresa`.
- [x] 2.3 Enforce tenant ownership checks for all professional and service read/write operations.

## 3. Availability Management

- [x] 3.1 Implement authenticated endpoints, validation, and application services to manage recurring weekly availability windows for professionals.
- [x] 3.2 Enforce professional ownership verification before any availability operation and reject cross-tenant access.
- [x] 3.3 Validate availability windows using weekday plus start/end times, rejecting invalid ranges.
