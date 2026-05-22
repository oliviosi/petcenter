## Why

The platform already supports tenant authentication, petshop operations, and public discovery, but clients still cannot request an appointment. The next slice should establish the first booking contracts now so the product can move from browsing to actual reservation requests without overcommitting to a full scheduling engine.

## What Changes

- Add tenant-scoped management of which services each professional can perform.
- Add a public read surface that returns reservable slots for a petshop based on active professionals, active service assignments, service duration, and recurring availability windows.
- Add a booking request flow that accepts a requested slot, validates tenant-scoped availability, and creates an appointment request with an asynchronous confirmation lifecycle.
- Define the first booking states and queue-oriented contracts needed for `booking.requested`, `booking.confirmed`, and `booking.rejected`.
- Extend the public discovery payloads with stable identifiers needed to navigate from public browsing into slot lookup and booking requests.
- Keep the first booking slice focused on reservation intake and conflict-safe confirmation, excluding cancellation, rescheduling, vacations, and advanced exception rules.

## Capabilities

### New Capabilities
- `professional-service-assignment`: Manage which active services can be performed by each professional within the authenticated tenant scope.
- `public-slot-discovery`: Expose public reservable slots for a listed petshop using active professionals, active services, and recurring availability.
- `booking-request-management`: Accept booking requests, persist their lifecycle, and integrate with asynchronous booking confirmation events.

### Modified Capabilities
- `public-petshop-profile`: Expose the stable identifiers and public operational metadata required to transition from public petshop detail into slot lookup and booking.
- `public-petshop-search`: Expose the stable petshop identifier required for clients to request public slots from catalog results.

## Impact

- Affected code: `apps/backend` domain modules, persistence mappings, public read endpoints, authenticated admin endpoints, booking workflows, and RabbitMQ integration points.
- APIs: adds public slot lookup and booking request endpoints, plus protected tenant endpoints for professional-service assignment.
- Dependencies: continues using the existing .NET 10 backend stack and introduces booking event publishing/consumption through the repository's RabbitMQ service boundary.
- Systems: establishes the first end-to-end booking foundation that connects public discovery, operational availability, and asynchronous slot confirmation.
