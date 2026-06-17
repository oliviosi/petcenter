# repaginar-home-e-cliente-auth

## What
Full redesign of the public flows and addition of client authentication:
- New landing page that supports shared login (client/admin) matching the provided mockup.
- New client booking shell UI for selecting pet, services, date/time (based on mockup).
- Backend: add Cliente model, repository and endpoints for client register/login (JWT issuance).
- Integrate client auth on frontend: client registration/login, session handling, and booking creation.

## Why
- Separate client and admin experiences: admins keep existing dashboard; clients get a streamlined booking flow.
- Allow owners to approve admin accounts while everyday customers use lightweight accounts.

## Scope
- Backend: apps/backend/Api — add Clients module, DI and endpoints, migrations.
- Frontend: apps/frontend — new landing, login/register UI, booking shell pages.

## Acceptance
- Client can register and login; receives JWT.
- Frontend shows redesigned landing and client booking flow.
- Admin flow unchanged.
