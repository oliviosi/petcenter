## Why

The platform now has authenticated tenant access, but each petshop still lacks the operational data needed to run daily scheduling. Before public discovery and booking can work, each tenant needs a secure admin flow to manage professionals, services, and availability inside its own scope.

## What Changes

- Add authenticated admin operations for tenants to manage professionals.
- Add authenticated admin operations for tenants to manage services offered by the petshop.
- Add authenticated admin operations for tenants to define weekly working availability for professionals.
- Establish the first operational backend surface that future admin UI and public booking flows will depend on.
- Reuse the existing tenant authentication and tenant-scoping contracts for all new operations.

## Capabilities

### New Capabilities
- `professional-management`: Manage tenant-scoped professionals in the admin surface.
- `service-management`: Manage tenant-scoped services offered by the petshop.
- `professional-availability-management`: Manage weekly availability windows for professionals inside the tenant scope.

### Modified Capabilities

## Impact

- Affected code: `apps/backend` modules, persistence, validations, and authenticated endpoints for operational management.
- APIs: adds protected CRUD-style endpoints for professionals, services, and professional availability.
- Dependencies: continues using .NET 10 Minimal API, EF Core 10, PostgreSQL, FluentValidation, and JWT bearer auth.
- Systems: unlocks the data foundation required by future admin panel work, public discovery, and booking request flows.
