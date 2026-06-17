# Design: Session-aware Header & Navigation

## Overview
Add a lightweight Header component and wire it into the existing PageWrapper and app layouts. Header responsibilities:
- Show brand/logo and primary navigation links.
- Display session controls: "Entrar" when unauthenticated, and "Dashboard / Sair" when authenticated.
- Prefer server-rendered logic for session detection (use getAdminSession in server components) to keep SEO and initial render consistent.

## Layout integration
- apps/frontend/src/components/Header/Header.tsx (new) — server component that reads session via getAdminSession and renders accordingly.
- Use PageWrapper to accept an optional header slot; default layouts will render Header.
- Public layout: src/app/(public)/layout.tsx — render Header at top.
- Admin layout: src/app/admin/(dashboard)/layout.tsx — render Header with admin-specific links.

## Behaviour
- Header is a server component (or a hybrid server component) that calls getAdminSession() to determine session.
- Sign-out should be a server action that calls setAdminSession(null) or an existing action to clear session cookie and redirect to /admin/login?reason=session.
- Navigation links:
  - Public: Home (/), Petshops (/petshops)
  - Admin (when authenticated): Dashboard (/admin/bookings), Profile (/admin/profile), Services (/admin/services)
  - Authentication: /admin/login when unauthenticated

## Tests
- Unit test for Header component rendering variations (authenticated / unauthenticated).
- Integration test for sign-out server action (assert cookie cleared and redirect).
- E2E manual test checklist for QA.

## Files to add
- components/Header/Header.tsx
- components/Header/Header.test.tsx
- update PageWrapper or layout files to include Header
- update server actions for sign-out if missing

## Constraints
- Do not modify backend
- Use existing session helpers in src/lib/adminSession.ts
- Keep styles via design tokens and existing ui primitives
