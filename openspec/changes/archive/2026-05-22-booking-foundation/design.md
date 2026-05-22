## Context

The backend already supports tenant authentication, tenant-scoped management of professionals, services, and recurring weekly availability, plus public petshop discovery by slug. What is still missing is the booking bridge between public browsing and operational scheduling: clients cannot discover reservable slots, request an appointment, or receive a booking lifecycle that is protected against double-booking.

This change is cross-cutting because it touches public reads, tenant-bound operational data, a new booking domain, and asynchronous messaging. It also has to reconcile two constraints already present in the repository: current public discovery payloads expose human-friendly fields only, while the frozen cross-service booking contract expects stable identifiers and asynchronous events for `/petshops/{id}/slots` and `POST /bookings`.

## Goals / Non-Goals

**Goals:**
- Add a tenant-scoped way to assign active services to active professionals.
- Expose public slot discovery for a public petshop using stable identifiers, service duration, service assignment, weekly availability, and existing public-read rules.
- Introduce a booking aggregate with a minimal lifecycle for `requested`, `confirmed`, and `rejected`.
- Publish and consume the frozen booking queue contract without confirming a slot synchronously inside the API.
- Extend public discovery payloads only as much as needed to support slot lookup and booking requests.

**Non-Goals:**
- Cancellation, rescheduling, no-show handling, or post-service price adjustments.
- Vacation rules, date-specific availability exceptions, or blocked-time calendars.
- Customer accounts, favorites, ratings, or a full CRM for pet owners.
- Rich notification delivery to clients after booking state changes.
- Mobile/frontend implementation details beyond the API contracts they will consume.

## Decisions

### 1. Introduce booking as three focused backend concerns

The first booking slice should stay modular by splitting the work into:
- professional-service assignment
- public slot discovery
- booking request lifecycle

This mirrors the existing modular monolith layout and avoids creating one oversized "scheduling" module before the domain is better understood.

**Alternatives considered:**
- One monolithic scheduling module: rejected because it would mix admin rules, public reads, and async booking writes behind weak boundaries.
- Starting with queue integration only: rejected because the queue has no value until the public and persistence contracts around booking are defined.

### 2. Model professional-service compatibility as an explicit tenant-scoped assignment

The system should store a dedicated association between `Profissional` and `Servico` instead of inferring compatibility from names, specialties, or all-services-by-default behavior. Only professionals and services belonging to the same authenticated `Empresa` and currently active can participate in an assignment.

This keeps booking eligibility explicit, auditable, and reusable by both slot generation and booking validation.

**Alternatives considered:**
- Assume every professional can perform every active service: rejected because it produces incorrect slot availability.
- Encode supported services as free-text on professionals: rejected because it is not relationally safe or query-friendly.

### 3. Generate slots on demand from recurring availability and service duration

The API should derive public slots from:
- the public petshop identifier
- the requested service
- an optional professional filter
- a bounded target date interval
- the service duration
- recurring weekly availability windows
- existing confirmed bookings

No concrete slots table should be introduced in this change. Slots are a read model derived on demand for a bounded date interval, while the queue remains responsible for final conflict serialization. The first slice should default slot discovery to the next 7 days starting from the current date and MUST reject requests that exceed a maximum horizon of 30 days ahead.

**Alternatives considered:**
- Persist concrete future slots in the database: rejected because it creates premature slot lifecycle complexity.
- Return raw availability windows to clients and let them compute slots: rejected because the API must remain the source of truth for availability.

### 4. Persist booking requests before publishing queue events

When a client requests a bookable slot, the API should create an `Agendamento` record in `requested` state first, then publish `booking.requested`. The persisted record should carry tenant scope, booking identifiers, requested slot boundaries, and the minimal intake snapshot required for operational follow-up: owner contact plus pet name and species.

This gives the API an auditable lifecycle, allows idempotent event handling, and prevents the queue from becoming the only source of booking state.

**Alternatives considered:**
- Publish directly to RabbitMQ without persisting first: rejected because booking state would be difficult to reconcile after failures.
- Mark bookings as confirmed immediately and repair later on rejection: rejected because it violates the frozen booking contract.

### 5. Return booking creation responses immediately in `requested` state

`POST /bookings` should return as soon as the booking request is validated, persisted, and published, with the booking still in `requested` state. The first slice should not hold the HTTP request open waiting for queue confirmation because confirmation is explicitly asynchronous and queue latency should not shape the client contract.

This makes the API behavior predictable, aligns with the frozen booking rule, and leaves status transitions to the persisted booking lifecycle rather than to a best-effort request timeout window.

**Alternatives considered:**
- Wait for a bounded confirmation window before replying: rejected because it mixes synchronous and asynchronous semantics in the same contract.
- Return only `202 Accepted` with no booking state payload: rejected because clients benefit from receiving the created booking identifier and initial lifecycle state immediately.

### 6. Process booking confirmation events idempotently

The API should consume `booking.confirmed` and `booking.rejected` events and update the matching booking record only if the transition is valid. Replayed or duplicate events must not create duplicate state transitions.

Because the repository already contains `inbox_entries`, the implementation can follow an inbox-style pattern for consumer deduplication instead of relying on optimistic assumptions about message delivery.

**Alternatives considered:**
- Trust the broker to deliver each event once: rejected because it makes lifecycle correctness fragile.
- Ignore rejected events and keep only a transient HTTP response: rejected because operational users need persistent booking state.

### 7. Extend public discovery payloads with stable identifiers

The current public catalog and public detail payloads expose names and slugs, but booking flows need stable identifiers for the petshop, professional, and service. This change should extend those public responses with the identifiers required by `/petshops/{id}/slots` and `POST /bookings` while preserving existing public discovery behavior.

**Alternatives considered:**
- Add a separate identifier lookup endpoint before booking: rejected because it adds an artificial extra step for every client flow.
- Switch slot lookup to slug-based routing: rejected because the cross-service booking contract is already frozen around petshop ids.

## Risks / Trade-offs

- **[Risk] The current public discovery contracts do not expose the identifiers required by booking** -> Mitigation: explicitly modify the public catalog and public detail requirements in this change.
- **[Risk] Weekly recurring availability is not enough for vacations, holidays, or blocked intervals** -> Mitigation: keep slot generation intentionally limited to recurring windows and defer exceptions to a later scheduling change.
- **[Risk] There is no RabbitMQ implementation surface in the repository yet** -> Mitigation: define a narrow publishing/consuming boundary in the backend and keep the queue contract stable.
- **[Risk] Concurrent requests may see the same slot as available before the queue resolves the winner** -> Mitigation: treat slot discovery as optimistic and rely on the queue plus booking rejection lifecycle for final conflict resolution.
- **[Trade-off] Storing client/pet snapshots without a full customer module duplicates some data** -> Mitigation: keep the snapshot minimal and treat customer management as a later capability if needed.

## Migration Plan

1. Add persistence for professional-service assignments and booking records.
2. Extend public read models to expose stable identifiers for petshops, professionals, and services.
3. Add public slot discovery and booking request endpoints.
4. Add queue publishing for `booking.requested` and queue consumers for `booking.confirmed` / `booking.rejected`.
5. Validate that booking transitions remain tenant-safe and never confirm before the queue event arrives.

Rollback can remove the new booking and assignment tables, public slot endpoint, booking endpoint, and queue handlers while preserving the previously delivered tenant operations and public discovery slices.

## Open Questions

The 30-day maximum should be measured as inclusive calendar days rather than as an exact timestamp window. Because slot discovery is driven by booking dates, not arbitrary instants, calendar-day semantics are easier for clients to reason about, avoid timezone edge cases at the boundary, and produce a more stable API contract.
