# Tasks: Session-aware Header & Navigation

## Overview
Implement Header component, wire into layouts, add sign-out server action, and tests.

## Tasks
- [x] create-header-component — Implement a server Header component at apps/frontend/src/components/Header/Header.tsx that calls getAdminSession(), shows brand and primary navigation, and renders authentication controls (Entrar vs Dashboard / Sair). Use existing UI primitives and design tokens. (estimate: 3h)

- [x] integrate-header-to-layouts — Add Header to public and admin layouts: apps/frontend/src/app/(public)/layout.tsx and apps/frontend/src/app/admin/(dashboard)/layout.tsx. Ensure correct spacing and PageWrapper slot usage. (estimate: 1.5h)  
  depends_on: [create-header-component]

- [x] sign-out-server-action — Implement sign-out server action that clears admin session cookie and redirects to /admin/login?reason=session. Place in apps/frontend/src/app/admin/actions or alongside Header as appropriate. (estimate: 1h)  
  depends_on: [create-header-component]

- [x] add-tests — Unit tests for Header rendering (authenticated / unauthenticated) and an integration test for the sign-out server action. Use Vitest + React Testing Library. (estimate: 2h)  
  depends_on: [create-header-component, sign-out-server-action]

- [x] qa-and-e2e-checklist — Provide a QA checklist for manual verification (links visibility, sign-in/out flow, no regressions). (estimate: 0.5h)  
  depends_on: [integrate-header-to-layouts]

## Ready to implement
When ready, run /opsx:apply to implement the change.
- task: create-header-component
  title: Creating Header component
  description: |
    Implement a server component Header at apps/frontend/src/components/Header/Header.tsx. It should call getAdminSession() to detect admin session and render navigation accordingly. Use existing UI primitives (Button, Card) and design tokens.
  estimate: 3h
  priority: high

- task: integrate-header-to-layouts
  title: Integrate Header into layouts
  description: |
    Include Header in public and admin layouts: apps/frontend/src/app/(public)/layout.tsx and apps/frontend/src/app/admin/(dashboard)/layout.tsx. Ensure correct slot order and spacing.
  estimate: 1.5h
  priority: high
  depends_on: [create-header-component]

- task: sign-out-server-action
  title: Add sign-out server action
  description: |
    Implement a server action to clear admin session cookie and redirect to /admin/login?reason=session. Place under apps/frontend/src/app/admin/actions or in Header component file if appropriate.
  estimate: 1h
  priority: high
  depends_on: [create-header-component]

- task: add-tests
  title: Add tests for Header and session flows
  description: |
    Add unit tests for Header.tsx (authenticated/unauthenticated snapshots) and an integration test for sign-out action. Use Vitest and React Testing Library.
  estimate: 2h
  priority: medium
  depends_on: [create-header-component, sign-out-server-action]

- task: qa-and-e2e-checklist
  title: QA checklist and manual testing
  description: |
    Provide a checklist for manual QA including verifying links, sign-in/out flow, and no regressions on public pages.
  estimate: 0.5h
  priority: low
  depends_on: [integrate-header-to-layouts]

## Ready to implement
All tasks created. When ready, run /opsx:apply to implement the change.
