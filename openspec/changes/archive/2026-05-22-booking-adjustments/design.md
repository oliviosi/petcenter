## Context

The platform now supports the full happy path for bookings: public request intake, asynchronous confirmation or rejection, tenant list/detail views, service completion, and post-service feedback. What is still missing is the operational branch for appointments that do not reach service delivery because the petshop cancels them or the client does not appear.

This change extends the existing booking module and must preserve several constraints already established in the codebase: tenant scoping always flows from authenticated `EmpresaId`, the public booking contract remains asynchronous, and the frozen RabbitMQ booking message contract cannot be changed. The design also needs to handle the subtle case where a booking is canceled while still in `requested` state and a late confirmation or rejection event may still arrive from the queue.

## Goals / Non-Goals

**Goals:**
- Add tenant-facing cancellation and no-show actions scoped to the authenticated `Empresa`.
- Extend the booking lifecycle with explicit operational adjustment outcomes instead of overloading `completed` or implicit notes.
- Preserve the current public booking intake and queue contract while allowing tenant adjustments after request intake.
- Expose cancellation and no-show metadata in tenant booking list/detail contracts.
- Keep feedback eligibility unchanged by ensuring only completed bookings remain feedback-eligible.

**Non-Goals:**
- Client self-service cancellation flows.
- Rescheduling, slot reassignment, or booking edits that change slot/professional/service.
- Refunds, payment reversals, or notification workflows.
- RabbitMQ contract changes or queue-side cancellation orchestration.
- Public rating summaries or any feedback aggregation behavior.

## Decisions

### 1. Keep booking adjustments inside the existing booking module

Cancellation and no-show are lifecycle transitions on the same booking aggregate that already handles request, confirmation, rejection, completion, and feedback eligibility. They should live in the existing `Bookings` module rather than a separate operations module.

**Alternatives considered:**
- Create a dedicated adjustment module: rejected because it would split one booking lifecycle across multiple modules.
- Store adjustments as generic audit notes: rejected because the outcomes are business states, not free-form annotations.

### 2. Model `cancelled` and `no-show` as first-class terminal states

The system should distinguish between a booking that was actively canceled and one where the client failed to attend. Both outcomes are terminal and should prevent later completion and feedback submission without relying on inferred rules.

Each state should carry its own metadata:
- `cancelled` -> `CancelledAt`, `CancellationReason`
- `no-show` -> `NoShowAt`, `NoShowReason`

**Alternatives considered:**
- Reuse `rejected`: rejected because `rejected` belongs to asynchronous queue resolution before the appointment is operationally accepted by the tenant.
- Store one generic adjustment state with a type field: rejected because it weakens lifecycle clarity and makes rules harder to enforce.

### 3. Allow tenant cancellation from `requested` and `confirmed`, but no-show only from `confirmed`

Tenant users should be able to cancel a booking that is still pending queue resolution or already confirmed, because both represent real operational appointments that may need to be stopped. No-show should be reserved for bookings that were actually confirmed and reached their expected service time without attendance.

**Alternatives considered:**
- Allow cancellation only from `confirmed`: rejected because it would block legitimate operational cancellations while a request is still pending.
- Allow no-show from `requested`: rejected because an unconfirmed booking was never secured as an operational appointment.

### 4. Late queue events must not reopen a cancelled booking

When a tenant cancels a booking in `requested`, the queue may still emit `booking.confirmed` or `booking.rejected` later. The API should treat `cancelled` as terminal and ignore late queue outcomes for that booking instead of mutating it back into another state.

This keeps the public queue contract unchanged while preserving operational truth inside the API.

**Alternatives considered:**
- Add queue-side cancellation messages: rejected because it changes a frozen cross-service contract and expands scope.
- Disallow cancellation during `requested`: rejected because it forces an implementation limitation into the product workflow.

### 5. Expose adjustments through authenticated `/bookings` actions and read models

Tenant operations should remain under the authenticated booking resource family with action endpoints such as `POST /bookings/{id}/cancel` and `POST /bookings/{id}/no-show`. Tenant list/detail responses should project state-specific metadata so clients can see why a booking ended without service delivery.

**Alternatives considered:**
- Add `/admin/bookings/...` routes: rejected because the repository already models tenant operations through authenticated resource routes.
- Return raw entity fields only in detail views: rejected because both list and detail need stable operational contracts as lifecycle metadata grows.

## Risks / Trade-offs

- **[Risk] Late queue confirmations may arrive after a `requested` booking has been canceled** -> Mitigation: treat `cancelled` as terminal and ignore subsequent `booking.confirmed`/`booking.rejected` events for that booking.
- **[Risk] More lifecycle states increase the chance of invalid transitions** -> Mitigation: enforce explicit domain transition rules so only eligible source states can move into `cancelled` or `no-show`.
- **[Risk] Tenant reads could leak cross-tenant data if adjustment queries skip `EmpresaId`** -> Mitigation: keep adjustment actions and read models scoped by authenticated `EmpresaId` in every repository query.
- **[Trade-off] Separate metadata for cancellation and no-show adds more persistence columns** -> Mitigation: prefer explicit state semantics now over a more ambiguous generic adjustment payload.

## Migration Plan

1. Extend the booking domain and persistence with `cancelled` and `no-show` states plus their timestamps and reasons.
2. Update queue outcome handling so late confirmation or rejection events do not override a canceled booking.
3. Add authenticated tenant cancellation and no-show endpoints with tenant ownership and state validation.
4. Extend tenant booking list/detail contracts with cancellation and no-show metadata.
5. Verify lifecycle transitions, late-event behavior, and tenant-scoped reads without changing the public booking request contract.

Rollback can remove the new adjustment endpoints and fields while preserving existing booking intake, completion, and feedback behavior.

## Open Questions

- None for this slice; the design intentionally defers rescheduling to a future change.
