## Purpose
Define premium frontend foundation requirements covering brand palette, typography, reusable surfaces, and preservation of the current public booking flows in this slice.

## Requirements
### Requirement: Frontend foundation exposes a premium shared visual system
The system SHALL provide a shared frontend visual foundation that feels premium, clean, and recognisable across public and admin experiences instead of relying on a generic default product aesthetic.

#### Scenario: Shared foundation is applied
- **WHEN** a user navigates between representative public and admin screens
- **THEN** the system presents a consistent visual language for color, typography, spacing, surfaces, and interactive states

### Requirement: Frontend foundation uses the approved brand palette and warm neutral surfaces
The system SHALL center the frontend brand palette on a yellow primary color derived from `#F6BE04`, a purple accent near `#690E88`, and warm neutral surfaces including a `#F8F8F8` page background and white cards.

#### Scenario: Brand palette is rendered
- **WHEN** a representative screen renders primary actions, accent cues, page backgrounds, and card surfaces
- **THEN** the system uses the approved premium palette instead of the previous blue-centered foundation

### Requirement: Frontend foundation uses premium typography roles
The system SHALL use a typography system based on Inter for UI/body content and Poppins for headings and stronger branded emphasis.

#### Scenario: Typography hierarchy is visible
- **WHEN** a user reads page headings, card headings, body text, and form/filter content
- **THEN** the system presents a clear premium hierarchy built from the approved font pairing

### Requirement: Frontend foundation standardises rounded, clean reusable surfaces
The system SHALL apply a cleaner premium treatment to shared primitives such as cards, buttons, filters, forms, tables or lists, and shell surfaces through more generous rounding, restrained shadows, and clearer spacing.

#### Scenario: Reusable UI primitives are rendered
- **WHEN** shared UI primitives are rendered in representative public and admin flows
- **THEN** the system shows rounded, clean, and visually coherent surfaces that feel more polished than the prior baseline

### Requirement: Foundation refresh preserves current flows while preparing future public-model changes
The system SHALL refresh the frontend visual foundation without changing the current public booking flow structure in this slice.

#### Scenario: Existing journey remains intact during the refresh
- **WHEN** a user navigates through the current public booking or admin experience after the foundation refresh
- **THEN** the system preserves the existing route structure and capabilities while presenting the new premium visual foundation
