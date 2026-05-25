## ADDED Requirements

### Requirement: Public shell can enter the booking-backed feedback journey
The system SHALL allow a client using the public shell to move from a completed booking into a booking-backed feedback flow without requiring customer accounts or tenant authentication.

#### Scenario: Client starts feedback from a completed booking
- **WHEN** a client reaches a completed booking in the public shell and that booking has a usable feedback token in the same browser context
- **THEN** the system exposes a path into the public feedback flow for that booking

### Requirement: Public feedback route checks eligibility before showing the form
The system SHALL validate booking feedback eligibility before presenting the rating form and SHALL show a client-facing ineligible state when feedback cannot be submitted.

#### Scenario: Booking is feedback-eligible
- **WHEN** a client opens the public feedback route for a booking with a valid feedback token and the booking is eligible for feedback
- **THEN** the system shows the feedback form for that booking

#### Scenario: Booking is not feedback-eligible
- **WHEN** a client opens the public feedback route for a booking that is not eligible for feedback
- **THEN** the system shows a client-facing state explaining that feedback is unavailable for that booking

### Requirement: Public feedback route submits structured ratings
The system SHALL allow the client to submit professional rating, petshop rating, and optional comment through the public feedback flow using the existing feedback submission contract.

#### Scenario: Feedback is submitted from the public shell
- **WHEN** a client submits valid ratings and optional comment for an eligible booking from the public feedback route
- **THEN** the system stores the feedback through the existing public submission API and shows a success confirmation in the public shell

### Requirement: Public feedback flow handles invalid token and duplicate submission states
The system SHALL present explicit client-facing states when the feedback token is invalid or when feedback has already been submitted for the booking.

#### Scenario: Feedback token is invalid
- **WHEN** a client opens the public feedback route or submits feedback with an invalid feedback token
- **THEN** the system shows a client-facing state explaining that the feedback link is no longer valid

#### Scenario: Feedback was already submitted
- **WHEN** a client opens the public feedback route for a booking that already has feedback stored
- **THEN** the system shows a client-facing state explaining that feedback was already submitted for that booking
