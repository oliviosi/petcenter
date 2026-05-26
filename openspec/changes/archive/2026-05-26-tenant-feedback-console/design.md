## Context

The product already supports public booking-backed feedback submission and uses petshop ratings in public discovery, but tenant operators still have no authenticated surface for reading that feedback. The current admin console is organized around a single authenticated shell with top-level sections for bookings, storefront profile, professionals, and services, and it consistently uses server-side data loading plus tenant-scoped JWT-backed APIs.

This change is cross-cutting because it introduces new tenant-facing read APIs on the backend and a new admin section on the frontend. The feedback data already exists in the `BookingFeedback` domain model with `EmpresaId`, `ProfessionalId`, `ProfessionalRating`, `PetshopRating`, `Comment`, and `SubmittedAt`, so the main design problem is how to expose that operationally without disturbing the public submission flow or bloating the existing booking endpoints.

## Goals / Non-Goals

**Goals:**
- Add a tenant-facing feedback section inside the current authenticated admin console.
- Expose tenant-scoped feedback read APIs for summary metrics and booking-backed feedback entries.
- Show petshop-level reputation signals and professional-level rating summaries using existing stored feedback.
- Let operators filter recent feedback and jump back to the associated booking detail when they need operational context.
- Preserve the current public feedback submission contract and tenant JWT scoping model.

**Non-Goals:**
- Adding moderation, reply, or hide/delete workflows for feedback.
- Reworking the public feedback route or public catalog rating logic.
- Introducing customer accounts, notifications, or analytics beyond the first operational summary slice.
- Embedding feedback data directly into every existing booking list response when a dedicated read surface is clearer.

## Decisions

### 1. Add a dedicated `/admin/feedback` section inside the existing admin shell
The tenant feedback experience will live as a new top-level section in the current authenticated console rather than being embedded into bookings or storefront profile.

**Why this approach**
- Feedback is an operational/reputation concern that cuts across bookings, professionals, and public discovery.
- The admin shell already follows a section-based information architecture, so feedback fits naturally as another top-level destination.
- It leaves room for future slices such as alerts, trends, or coaching workflows without overloading the booking dashboard.

**Alternatives considered**
- Fold feedback into `/admin/bookings`: rejected because it would overload the bookings dashboard with post-service reputation concerns.
- Add feedback to `/admin/profile`: rejected because storefront configuration and customer feedback are separate mental models.

### 2. Expose dedicated tenant feedback read endpoints instead of extending booking list/detail contracts
The backend should provide dedicated authenticated endpoints for tenant feedback summary and tenant feedback listing, backed by the existing `BookingFeedback` data and tenant scoping.

**Why this approach**
- The current booking list/detail contracts are focused on operational state transitions, not reputation analytics.
- Dedicated read surfaces keep feedback concerns explicit and avoid inflating every booking response for screens that do not need feedback data.
- The `BookingFeedback` model already carries all tenant and professional identifiers needed to query safely within `EmpresaId`.

**Alternatives considered**
- Add feedback summary fields to existing booking list/detail endpoints only: rejected because it couples unrelated screens and does not provide an efficient summary endpoint.

### 3. Keep the first slice to one summary page with filters and booking links
The first version should use a single `/admin/feedback` page with summary cards, professional summary rows, and a filtered list of feedback entries that link to `/admin/bookings/[id]` for deeper operational context.

**Why this approach**
- It delivers immediate value without creating a second detail route and duplicating booking context.
- The existing booking detail page already gives the operator the service, pet, and reservation timeline when they need to investigate a comment.
- A single page keeps the first slice implementation aligned with the current server-first admin patterns.

**Alternatives considered**
- Dedicated `/admin/feedback/[id]` route: rejected for the first slice because it adds routing complexity before the list and summary workflow is proven useful.

### 4. Treat summary as petshop health plus professional breakdown
The feedback summary should present both an overall petshop rating snapshot and per-professional aggregates derived from the stored `PetshopRating` and `ProfessionalRating` values.

**Why this approach**
- Petshop operators need the storefront-level reputation signal that affects discovery.
- They also need to spot service-quality patterns at the professional level, which would be invisible if only the petshop average were shown.
- The underlying data already stores both rating axes, so the first slice can expose meaningful insight without new collection flows.

**Alternatives considered**
- Petshop-only summary: rejected because it wastes the professional rating data already being collected.
- Raw feedback list only: rejected because operators need a quick reputational snapshot before reading individual entries.

## Risks / Trade-offs

- **[New backend surface for feedback queries]** -> Query shape may become heavier than current booking reads. **Mitigation:** keep the first slice focused on summary plus filtered list, and query against `EmpresaId` and optional date/professional filters only.
- **[Operators may expect moderation workflows]** -> A read-only first slice could feel incomplete. **Mitigation:** position the change explicitly as operational visibility, not reputation management.
- **[Single-page summary can grow crowded]** -> Petshop summary, professional summary, and entry list compete for space. **Mitigation:** keep the first slice to concise cards and a simple list with progressive disclosure through booking links.
- **[Feedback data may be sparse initially]** -> Many tenants may have no ratings yet. **Mitigation:** require explicit unrated/empty states instead of fake averages.

## Migration Plan

1. Add tenant-scoped feedback read services and authenticated endpoints in the backend.
2. Extend the frontend shared API/types to consume the new endpoints.
3. Add `/admin/feedback` to the authenticated admin navigation.
4. Implement the feedback summary and filtered list page in the frontend admin console.
5. Rollback would remove the admin feedback UI and the dedicated read endpoints without affecting stored feedback or the public submission flow.

## Open Questions

- None for the first slice. The existing feedback data model already provides enough structure for a summary-and-list console.
