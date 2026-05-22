## Context

The project now has a minimal backend foundation with tenant authentication and tenant scoping, but it still lacks the operational data required for actual petshop management. Before public listing and booking can become meaningful, each tenant needs a protected admin surface to maintain professionals, services, and professional availability.

This change builds directly on the authenticated backend slice and must preserve the multi-tenant guarantees already established. All new write and read operations must stay scoped to the authenticated `EmpresaId`, and the implementation should remain narrow enough to support later admin UI and booking work without prematurely designing the full scheduling engine.

## Goals / Non-Goals

**Goals:**
- Add backend support for tenant-scoped management of professionals.
- Add backend support for tenant-scoped management of services.
- Add backend support for tenant-scoped weekly availability windows for professionals.
- Define the first operational contracts that future admin UI and booking flows will consume.
- Preserve explicit tenant propagation from endpoints into services and repositories.

**Non-Goals:**
- Public petshop discovery or search.
- Booking requests, slot reservation, or RabbitMQ orchestration.
- Customer-facing entities such as pets, owners, ratings, or favorites.
- Advanced pricing rules, promotions, or dynamic availability generation.
- Rich authorization roles beyond the authenticated tenant user model already in place.

## Decisions

### 1. Model professionals, services, and availability as separate tenant-bound modules

Each operational concern should have its own module with isolated entities, persistence mappings, and endpoints. This keeps the modular monolith direction intact and prevents a single "admin" module from becoming a catch-all.

**Alternatives considered:**
- Put all operations into one generic admin module: rejected because it creates weak boundaries and makes later expansion harder.
- Delay availability modeling until booking work starts: rejected because serviceability depends on defining when professionals work.

### 2. Scope all operational records directly to `EmpresaId`

Professionals and services should belong directly to an `Empresa`, and professional availability should belong to a professional already scoped to the same `Empresa`. This keeps tenant enforcement simple and auditable across reads and writes.

**Alternatives considered:**
- Infer tenant scope only through nested joins at query time: rejected because direct tenant ownership improves clarity and defensive filtering.
- Use global records shared across tenants: rejected because it conflicts with the strict tenant-isolation model.

### 3. Represent availability as recurring weekly windows

The first operational availability model should store weekday plus start/end time windows for each professional. This is sufficient for later booking-slot generation without forcing date-specific exceptions into the first operational change.

**Alternatives considered:**
- Model concrete calendar slots now: rejected because it overcommits to booking logic too early.
- Store only a boolean "available" flag per day: rejected because it is too coarse for appointment scheduling.

### 4. Prefer narrow CRUD-style admin endpoints over aggregate write commands

This change should expose focused authenticated endpoints for creating, listing, updating, and deactivating operational records. That gives the future admin panel predictable primitives and keeps request validation straightforward.

**Alternatives considered:**
- Create one bulk configuration endpoint for the whole petshop: rejected because it couples unrelated operational areas and complicates partial updates.
- Introduce event-driven writes now: rejected because operational CRUD does not require async processing at this stage.

### 5. Use soft-active state where operational records may stop being offered

Professionals and services should support active/inactive state rather than hard deletion as the primary lifecycle control. This better supports operational continuity and future reporting needs.

**Alternatives considered:**
- Only hard delete records: rejected because disabling an unavailable professional or retired service is a common business need.
- Add full audit/versioning now: rejected because it adds complexity before operational usage patterns are known.

## Risks / Trade-offs

- **[Risk] Availability rules may prove insufficient for vacations or exceptions** -> Mitigation: keep the model intentionally limited to recurring weekly windows and introduce exception handling in a later scheduling change.
- **[Risk] CRUD endpoints may expose too much persistence shape to future clients** -> Mitigation: keep contracts explicit and focused on operational language rather than raw database structure.
- **[Risk] Tenant scoping bugs in nested availability operations would be a security issue** -> Mitigation: require `EmpresaId` in every application flow and verify professional ownership before mutating availability.
- **[Trade-off] Soft-active records increase filtering responsibility on reads** -> Mitigation: make active filtering an explicit service-level rule for operational listings intended for current use.

## Migration Plan

1. Add new tenant-bound entities and mappings for professionals, services, and professional availability.
2. Create and apply a migration for the new operational tables and constraints.
3. Add authenticated endpoints, request validation, and application services for the admin operations.
4. Verify all operational reads/writes stay scoped to the authenticated `EmpresaId`.
5. Build later public discovery and booking changes on top of the operational data foundation.

Rollback can remove the newly introduced operational tables and endpoints while preserving the authentication foundation from the previous change.

## Resolved Defaults

- Services are not assignable to specific professionals in this change; that relationship is deferred to future booking-oriented work.
- Professional availability allows multiple recurring windows per weekday from the first version.
