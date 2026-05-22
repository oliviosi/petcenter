## Why

The platform can now accept public booking requests and resolve them asynchronously, but tenant users still lack an operational surface to work with those appointments after they enter the system. The next slice should turn bookings into manageable records for the petshop so the product supports daily operations instead of stopping at intake.

## What Changes

- Add tenant-facing booking read APIs so authenticated petshop users can list, filter, and inspect bookings inside their authenticated `Empresa`.
- Add tenant-facing operational actions to move a confirmed booking into its completed state and record the final charged price after service delivery.
- Expose the booking information the petshop needs for day-to-day work, including slot, professional, service, client contact, pet snapshot, state, and rejection details when applicable.
- Extend the booking lifecycle beyond intake-only handling so the tenant can close the operational loop after asynchronous confirmation.
- Keep this slice focused on internal tenant operations, excluding client-driven cancellation, rescheduling, refunds, ratings, and notification workflows.

## Capabilities

### New Capabilities
- `tenant-booking-operations`: Allow authenticated tenant users to list, filter, and inspect bookings belonging to their authenticated `Empresa`.
- `booking-completion-management`: Allow authenticated tenant users to complete confirmed bookings and store the final charged price.

### Modified Capabilities
- `booking-request-management`: Extend the persisted booking lifecycle so tenant operations can act on confirmed bookings and close them after service completion.

## Impact

- Affected code: `apps/backend` booking module, domain states, persistence, authenticated tenant endpoints, and operational read models.
- APIs: adds protected tenant booking list/detail/completion endpoints and extends booking lifecycle contracts used by tenant operations.
- Dependencies: continues using the existing .NET 10 backend stack without introducing new infrastructure beyond the booking foundation already in place.
- Systems: completes the operational tenant side of the booking flow so bookings can be monitored and finalized after public intake and async confirmation.
