## Why

A diferença entre a experiência de cliente e administrador precisa ser mais clara: quando o usuário entra como cliente, ele deve ver uma tela de agendamento otimizada para reservar serviços (seleção de pet, serviços, calendário horizontal, horários em pills, resumo sticky). O objetivo é aumentar conversões e reduzir atrito do booking.

## What Changes

- Introduce a redesigned client booking page following the provided mockup (screen.png) and design tokens (DESIGN.md).
- Add new UI components: PetChip/PetSelector, ServiceCard, DatePickerHorizontal, TimePill, BookingSummary.
- Map DESIGN.md tokens into Tailwind variables and globals.css entries.
- Update BookingPageClient to use new components and preserve existing submission behavior.
- Add responsive behaviors: two-column desktop with right sticky summary; mobile single-column with bottom sticky confirm.
- Add visual regression tests and responsive QA checklist.

## Capabilities

### New Capabilities
- `client-booking-redesign`: Implements the redesigned client booking experience (selection flow, components, responsive behavior, styles).

### Modified Capabilities
- `public-booking-api`: No behavioral API changes expected. (No spec-level modifications.)

## Impact

- Frontend: apps/frontend/src/components/Booking/* and apps/frontend/src/app/bookings/* (BookingPageClient) and global styles (globals.css / tailwind.config.js).
- Backend: None (uses existing public booking endpoints). Ensure types compatibility (service.durationMinutes vs durationMinutes naming).
- Tests: Add visual/responsive checks in apps/frontend/test or scripts.

