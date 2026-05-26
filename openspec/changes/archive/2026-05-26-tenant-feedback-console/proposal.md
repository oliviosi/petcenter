## Why

The product already closes the public feedback loop: completed bookings can collect ratings and comments, and petshop ratings already influence public discovery. What remains missing is the tenant-facing operational view of that feedback, leaving petshops unable to monitor reputation, review comments, or connect satisfaction signals back to day-to-day service quality.

## What Changes

- Add an authenticated tenant console section for viewing booking-backed feedback inside the same admin area used for bookings and setup.
- Introduce tenant-scoped operational feedback APIs that expose petshop-level summary signals and individual feedback entries with booking, professional, rating, and comment context.
- Provide a first feedback dashboard slice with recent feedback, summary metrics, filters, and clear empty/error states.
- Connect the new feedback console to the existing admin navigation and booking operations flow without changing the public submission contract.

## Capabilities

### New Capabilities
- `tenant-feedback-console`: Authenticated tenant-facing feedback dashboard and detail experience for viewing petshop reputation signals and booking-backed comments.

### Modified Capabilities

## Impact

- Affects `apps/backend/Api` by adding tenant-scoped feedback read surfaces built on existing booking feedback data.
- Affects `apps/frontend` by expanding the authenticated admin console with a feedback section and tenant-facing feedback views.
- Reuses existing booking feedback submission records and tenant JWT scoping; no change to the public feedback submission flow is required.
