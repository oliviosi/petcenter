## 1. Backend Bootstrap

- [x] 1.1 Create the initial `apps/backend` .NET 10 Minimal API project structure and register the required auth, validation, Swagger, and persistence dependencies.
- [x] 1.2 Configure the application startup, environment-based settings, database connection, and a public `/health` endpoint.

## 2. Identity and Persistence Foundation

- [x] 2.1 Model `Empresa` and `User` persistence with the one-user-to-one-empresa relationship and password-hash storage.
- [x] 2.2 Add EF Core database context, entity mappings, and the initial migration for tenant and user tables.
- [x] 2.3 Add development-only seeding for an initial tenant and user record so login can be exercised locally.

## 3. Authentication and Tenant Scoping

- [x] 3.1 Implement the login endpoint, credential validation, and JWT token issuance with `EmpresaId` and user identity claims.
- [x] 3.2 Configure JWT bearer authentication and add a protected current-session endpoint that returns user identity and basic `Empresa` metadata.
- [x] 3.3 Pass `EmpresaId` from the authenticated endpoint layer into the application flow and enforce tenant-scoped data access in the protected slice.
