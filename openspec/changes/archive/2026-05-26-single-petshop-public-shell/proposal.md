## Why

The public product model is still centered on marketplace-style discovery, but the desired commercial direction is a one-link-per-petshop experience where each contracted client sees only a single storefront and booking journey. Moving now keeps the newly refreshed frontend foundation aligned with the real product direction instead of continuing to invest in a catalog-first public shell.

## What Changes

- Introduce a single-petshop public shell capability where the public journey starts from one petshop-specific entry point instead of a multi-petshop catalog.
- Reframe the public browser journey so petshop storefront, booking, booking status, and feedback follow-up remain stable, but catalog discovery is no longer the primary unauthenticated funnel.
- Update the public web shell requirements to treat a petshop-specific storefront as the main entry into booking.
- Update public search requirements so catalog browsing becomes optional or secondary infrastructure instead of the core public shell.
- Update public petshop profile requirements so the tenant-maintained storefront supports a direct-access public experience for a specific petshop link.

## Capabilities

### New Capabilities
- `single-petshop-public-shell`: Direct public storefront journey for one petshop-specific link, including storefront entry, transition into booking, and continuity into booking status and feedback follow-up.

### Modified Capabilities
- `public-booking-web-shell`: Change the primary public journey from catalog-led discovery to a petshop-specific storefront-led flow.
- `public-petshop-search`: Reduce the catalog from the primary public funnel to a secondary or optional discovery surface.
- `public-petshop-profile`: Expand storefront expectations so tenant-maintained public profile data supports direct single-petshop public access.

## Impact

- Affects the public frontend shell in `apps/frontend/src/app/(public)` and related shared public components.
- Likely changes route priorities, copy, navigation, and page responsibilities across `/`, `/petshops`, `/petshops/[slug]`, and `/petshops/[slug]/book`.
- Reuses existing public booking, slot discovery, booking status, and feedback flows rather than changing backend booking contracts.
