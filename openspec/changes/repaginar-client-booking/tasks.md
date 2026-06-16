## 1. Scaffolding & Tokens

- [ ] 1.1 Add design tokens file `apps/frontend/src/styles/design-tokens.json` and map basic colors/spacing/typography from DESIGN.md
- [ ] 1.2 Update `apps/frontend/tailwind.config.js` to reference semantic tokens and add new font families
- [ ] 1.3 Add CSS variables to `apps/frontend/src/app/globals.css` for the booking scope

## 2. Components

- [ ] 2.1 Implement `PetChip` and `PetSelector` components under `apps/frontend/src/components/Booking/`
- [ ] 2.2 Implement `ServiceCard` component with selectable state and accessible semantics
- [ ] 2.3 Implement `DatePickerHorizontal` component (7–14 day window, keyboard accessible)
- [ ] 2.4 Implement `TimePill` and `TimeList` components for available times
- [ ] 2.5 Implement `BookingSummary` component with sticky behavior and responsive variants

## 3. Page Integration

- [ ] 3.1 Update `BookingPageClient.tsx` to use the new components and layout (desktop two-column, mobile single column)
- [ ] 3.2 Ensure selected service/pet/date/time update the booking form fields correctly
- [ ] 3.3 Preserve existing submission flow and error handling

## 4. Styles & Visual QA

- [ ] 4.1 Add component-level styles and shadows matching DESIGN.md (use tailwind + semantic classes)
- [ ] 4.2 Add a small set of visual regression snapshots for desktop and mobile
- [ ] 4.3 Manual QA checklist: keyboard navigation, aria labels, touch target sizes

## 5. Tests & Validation

- [ ] 5.1 Run `npm run build` in `apps/frontend` and fix any type/style issues
- [ ] 5.2 Smoke test booking submission against local backend
- [ ] 5.3 Update README or developer notes with how to preview the booking page locally

## 6. Cleanup

- [ ] 6.1 Remove debug artifacts (playwright scripts/screenshots) or move to `.debug/` and ignore
- [ ] 6.2 Final polish and merge PR
