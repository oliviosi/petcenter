# QA checklist — Repaginar Client Booking

Checklist to run and validate the redesigned client booking page.

- [ ] Keyboard navigation: can tab to pet selector, services, dates, times and confirm button
- [ ] Aria attributes present: role/listbox for datepicker, aria-pressed on service cards, radio semantics for time pills
- [ ] Focus visible on interactive controls (high contrast outline)
- [ ] Touch targets >= 44px on mobile for actionable items (service cards, time pills)
- [ ] Sticky booking summary behavior: right column sticky on desktop; bottom sticky on mobile (safe-area aware)
- [ ] Form validation: missing contact/pet name/species shows localized pt-BR messages
- [ ] Responsive breakpoints: two-column at lg and above, single column below lg
- [ ] Visual smoke: confirm layout matches mockup for desktop and mobile (snapshots)

Run this checklist manually and mark items as passed when verified.
