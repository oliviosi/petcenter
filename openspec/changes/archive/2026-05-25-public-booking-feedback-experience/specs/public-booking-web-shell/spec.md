## MODIFIED Requirements

### Requirement: Public web shell maps the booking journey to stable routes
The system SHALL expose stable public routes for petshop catalog browsing, petshop detail, booking flow, booking status follow-up, and booking-backed feedback follow-up.

#### Scenario: Client navigates through the booking funnel
- **WHEN** a client moves from catalog browsing to petshop detail, booking, booking status, and feedback follow-up
- **THEN** the system preserves that journey through stable browser routes that correspond to those stages
