## Context

The backend already models the booking lifecycle as asynchronous: `CreateBookingService` persists a booking in `requested` state, emits a `booking.requested` message contract, and separate services already exist to apply `booking.confirmed` and `booking.rejected` events idempotently with `inbox_entries`. What is missing is the production messaging path itself: the registered publisher only logs the outgoing payload, the API does not open broker connections, and no hosted consumer listens for booking lifecycle outcomes.

This change is cross-cutting because it touches runtime configuration, dependency injection, background processing, external infrastructure, and operational behavior. It also introduces a new external dependency path that must preserve the existing frozen booking queue contract and the current domain rule that late queue outcomes must not reopen a cancelled booking.

## Goals / Non-Goals

**Goals:**
- Publish accepted booking requests to RabbitMQ using the existing frozen `booking.requested` payload.
- Consume `booking.confirmed` and `booking.rejected` from RabbitMQ and route them into the existing booking lifecycle services.
- Make broker configuration explicit and required so the API fails fast when messaging is enabled but misconfigured.
- Preserve idempotent inbound processing through the existing `inbox_entries` mechanism.
- Keep the booking domain behavior unchanged: bookings remain asynchronous and late queue outcomes do not override requested-state cancellations.

**Non-Goals:**
- Building the RabbitMQ microservice that resolves booking conflicts.
- Redesigning booking state transitions or changing public booking APIs.
- Introducing a full outbox/inbox architecture for all modules in the monolith.
- Adding frontend or mobile booking UX changes.

## Decisions

### 1. Introduce a dedicated booking messaging integration layer in the backend API
The API will gain booking-specific infrastructure abstractions for broker options, connection/channel management, publication, and inbound consumption. This keeps RabbitMQ concerns inside the `Bookings` module rather than spreading them across unrelated startup code.

**Why this approach**
- Matches the repository rule that backend modules remain self-contained.
- Keeps application services focused on booking rules, not transport details.
- Makes later replacement of the current logging publisher straightforward.

**Alternatives considered**
- Inject RabbitMQ client types directly into `CreateBookingService`: rejected because it couples domain-facing services to transport details.
- Create a generic shared messaging layer: rejected for now because the repository explicitly avoids backend `Shared/` patterns and only bookings need messaging today.

### 2. Use hosted background consumers for `booking.confirmed` and `booking.rejected`
The API will register a long-lived hosted service that connects to RabbitMQ, declares the required bindings, and consumes booking outcome events while the API is running. The consumer will deserialize the frozen event contracts and delegate to `IConfirmBookingFromEventService` and `IRejectBookingFromEventService`.

**Why this approach**
- The backend already has the event-handling services; a hosted consumer is the missing runtime bridge.
- It fits ASP.NET Core startup and lifecycle management cleanly.
- It avoids exposing event-consumption endpoints that would weaken the service boundary.

**Alternatives considered**
- Polling a queue from an HTTP endpoint or timer job: rejected because queue integration should be continuous and automatic.
- Handling messages inside `Program.cs` directly: rejected because it would make startup code harder to test and maintain.

### 3. Require explicit messaging configuration and broker topology
The integration will read a dedicated configuration section for broker connection settings and booking-specific exchange, queue, and routing keys. Startup will validate that the required values are present before the application begins serving traffic.

**Why this approach**
- Missing or partial broker configuration should fail fast instead of creating bookings that never leave `requested`.
- Exchange, queue, and routing names vary by environment and should remain configurable.
- It aligns with existing startup behavior that already rejects missing JWT, CORS, and database settings.

**Alternatives considered**
- Hardcoding queue topology names: rejected because the repository forbids hardcoded environment-specific infrastructure details.
- Making messaging optional with silent fallback to logging: rejected because it would preserve the current broken production path.

### 4. Acknowledge inbound messages only after successful domain handling
Consumers will only acknowledge a delivery after the event has been deserialized, routed to the corresponding booking service, and that service finishes successfully. Duplicate deliveries remain safe because the booking event handlers already consult `inbox_entries` by `messageId`.

**Why this approach**
- Preserves at-least-once delivery semantics without duplicating booking state transitions.
- Reuses existing idempotency behavior instead of inventing another deduplication layer.
- Ensures malformed or transiently failing deliveries are visible operationally rather than silently lost.

**Alternatives considered**
- Auto-ack on receipt: rejected because a crash during handling would lose the message.
- Deduplicate only in memory: rejected because idempotency must survive restarts and multiple consumers.

### 5. Keep direct publish-after-persist for this change and document the gap
This change will preserve the current sequence of persisting the booking and then publishing `booking.requested`, but will replace the placeholder publisher with a real broker-backed implementation. A full transactional outbox is intentionally deferred.

**Why this approach**
- It satisfies the current product and spec requirement that publication happens after persistence.
- It keeps the scope focused on completing the missing broker integration.
- It avoids expanding this change into a broader reliability redesign across the monolith.

**Alternatives considered**
- Add a transactional outbox now: rejected because it meaningfully increases scope, data model work, and rollout complexity.
- Publish before persistence: rejected because it violates the existing booking contract and risks phantom bookings.

## Risks / Trade-offs

- **[Publish-after-persist is not atomic]** -> The API can still persist a booking and fail before broker publication completes. Mitigation: keep the design scoped to real broker integration now, surface publish failures explicitly, and leave a transactional outbox as a follow-up change if production reliability requires it.
- **[Consumer availability becomes part of booking operations]** -> If the API runs without a healthy broker connection, bookings may stall in `requested`. Mitigation: require explicit configuration, fail fast on invalid startup configuration, and log broker failures clearly.
- **[Message contract drift across services]** -> The queue contract is frozen and shared with the RabbitMQ resolver. Mitigation: reuse the existing contract types and avoid renaming fields or changing payload shape in this change.
- **[Poison messages can cause repeated failures]** -> Invalid payloads or unexpected data may loop. Mitigation: distinguish deserialization/contract failures from domain retry paths and handle them with explicit logging and non-silent rejection behavior.

## Migration Plan

1. Add RabbitMQ configuration entries for local and deployed environments.
2. Deploy the backend with the new publisher and consumer infrastructure while preserving the existing message contracts.
3. Ensure the broker exchange, queues, and bindings exist or are declared by the API on startup.
4. Start consuming booking outcome events and monitor for successful transitions from `requested` to `confirmed` or `rejected`.
5. If rollback is needed, deploy the prior backend version and stop the hosted consumers; queued messages remain in RabbitMQ until consumers resume.

## Open Questions

- Should the API declare the booking queues/exchanges itself in every environment, or should production topology be pre-provisioned with the API only validating connectivity?
- Should malformed inbound messages be dead-lettered explicitly as part of this change, or is structured logging plus broker rejection sufficient for the first slice?
- Do we want a follow-up change for transactional outbox publishing once the end-to-end queue path is proven in production-like environments?
