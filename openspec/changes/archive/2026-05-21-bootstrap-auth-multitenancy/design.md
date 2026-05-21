## Context

This is the first product change, so the backend foundation must be created together with the first cross-cutting security rules. The project requires strict tenant isolation by `EmpresaId`, JWT bearer authentication, and a backend shape that future operational modules can extend without revisiting the auth contract.

The repository guidance already fixes important constraints: backend in .NET 10 Minimal API, PostgreSQL with EF Core, bcrypt password hashing, JWT bearer auth, user-facing messages in pt-BR, code identifiers in English, and explicit tenant scoping passed from endpoints into services.

## Goals / Non-Goals

**Goals:**
- Establish the initial `apps/backend` API structure and composition root.
- Introduce persistence for `Empresa` and `User` as the initial identity model.
- Implement login with password validation and JWT token issuance.
- Define how protected endpoints obtain `EmpresaId` from the validated token and pass it into services.
- Provide a minimal protected endpoint that proves authentication and tenant scoping are wired correctly.

**Non-Goals:**
- Registration, password recovery, refresh tokens, or external identity providers.
- Role/permission management beyond the minimum needed to authenticate a user.
- Public petshop discovery, operational CRUD modules, booking flows, or RabbitMQ integration.
- Cross-service contracts beyond the backend authentication and tenant-scoping baseline.

## Decisions

### 1. Start with a single backend application in `apps/backend`

The first change should produce one runnable .NET 10 Minimal API service as the system entry point. This keeps the initial slice small while still aligning with the modular monolith direction from the repository guidance.

**Alternatives considered:**
- Delay API bootstrap until business modules exist: rejected because auth and tenant scoping are prerequisites for those modules.
- Create multiple backend services now: rejected because it adds operational complexity before domain boundaries are validated.

### 2. Model identity around `Empresa` and `User`

`Empresa` is the tenant boundary and `User` belongs to exactly one `Empresa`. Authentication will validate a user record, and the user-to-tenant association becomes the source for the `EmpresaId` claim in the token.

**Alternatives considered:**
- Store tenant membership in a join table for future multi-tenant users: rejected because the product explicitly states a user belongs to exactly one `Empresa`.
- Use a generic organization model now: rejected because it weakens the domain language defined for the project.

### 3. Use JWT bearer tokens with explicit tenant claims

The login flow will issue a JWT that includes the authenticated user identifier and `EmpresaId`. Protected endpoints will rely on standard bearer authentication, and endpoint handlers will read the validated claim and pass it forward as an explicit input to application services.

**Alternatives considered:**
- Cookie/session authentication: rejected because the documented frontend/backend contract is bearer-token based.
- Reading `EmpresaId` directly from `HttpContext` inside services: rejected because the repository rules explicitly forbid it.

### 4. Keep the first authenticated surface minimal

The initial API surface should include a public health endpoint, a login endpoint, and one protected tenant-aware endpoint for the current authenticated session. The protected endpoint should return the authenticated user identity together with basic `Empresa` metadata needed to bootstrap future admin clients, such as tenant identifier and display name. This keeps the slice minimal while avoiding an immediate follow-up endpoint just to render tenant context after login.

**Alternatives considered:**
- Build full user management in the first change: rejected because it would blur the goal of establishing the platform foundation.
- Expose only login without a protected probe endpoint: rejected because it would leave tenant scoping unproven.
- Return only token/session identity data from the first protected endpoint: rejected because basic `Empresa` metadata is low-cost and useful for frontend bootstrap without expanding domain scope.

### 5. Enforce tenant scoping at the application boundary

Protected request DTOs and service calls must receive `EmpresaId` from the authenticated token, never from the request body. Repository queries for tenant-bound data must always filter by `EmpresaId`, even in this first thin slice, so the pattern is established from day one.

**Alternatives considered:**
- Allow client-supplied `EmpresaId` and compare it later: rejected because it creates an avoidable tenant-isolation risk.
- Hide tenant scoping in a global repository filter without explicit service input: rejected because it obscures flow ownership and conflicts with the explicit-passing rule.

### 6. Use development-only database seeding driven by environment configuration

The first runnable slice should rely on development-only seeding to create one initial `Empresa` and one user when explicit local seed settings are provided through environment configuration. This keeps login bootstrap simple without committing credentials or database secrets into the repository.

**Alternatives considered:**
- Manual SQL script: rejected because it moves essential bootstrap knowledge outside the application and is easier to drift from the model.
- Bootstrap admin command: rejected because it adds command-surface complexity before the backend foundation is proven.

## Risks / Trade-offs

- **[Risk] The initial auth model may be too small for later permission needs** -> Mitigation: keep claims minimal (`sub`, `EmpresaId`) and add authorization capabilities in later changes without breaking login.
- **[Risk] Bootstrapping infrastructure and domain rules together can slow the first delivery** -> Mitigation: keep the first protected endpoint intentionally narrow and defer all non-essential account features.
- **[Risk] Early persistence decisions may constrain future modules** -> Mitigation: model only tenant and user primitives now; postpone unrelated aggregates to later changes.
- **[Trade-off] Explicit tenant propagation adds more parameters in handlers and services** -> Mitigation: accept the verbosity because it makes tenant boundaries auditable and safer.

## Migration Plan

1. Create the backend project structure and register the required packages and configuration.
2. Add persistence for `Empresa` and `User`, including password hash storage.
3. Implement login, token generation, authentication middleware, and the minimal protected endpoint.
4. Seed a development-only tenant and user for local validation when the local seed settings are configured.
5. Roll forward subsequent changes on top of the established auth and tenant contract.

Rollback is straightforward at this stage because the change only introduces the initial backend slice. If the deployment must be reverted, the backend service can be removed and the database reset before dependent modules exist.

## Open Questions

- None at this stage. The current-session endpoint exposes only the minimal `Empresa` summary (`id`, `name`), and local seed credentials remain environment-driven instead of repository-defined.
