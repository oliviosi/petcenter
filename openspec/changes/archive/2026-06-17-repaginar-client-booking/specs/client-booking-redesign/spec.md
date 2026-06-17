## ADDED Requirements

### Requirement: Client booking page presents selectable pets
The system SHALL present a PetSelector on the client booking page allowing the user to choose an existing pet or add a new one.

#### Scenario: Select existing pet
- **WHEN** the user has stored pets
- **THEN** PetSelector shows pet chips with avatar and name and tapping a chip sets the selected pet

#### Scenario: Add a new pet fallback
- **WHEN** the user has no stored pets
- **THEN** the PetSelector shows a call-to-action to add a pet and fallback demo pets

### Requirement: Client booking page shows service cards
The system SHALL display ServiceCard components for each service offered by the petshop, including name, short description, price, and duration.

#### Scenario: Service selection updates filters
- **WHEN** the user taps a ServiceCard
- **THEN** the selected service is set as the active filter and the page updates available times accordingly

### Requirement: Horizontal date picker
The system SHALL provide a horizontally scrollable date picker showing at least 7 days and up to 14 days, highlighting the selected date.

#### Scenario: Scroll dates and select
- **WHEN** user scrolls horizontally and taps a date
- **THEN** that date becomes active and the available times are refreshed

### Requirement: Time selection pills
The system SHALL display available times as selectable pill elements with accessible labels and aria states.

#### Scenario: Select time pill
- **WHEN** user taps a time pill
- **THEN** the corresponding slotStart and slotEnd are set in the booking form

### Requirement: Sticky booking summary
The system SHALL show a booking summary that is sticky on desktop (right column) and anchored to bottom in mobile.

#### Scenario: Desktop sticky summary
- **WHEN** viewport is lg or larger
- **THEN** summary appears in a right column and remains visible while scrolling

#### Scenario: Mobile bottom action
- **WHEN** viewport is small
- **THEN** confirm action is anchored to the bottom safe-area and summary content is accessible via a toggle

