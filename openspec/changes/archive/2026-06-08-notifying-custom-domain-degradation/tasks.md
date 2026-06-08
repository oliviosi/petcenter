## 1. Backend notification lifecycle

- [x] 1.1 Extend the custom-domain monitoring model and persistence to store the latest degraded/recovered notification state, reason, sent timestamp, and delivery outcome.
- [x] 1.2 Update the active-domain monitoring workflow so degraded and recovered state transitions trigger exactly one notification attempt per state cycle.
- [x] 1.3 Wire the initial outbound notification delivery for tenant domain alerts using the chosen first-slice channel and fallback behavior.

## 2. API and contract updates

- [x] 2.1 Update tenant storefront API responses to expose the latest custom-domain notification context for degraded and recovered cycles.
- [x] 2.2 Add backend tests covering degraded notification emission, recovery notification emission, and duplicate-suppression across repeated monitoring checks.

## 3. Frontend operational visibility

- [x] 3.1 Update the admin `/admin/profile` storefront experience to show the latest degraded/recovered notification context alongside monitoring state.
- [x] 3.2 Add frontend tests for degraded and recovered notification messaging, including admin-surface behavior when outbound delivery succeeds or fails.
