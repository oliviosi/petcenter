## Context

The platform now has booking intake, public slot discovery, and asynchronous confirmation/rejection handling through the booking foundation. What is still missing is the tenant-facing operational surface that lets the petshop work with those bookings after they enter the system.

This change sits directly on top of the new booking domain. It must preserve the existing public booking contract, keep strict tenant scoping through `EmpresaId`, and add internal operational workflows without turning the current booking module into a full scheduling suite. The product journey also establishes an important business rule here: after service delivery, the professional may adjust the final price, and payment still happens in person.

## Goals / Non-Goals

**Goals:**
- Add authenticated tenant booking list and detail endpoints scoped to the authenticated `Empresa`.
- Allow tenant users to filter bookings by operational criteria such as date range, state, and professional.
- Introduce a booking completion action that closes a confirmed booking and stores the final charged price.
- Extend the persisted booking lifecycle so confirmed bookings can move into a completed operational state.
- Expose enough operational booking detail for the petshop to manage day-to-day appointments.

**Non-Goals:**
- Client-driven cancellation or tenant-driven cancellation workflows.
- Rescheduling, slot reassignment, or calendar exception handling.
- Payment processing or online payment gateway integration.
- Rich reporting, dashboards, or analytics beyond operational list/detail views.
- Ratings, reviews, or post-appointment customer feedback flows.

## Decisions

### 1. Keep tenant booking management inside the existing booking module

The next slice should extend the current booking module instead of creating a second parallel operations module. The booking aggregate, repository, and event-driven lifecycle already exist there, so operational reads and completion actions belong beside the current domain.

**Alternatives considered:**
- Create a separate tenant-operations module for bookings: rejected because it would split one lifecycle across two modules.
- Add booking operations to a generic admin module: rejected because it weakens module boundaries.

### 2. Expose tenant operations through authenticated `/bookings` endpoints

Tenant list/detail/completion endpoints should use the same booking resource path family while remaining authenticated and tenant-scoped. This keeps the public `POST /bookings` intake contract intact and gives operational clients a predictable resource model.

**Alternatives considered:**
- Add `/admin/bookings` endpoints: rejected because the codebase currently models tenant operations through authenticated resource routes rather than a separate admin namespace.
- Reuse public booking endpoints for operational reads: rejected because public and tenant concerns have different visibility rules.

### 3. Add a `completed` lifecycle state rather than overloading `confirmed`

The system should distinguish between a booking that has been reserved (`confirmed`) and one whose service was actually delivered (`completed`). Completion should be a one-way operational transition allowed only from `confirmed`.

This keeps the lifecycle semantically clean and supports the product rule that the final price may be adjusted at service completion.

**Alternatives considered:**
- Store final price on `confirmed` bookings without a new state: rejected because reservation and service delivery are different business milestones.
- Introduce multiple post-service states now: rejected because it adds complexity before cancellation/no-show flows exist.

### 4. Require explicit final price when completing a booking

Completion should require the tenant to submit the final charged price. The API should persist that amount on the booking record so operational users can see the actual service value instead of only the scheduled base service price.

**Alternatives considered:**
- Default final price automatically from the service base price: rejected because the product explicitly allows add-ons and discounts at completion time.
- Make final price optional on completion: rejected because completed bookings should carry a finalized operational outcome.

### 5. Model tenant list/detail as booking read models, not direct entity exposure

Tenant booking responses should project the operational data the tenant needs: booking id, state, slot, professional summary, service summary, owner contact, pet snapshot, rejection reason, and final price when completed. This keeps contracts stable and avoids leaking persistence shape directly.

**Alternatives considered:**
- Return the raw booking entity shape: rejected because it couples API clients to persistence evolution.
- Build a separate denormalized reporting table now: rejected because operational list/detail needs are still simple.

## Risks / Trade-offs

- **[Risk] Lifecycle rules may become inconsistent if completion is allowed from the wrong states** -> Mitigation: enforce explicit domain transitions so only `confirmed` bookings can become `completed`.
- **[Risk] Tenant operational queries could become a security issue if they miss `EmpresaId` filters** -> Mitigation: require `EmpresaId` from the authenticated endpoint layer and scope every repository query explicitly.
- **[Risk] Completion without cancellation/no-show support may leave gaps in the full appointment lifecycle** -> Mitigation: keep this slice intentionally narrow and reserve alternative terminal states for a later change.
- **[Trade-off] Requiring explicit final price adds one more action for tenant users** -> Mitigation: keep the completion contract narrow and let clients prefill the base price in the UI if desired.

## Migration Plan

1. Extend the booking domain and persistence with a completed state plus final-price/completion metadata.
2. Add authenticated tenant booking list and detail endpoints with tenant-safe filtering.
3. Add the authenticated booking completion action and its validation rules.
4. Verify tenant read contracts and lifecycle transitions without changing the public booking intake flow.

Rollback can remove the tenant booking endpoints and the added booking completion fields/state while preserving the booking foundation introduced previously.

## Open Questions

- None for this slice; the main operational scope is intentionally narrow.
