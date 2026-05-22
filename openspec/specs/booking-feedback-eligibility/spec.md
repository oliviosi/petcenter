## Purpose
Define public booking feedback eligibility requirements.

## Requirements
### Requirement: Feedback eligibility is proven by booking-backed token validation
The system SHALL validate feedback eligibility using the booking identifier together with a booking-backed feedback access token instead of tenant authentication or customer accounts.

#### Scenario: Valid token is provided
- **WHEN** a client presents the correct feedback access token for a booking
- **THEN** the system treats the request as eligible for further feedback validation on that booking

#### Scenario: Invalid token is provided
- **WHEN** a client presents an invalid feedback access token for a booking
- **THEN** the system rejects the request

### Requirement: Only completed and not-yet-rated bookings are feedback-eligible
The system SHALL allow feedback only when the targeted booking is completed and no feedback has yet been stored for it.

#### Scenario: Booking is completed and unrated
- **WHEN** a client checks feedback eligibility for a completed booking with a valid token and no stored feedback
- **THEN** the system reports that feedback can be submitted

#### Scenario: Booking is not eligible
- **WHEN** a client checks feedback eligibility for a booking that is not completed or already has stored feedback
- **THEN** the system reports that feedback cannot be submitted
