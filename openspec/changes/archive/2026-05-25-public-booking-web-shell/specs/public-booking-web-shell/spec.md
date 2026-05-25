## ADDED Requirements

### Requirement: Public web shell exposes the public booking journey
The system SHALL provide a browser-accessible public web shell that allows unauthenticated clients to move through petshop discovery, petshop detail, slot selection, booking submission, and booking status follow-up using the existing public booking capabilities.

#### Scenario: Client starts the public journey
- **WHEN** a client opens the public booking web shell
- **THEN** the system exposes a path into public petshop discovery and the subsequent booking journey without requiring authentication

### Requirement: Public web shell maps the booking journey to stable routes
The system SHALL expose stable public routes for petshop catalog browsing, petshop detail, booking flow, and booking status follow-up.

#### Scenario: Client navigates through the booking funnel
- **WHEN** a client moves from catalog browsing to petshop detail, booking, and booking status
- **THEN** the system preserves that journey through stable browser routes that correspond to those stages

### Requirement: Public web shell submits bookings through existing public APIs
The system SHALL use the existing public backend booking contracts for slot discovery, booking request creation, and booking status follow-up instead of requiring tenant authentication or queue-specific knowledge in the browser.

#### Scenario: Client submits a booking from the public shell
- **WHEN** a client selects a bookable slot and submits the required pet and owner information
- **THEN** the system creates the booking through the public booking API and transitions the client into the public booking status flow

### Requirement: Public web shell handles public loading, empty, and failure states
The system SHALL present explicit loading, empty, validation, and failure states for catalog browsing, petshop detail, slot discovery, booking submission, and booking status lookup.

#### Scenario: No slots are available
- **WHEN** a client reaches booking for a valid petshop and service but no reservable slots are returned
- **THEN** the system shows a clear empty-state response instead of an ambiguous or broken interface

#### Scenario: Public request fails
- **WHEN** a public catalog, detail, booking, or status request fails
- **THEN** the system shows a recoverable error state that keeps the client oriented in the booking journey
