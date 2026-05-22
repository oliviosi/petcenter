## Why

The platform now collects booking-backed feedback, but public discovery still ignores those ratings even though the product journey says clients browse petshops by reputation. The next slice should turn completed feedback into public rating summaries so discovery can reflect real service quality instead of only basic catalog data.

## What Changes

- Add public petshop rating summaries derived from completed booking feedback, including average rating and total feedback count.
- Expose public rating summary data in both the public petshop catalog and the public petshop detail response.
- Allow public catalog filtering and ordering using petshop rating summary fields once feedback exists.
- Keep this slice focused on petshop-level aggregation and discovery usage, excluding professional-level rating summaries, moderation workflows, featured rankings, and recommendation logic.

## Capabilities

### New Capabilities
- `public-rating-summaries`: Aggregate booking-backed feedback into public petshop rating summaries for discovery and public detail views.

### Modified Capabilities
- `public-petshop-search`: Extend public catalog browsing so clients can filter or sort listed petshops using public rating summary data.
- `public-petshop-profile`: Extend public petshop profile responses so listed petshops expose their public rating summary alongside existing catalog and detail data.

## Impact

- Affected code: `apps/backend` booking feedback reads, public petshop query models, aggregation logic, and public discovery endpoints.
- APIs: extends public catalog and public petshop detail contracts with rating summary fields and discovery controls based on those summaries.
- Dependencies: reuses the existing booking feedback data model without introducing customer accounts or external analytics infrastructure.
- Systems: closes the loop between post-service feedback and public discovery so reputation becomes visible in the marketplace experience.
