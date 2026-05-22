## ADDED Requirements

### Requirement: Booking status visibility is proven by a dedicated status access token
The system SHALL validate public booking status visibility using the booking identifier together with a dedicated booking status access token instead of tenant authentication or customer accounts.

#### Scenario: Status token matches booking
- **WHEN** a client presents the correct booking status access token for a booking
- **THEN** the system treats the request as authorized for public status lookup on that booking

#### Scenario: Status token does not match booking
- **WHEN** a client presents a status access token that does not match the targeted booking
- **THEN** the system rejects the request

### Requirement: Status lookup remains available across the persisted booking lifecycle
The system SHALL allow authorized public status lookup regardless of whether the booking is still pending, confirmed, rejected, cancelled, completed, or marked as no-show.

#### Scenario: Booking remains visible after lifecycle progression
- **WHEN** an authorized client checks booking status after the booking changes state
- **THEN** the system returns the current persisted state of that booking instead of limiting visibility to the initial request phase
