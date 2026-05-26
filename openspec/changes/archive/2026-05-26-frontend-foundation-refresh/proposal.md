## Why

The frontend has become functionally solid, but its current visual direction still feels generic and too close to default product UI patterns. Refreshing the visual foundation now will make future features land on a more premium, recognisable system instead of forcing later retrofits across an even larger surface area.

## What Changes

- Establish a premium frontend foundation centered on a warm yellow primary brand (`#F6BE04`), a near-purple accent (`#690E88` or close variation), and warm neutral surfaces including a `#F8F8F8` page background.
- Update the shared design tokens, typography stack, spacing, radii, shadows, and reusable primitives so the product feels less generic and more editorial, clean, and high-end.
- Apply the refreshed foundation to the public and admin shells plus representative high-traffic screens, ensuring cards, buttons, filters, forms, and dashboard surfaces adopt the new system consistently.
- Preserve the current product structure and flows in this change; the visual foundation refresh should prepare the frontend for later product-model changes without coupling them into the same slice.

## Capabilities

### New Capabilities
- `frontend-foundation-refresh`: Shared premium visual foundation for the frontend covering brand tokens, typography, shell styling, and reusable UI surface patterns.

### Modified Capabilities

## Impact

- Affects `apps/frontend` broadly through shared tokens in `src/app/globals.css`, layout shells, and reusable UI primitives such as buttons, cards, badges, filters, and page wrappers.
- Does not require backend API or contract changes.
- Creates the visual base that later public-experience changes, including a future single-petshop white-label journey, can build upon with less rework.
