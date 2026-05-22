## Purpose
Define public petshop rating summary requirements.

## Requirements
### Requirement: Public petshop rating summaries are derived from booking-backed feedback
The system SHALL aggregate public petshop rating summaries using the `PetshopRating` values from stored booking feedback records linked to completed bookings.

#### Scenario: Rated petshop summary is computed
- **WHEN** a listed petshop has one or more stored feedback records
- **THEN** the system computes that petshop's public rating summary using the stored petshop ratings from those feedback records

#### Scenario: Petshop has no feedback yet
- **WHEN** a listed petshop has no stored feedback records
- **THEN** the system treats that petshop as unrated rather than assigning an artificial score

### Requirement: Public rating summaries expose average rating and feedback count
The system SHALL expose a petshop-level public rating summary containing the average petshop rating and the total feedback count.

#### Scenario: Public rating summary is returned
- **WHEN** a public discovery response includes a rated petshop
- **THEN** the system returns that petshop's average rating together with its feedback count
