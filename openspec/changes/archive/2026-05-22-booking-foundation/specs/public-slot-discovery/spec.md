## ADDED Requirements

### Requirement: Clients can query public reservable slots for a petshop
The system SHALL provide an unauthenticated slot discovery endpoint at `/petshops/{id}/slots` for active public petshops.

#### Scenario: Slots are requested for a public petshop
- **WHEN** a client requests slots for an active public petshop using its stable identifier, a target service, and a bounded target date interval
- **THEN** the system returns reservable slots that belong only to that petshop

#### Scenario: Slots are filtered by professional
- **WHEN** a client requests slots for an active public petshop with both service and professional filters inside a bounded target date interval
- **THEN** the system returns only slots for that professional-service combination inside the requested petshop

#### Scenario: Dates are omitted
- **WHEN** a client requests slots without informing a date interval
- **THEN** the system returns slots from the current date through the next 7 days by default

### Requirement: Slot generation uses service assignments, duration, and recurring availability
The system SHALL generate slots from active professional-service assignments, the requested service duration, and recurring weekly availability windows that match the requested bounded date interval.

#### Scenario: Slots are derived from a weekly window
- **WHEN** a client requests slots for a service whose duration fits within weekly availability windows inside the requested bounded date interval
- **THEN** the system returns slot start and end times derived from that window using the service duration

#### Scenario: Unassigned service is requested
- **WHEN** a client requests slots for a service that is not assigned to any active professional in the requested petshop
- **THEN** the system returns no reservable slots for that request

### Requirement: Public slot discovery limits forward booking horizon
The system SHALL allow public slot discovery only within a maximum horizon of 30 inclusive calendar days from the current date.

#### Scenario: Interval exceeds maximum horizon
- **WHEN** a client requests slots beyond 30 days from the current date
- **THEN** the system rejects the request

#### Scenario: Interval reaches the maximum allowed day
- **WHEN** a client requests slots through the 30th calendar day counted from the current date
- **THEN** the system accepts the request as within the allowed booking horizon

### Requirement: Public slot discovery excludes non-bookable records
The system SHALL exclude slots tied to inactive petshops, inactive professionals, inactive services, or time ranges already occupied by confirmed bookings.

#### Scenario: Inactive records are hidden from slots
- **WHEN** a petshop, professional, or service involved in a potential slot is inactive
- **THEN** the system excludes that slot from the public response

#### Scenario: Confirmed booking occupies a slot
- **WHEN** a confirmed booking overlaps a generated slot for the requested professional and date
- **THEN** the system excludes the overlapping slot from the public response
