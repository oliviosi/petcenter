## Context

The platform now supports public booking status tracking and collects booking-backed feedback after completed appointments, but public discovery still exposes only basic catalog and profile information. This creates a mismatch with the product journey, which expects clients to browse petshops using reputation signals such as ratings.

This change should use the feedback data already captured in the booking module without introducing moderation infrastructure, customer accounts, or a separate analytics pipeline. It also needs to keep public discovery safe and predictable: rating summaries should reflect only trustworthy booking-backed feedback, and unrated petshops must still remain discoverable.

## Goals / Non-Goals

**Goals:**
- Aggregate petshop-level public rating summaries from stored booking feedback.
- Expose rating average and total feedback count in public catalog and public petshop detail responses.
- Allow public catalog filtering and ordering using petshop rating summary data.
- Reuse existing booking-backed feedback as the only rating source.

**Non-Goals:**
- Professional-level public rating summaries.
- Moderation, hiding, editing, or deleting feedback.
- Recommendation, featured placement, or sponsored ranking logic.
- Free-form public review display or comment excerpts.
- Recomputing historical ratings outside the existing feedback records.

## Decisions

### 1. Aggregate public reputation at the petshop level using `PetshopRating`

The first public summary slice should use only the `PetshopRating` already captured in booking feedback. This creates one clear marketplace reputation signal for discovery without mixing petshop and professional quality into the same score.

**Alternatives considered:**
- Blend petshop and professional ratings into one public score: rejected because it obscures what is being measured.
- Start with professional summaries too: rejected because it expands discovery complexity and payload shape too early.

### 2. Expose only average rating and feedback count in public read models

Public catalog and detail responses should return a narrow summary:
- `averageRating`
- `feedbackCount`

This keeps discovery payloads simple and useful while avoiding a premature public review system.

**Alternatives considered:**
- Expose full feedback comments publicly: rejected because that introduces moderation and presentation concerns.
- Expose percentile/ranking metadata: rejected because it adds product semantics that are not yet defined.

### 3. Keep unrated petshops visible, but treat them distinctly in filters and ordering

Petshops without submitted feedback should still appear in public discovery. When a rating filter is applied, unrated petshops should be excluded because they do not satisfy a minimum rating threshold. When sorted by rating, unrated petshops should appear after rated petshops.

**Alternatives considered:**
- Hide unrated petshops entirely until they receive feedback: rejected because it punishes new tenants and weakens catalog coverage.
- Treat unrated petshops as zero rating: rejected because “no data” is different from “poor rating.”

### 4. Compute summaries from persisted feedback at query time for the first slice

The first implementation should derive public rating summaries directly from stored booking feedback rather than introducing a separate denormalized aggregate store. The current scale is small enough for query-time aggregation in this slice.

**Alternatives considered:**
- Add a dedicated rating-summary table now: rejected because it adds write-path complexity before actual scale pressure is known.
- Precompute summaries asynchronously: rejected because there is no evidence yet that query-time reads are insufficient.

### 5. Extend existing public discovery capabilities instead of introducing parallel endpoints

Catalog and profile endpoints already define public discovery. Rating summaries should be integrated into those existing responses and filters rather than creating separate rating-specific endpoints.

**Alternatives considered:**
- Create standalone `/ratings` endpoints: rejected because discovery already has a natural read surface.
- Add rating summary only to detail pages: rejected because catalog filtering and comparison are core reasons to expose reputation publicly.

## Risks / Trade-offs

- **[Risk] Query-time aggregation may become expensive as feedback volume grows** -> Mitigation: keep the first slice simple and revisit denormalized summaries only if discovery performance becomes a real issue.
- **[Risk] Low feedback volume can make averages feel noisy** -> Mitigation: always pair average rating with feedback count so clients can interpret confidence.
- **[Risk] Public discovery semantics may become inconsistent if unrated petshops are handled poorly** -> Mitigation: define explicit behavior for filters and sort order now.
- **[Trade-off] Petshop-only summaries delay professional reputation visibility** -> Mitigation: prioritize the strongest marketplace signal first and leave professional summaries for a later change.

## Migration Plan

1. Add feedback aggregation reads for public petshop reputation using persisted booking feedback.
2. Extend public catalog and public petshop detail responses with `averageRating` and `feedbackCount`.
3. Add public catalog filter and ordering rules based on rating summaries.
4. Verify public discovery behavior for rated and unrated petshops.

Rollback can remove the rating summary fields and query logic while preserving feedback capture and all existing public discovery behavior.

## Open Questions

- None for the first slice; public review text, moderation, and professional summaries are intentionally deferred.
