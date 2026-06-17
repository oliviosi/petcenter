# frontend-session-aware-header-navigation

## What
Add a session-aware Header and navigation to the frontend public and admin layouts. This change will:
- Create a Header component used by the main layouts (public and admin), showing links to primary pages.
- Make PageWrapper / layout session-aware so it can show login state and protect admin links.
- Add visible navigation links on the homepage to secondary pages (catalog, storefront, bookings) and to admin dashboard when authenticated.
- Add tests and validation for header behaviour and visibility based on session state.

## Why
- Improve discoverability of admin and public pages and provide a clear entry to the authenticated dashboard.
- Align navigation with the existing backend auth flow (the frontend already stores admin session token in server cookie).
- Remove manual link discovery and give users explicit navigation to commonly used pages.

## Scope
- Scope: apps/frontend only
- Non-goals: changing backend APIs, changing auth mechanics, styling overhaul beyond small header tokens.

## Acceptance criteria
- Header appears on public and admin layouts.
- When not authenticated the header shows "Entrar" linking to /admin/login and public links (Petshops/Catalog).
- When authenticated the header shows "Dashboard" and a sign-out action that clears admin session and redirects to /admin/login?reason=session.
- Unit/integration tests covering header visibility and navigation links.

## Risks
- Session cookie API differences between server actions and client components — ensure header uses server-side session helpers (getAdminSession) for server-rendered pages.
- Small layout regressions; keep styling constrained and use design tokens.

## Next
Create design.md and tasks.md under the same change folder.
