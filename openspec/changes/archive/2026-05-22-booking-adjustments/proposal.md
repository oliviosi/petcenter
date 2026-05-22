## Why

The booking flow now covers intake, confirmation, tenant visibility, completion, and post-service feedback, but tenant users still cannot operationally adjust a booking when the service does not happen as planned. The next slice should add explicit adjustment outcomes so petshops can cancel appointments or record no-shows without overloading the completion flow.

## What Changes

- Add tenant-facing cancellation handling so authenticated petshop users can cancel eligible bookings inside their authenticated `Empresa` and record an operational reason.
- Add tenant-facing no-show handling so authenticated petshop users can mark a confirmed booking as unattended when the client does not show up.
- Expose cancellation and no-show details in tenant booking reads so operational users can understand how and why a booking ended without service delivery.
- Extend the booking lifecycle beyond `requested`/`confirmed`/`rejected`/`completed` so operational adjustment outcomes are first-class states instead of inferred from notes or rejected completion attempts.
- Keep this slice focused on tenant-driven operational adjustments, excluding client self-service cancellation, rescheduling, refunds, notification workflows, and RabbitMQ contract changes.

## Capabilities

### New Capabilities
- `booking-cancellation-management`: Allow authenticated tenant users to cancel eligible bookings and store the cancellation reason and timestamp.
- `booking-no-show-management`: Allow authenticated tenant users to mark confirmed bookings as no-show and store the operational reason and timestamp.

### Modified Capabilities
- `tenant-booking-operations`: Extend tenant booking list/detail responses so users can view cancellation and no-show outcomes with their operational metadata.
- `booking-request-management`: Extend the persisted booking lifecycle so accepted bookings can later transition into tenant-driven cancellation or no-show outcomes when service delivery does not proceed.

## Impact

- Affected code: `apps/backend` booking domain states, persistence mappings, tenant booking endpoints, validators, and operational read models.
- APIs: adds protected tenant adjustment endpoints and extends booking list/detail contracts with cancellation and no-show information.
- Dependencies: continues using the existing .NET 10 backend stack without introducing new infrastructure or changing the frozen booking queue contract.
- Systems: closes the operational gap between booking confirmation and service completion when appointments must be ended without attendance or delivery.
