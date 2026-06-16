## Context

The frontend currently serves a unified booking page used by both admins and clients. Recent changes separated admin and client flows but the client booking UI still uses legacy layout components, resulting in inconsistent UX and some layout regressions during development (see earlier issues with Header/hydration). The provided mockup (screen.png) and DESIGN.md define a vibrant brand and component system for the client booking experience.

## Goals / Non-Goals

**Goals:**
- Implement a dedicated and responsive client booking page matching the mockup.
- Build reusable components (PetSelector/PetChip, ServiceCard, DatePickerHorizontal, TimePill, BookingSummary).
- Map DESIGN.md tokens to Tailwind variables and globals.css, ensuring consistent spacing, typography, colors.
- Preserve existing booking submission flow and backend compatibility; no API changes.
- Ensure accessibility (labels, aria, focus states) and mobile usability (sticky confirm bar).

**Non-Goals:**
- Backend changes or API contract modifications.
- Overhauling admin pages or admin UX.
- Implementing a new calendar server — use existing public booking endpoints for availability.

## Decisions

1. Componentization: Create focused, small components that mirror mockup:
   - PetSelector: horizontally scrollable chips with avatar and name
   - ServiceCard: rounded, elevated cards showing name, short description, price and duration; tap selects and updates filters
   - DatePickerHorizontal: lightweight, accessible horizontal date list; maintains up to 14 days window by default
   - TimePill: small selectable pill elements for available times
   - BookingSummary: sticky/right column on desktop; bottom sticky on mobile

   Rationale: This isolates responsibilities and simplifies testing and reuse across pages.

2. Token mapping: Add DESIGN.md tokens to `apps/frontend/src/styles/design-tokens.json` and wire into Tailwind's `theme.extend.colors` and `fontFamily` in `tailwind.config.js`. Populate `src/app/globals.css` with semantic CSS variables (e.g., --color-primary, --space-md) mapped to tokens.

3. Responsive layout: Use CSS grid with `grid-template-columns: 1fr 360px` on `lg` and above. On smaller screens, single column; the BookingSummary becomes position: sticky; bottom:0 with safe-area-inset and z-index.

4. Accessibility: All interactive cards are real buttons with aria-pressed states; DatePicker uses role=grid/listbox; time pills are radio-group semantics.

## Risks / Trade-offs

- Risk: Naming mismatch between backend and frontend types (precoBase/basePrice, durationMinutes/durationMinutes). Mitigation: normalize in the front-end adapter layer; add type guards and use service.basePrice and service.durationMinutes as canonical fields.
- Risk: Tailwind theme changes may affect other pages. Mitigation: use semantic variables and avoid overriding global utility classes; scope new tokens to booking-related components when possible.

## Migration Plan

1. Implement components and token wiring in a feature branch.
2. Run `npm run build` and visual smoke tests locally.
3. Merge to main once QA passes.

## Open Questions

- Confirm exact currency formatting and thousand separators (use existing formatCurrency util).
- Should the booking summary show add-ons selection? (Design suggests a callout; keep as optional enhancement.)
