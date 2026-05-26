## ADDED Requirements

### Requirement: Tenant admin console exposes feedback operations
The system SHALL provide an authenticated tenant admin console section for viewing booking-backed feedback belonging only to the authenticated `Empresa`.

#### Scenario: Tenant opens the feedback section
- **WHEN** an authenticated tenant user opens the feedback section in the admin console
- **THEN** the system shows only feedback data that belongs to the authenticated `Empresa`

### Requirement: Feedback section provides petshop and professional summary signals
The system SHALL expose a tenant-facing feedback summary that includes the petshop reputation snapshot and professional-level rating breakdowns derived from stored booking feedback.

#### Scenario: Feedback summary is available
- **WHEN** an authenticated tenant user opens the feedback section for a petshop with stored feedback
- **THEN** the system shows the tenant-facing summary with the petshop average rating, petshop feedback count, and professional summary rows computed from the stored feedback linked to that `Empresa`

#### Scenario: Petshop has no feedback yet
- **WHEN** an authenticated tenant user opens the feedback section for a petshop without stored feedback
- **THEN** the system shows an explicit unrated or empty summary state instead of an artificial score

### Requirement: Feedback section lists booking-backed entries with operational context
The system SHALL expose a tenant-facing feedback list containing individual feedback entries with booking, professional, rating, comment, and submission timestamp context.

#### Scenario: Feedback entries are listed
- **WHEN** an authenticated tenant user requests the feedback list for the authenticated `Empresa`
- **THEN** the system returns feedback entries that include the related booking identifier, professional context, petshop rating, professional rating, optional comment, and submission timestamp

### Requirement: Feedback section supports operational filters and booking follow-up
The system SHALL allow authenticated tenant users to filter feedback entries by date range and professional, and SHALL preserve a path from each feedback entry back to the associated booking workflow.

#### Scenario: Feedback list is filtered
- **WHEN** an authenticated tenant user applies a date range or professional filter in the feedback section
- **THEN** the system shows only feedback entries matching those filters inside the authenticated tenant scope

#### Scenario: Tenant follows feedback back to the booking
- **WHEN** an authenticated tenant user selects a feedback entry from the feedback section
- **THEN** the system exposes the associated booking identifier so the operator can navigate back to the tenant booking detail flow

### Requirement: Feedback section handles empty and recoverable error states clearly
The system SHALL provide clear loading, empty, and recoverable error states for the tenant feedback section.

#### Scenario: No feedback matches the current filters
- **WHEN** an authenticated tenant user applies filters that return no feedback entries for the authenticated `Empresa`
- **THEN** the system shows a clear empty-state response in the feedback section

#### Scenario: Feedback section cannot be loaded
- **WHEN** the feedback section cannot load due to a recoverable failure
- **THEN** the system shows a tenant-facing error state with a retry path inside the admin console
