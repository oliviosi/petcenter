## Why

The product already has the public booking journey and the first tenant booking dashboard, but petshops still lack the authenticated setup surface needed to prepare their operational capacity. Without frontend flows for professionals, services, assignments, and weekly availability, the booking experience depends on manually seeded data instead of a self-service tenant workflow.

## What Changes

- Add a tenant-facing scheduling setup console inside the authenticated admin area for managing professionals and services.
- Add a professional detail/setup flow that lets tenant users assign active services to a professional and manage recurring weekly availability.
- Expand the admin navigation so the current booking dashboard becomes part of a broader tenant operations console instead of a single isolated screen.
- Define clear loading, empty, validation, activation, and recoverable error states for setup workflows that affect public catalog visibility and slot generation.

## Capabilities

### New Capabilities
- `tenant-scheduling-setup-console`: Authenticated tenant admin console for configuring the operational supply side of booking through professionals, services, assignments, and availability.

### Modified Capabilities
- `professional-management`: Extend requirements to cover tenant-facing admin console flows for listing, creating, editing, and activating/deactivating professionals.
- `service-management`: Extend requirements to cover tenant-facing admin console flows for listing, creating, editing, and activating/deactivating services.
- `professional-availability-management`: Extend requirements to cover availability management through the authenticated professional setup flow in the admin console.
- `professional-service-assignment`: Extend requirements to cover service assignment management through the authenticated professional setup flow in the admin console.

## Impact

- Affects `apps/frontend` by expanding the authenticated admin area beyond bookings.
- Reuses existing authenticated backend endpoints for `/professionals`, `/services`, `/professionals/{id}/services`, and `/professionals/{id}/availability`.
- Strengthens the operational path that feeds public discovery and slot generation without changing tenant-scoped backend ownership rules.
