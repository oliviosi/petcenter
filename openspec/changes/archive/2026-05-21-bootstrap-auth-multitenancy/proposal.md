## Why

The project needs a safe backend foundation before operational modules and booking flows can be built. The highest-risk cross-cutting concern is multi-tenancy, so authentication and tenant scoping must be defined first to avoid rework and security flaws.

## What Changes

- Bootstrap the backend API structure for the project with health and authenticated endpoints.
- Introduce tenant-aware identity primitives centered on `Empresa` and `User`.
- Define JWT authentication so the API can issue and validate bearer tokens for authenticated users.
- Require tenant scoping through `EmpresaId` extracted from the validated token on protected flows.
- Establish the initial persistence foundation for authentication and tenant-bound data access.

## Capabilities

### New Capabilities
- `tenant-authentication`: Authenticate users with JWT bearer tokens and expose the initial protected API surface.
- `tenant-scoping`: Enforce tenant isolation by deriving `EmpresaId` from the authenticated token and using it to scope protected operations.

### Modified Capabilities

## Impact

- Affected code: `apps/backend` bootstrap, auth endpoints, persistence setup, dependency injection, and middleware/pipeline configuration.
- APIs: adds initial authentication and protected backend endpoints.
- Dependencies: .NET 10 Minimal API, EF Core 10, PostgreSQL provider, FluentValidation, JWT bearer auth, BCrypt.
- Systems: establishes the backend contract future frontend, mobile, and booking flows will depend on.
