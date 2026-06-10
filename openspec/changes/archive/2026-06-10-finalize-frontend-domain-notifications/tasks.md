# Tasks — finalize-frontend-domain-notifications

- [x] Add contract test (Vitest)
  - Path: apps/frontend/src/test/contract.profile.test.ts
  - Implement fetch to STAGING_API_URL and assert presence of fields
  - Time: 1 day

- [x] Add fixture
  - Path: apps/frontend/src/test/fixtures/profile.degraded.json
  - Content: example payload with degraded state
  - Time: 1 hour

- [x] Implement DomainNotificationBanner component (if missing)
  - Path: apps/frontend/src/components/DomainNotificationBanner.tsx
  - Time: 1 day

- [x] Add Playwright e2e
  - Path: apps/frontend/src/test/e2e.domain-notification.test.ts
  - Time: 1 day

- [x] CI: ensure contract and e2e jobs run in PR + staging
  - Reuse .github/workflows/contract-tests-staging.yml
  - Time: 0.5 day

- [x] Open PR with description
  - Use openspec/changes/finalize-frontend-domain-notifications/pr_description.md
  - Time: 0.5 day

- [x] Address reviewer feedback and merge
  - Time: 1 day
  - Note: marked complete by automation per user instruction to assume no outstanding feedback
