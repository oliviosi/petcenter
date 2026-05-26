## Context

The frontend already has a functioning token system, shared UI primitives, and both public and admin shells, but the current direction still leans toward a generic product UI: bright blue brand color, neutral default typography, repeated card/button compositions, and limited editorial hierarchy. The user wants a premium, cleaner, less generic visual language built around a warm yellow primary brand, a purple accent, softer warm neutrals, Inter + Poppins typography, more generous rounding, and a `#F8F8F8` page background instead of a stark white canvas.

This change is intentionally scoped to frontend foundations only. It should improve the visual system and the most visible shell-level and reusable UI surfaces now, while leaving the current marketplace-style product structure intact until a later product-model change addresses the single-petshop white-label journey.

## Goals / Non-Goals

**Goals:**
- Establish a premium visual foundation that feels less generic and more recognisable.
- Replace the blue-centered palette with a yellow-led brand system derived from `#F6BE04`, supported by a purple accent near `#690E88` and warm neutrals.
- Adopt an Inter + Poppins typography direction that keeps body text highly readable while giving headings more personality.
- Increase the perceived quality of cards, buttons, filters, forms, shells, and dashboard surfaces through cleaner spacing, more intentional radius, and softer shadows.
- Apply the new foundation consistently across public and admin shells plus representative high-traffic screens.

**Non-Goals:**
- Changing the current public information architecture from multi-petshop discovery to single-petshop white-label access.
- Rewriting every page in the product during the same slice.
- Introducing illustration systems, heavy animation, or marketing-site complexity.
- Changing backend contracts or operational flows.

## Decisions

### 1. Use yellow as the primary brand and purple as a restrained accent
The system will pivot from blue to a warm yellow primary brand centered on `#F6BE04`, with a darker hover/stronger variant derived from that hue and a purple accent near `#690E88` used selectively for emphasis and premium contrast.

**Why this approach**
- The yellow breaks away from the default “software blue” look that often makes interfaces feel generic.
- A restrained purple accent adds sophistication and contrast without fighting the primary brand.
- The pairing supports both public-facing warmth and admin-facing clarity when balanced by strong neutrals.

**Alternatives considered**
- Keep blue and only refine the current palette: rejected because it would not solve the “cara de IA / produto genérico” concern strongly enough.
- Use yellow alone without an accent: rejected because it risks feeling flat or overly promotional.

### 2. Keep `#F8F8F8` for the page background and reserve white for surfaces
The page canvas will move to a soft light neutral (`#F8F8F8`) while cards, panels, and interactive surfaces remain white.

**Why this approach**
- It softens the product immediately and reduces the “blank dashboard” feeling.
- White cards on a light gray background create clearer surface hierarchy with less reliance on heavy shadows.
- This supports a cleaner premium direction without sacrificing readability.

**Alternatives considered**
- Use pure white throughout: rejected because it contributes to the current flat/generic feeling.
- Use a darker editorial canvas: rejected for now because the product still relies heavily on operational readability.

### 3. Use Inter for UI/body and Poppins for headings and stronger display moments
The foundation will adopt a dual-font system: Inter for dense UI and body content, Poppins for headings, shell branding, and selected emphasis moments.

**Why this approach**
- Inter keeps forms, filters, tables, and dashboards readable.
- Poppins adds a more branded, less default tone without sacrificing approachability.
- The combination aligns with the user’s preferred typography family direction.

**Alternatives considered**
- Inter only: rejected because it stays too close to the current product tone.
- Ubuntu as the main UI font: rejected for the first slice because it pushes the interface slightly more technical/system-like than desired.

### 4. Refresh shared primitives before page-by-page refinement
The implementation should start with global tokens and shared primitives (`globals.css`, buttons, cards, badges, wrappers, shells), then apply those improvements to representative public and admin pages.

**Why this approach**
- It gives the largest visual payoff with the least duplication.
- Later pages inherit the new direction more cheaply.
- It avoids rewriting each page in isolation and creating local exceptions.

**Alternatives considered**
- Restyle each page individually first: rejected because it leads to inconsistency and repeated work.

### 5. Emphasize premium cleanliness through spacing, rounding, and restraint
Cards, buttons, filters, tables/lists, and form surfaces should become more rounded and polished, but with restrained shadows, lighter borders, and stronger editorial hierarchy instead of decorative excess.

**Why this approach**
- Premium interfaces often feel calmer, not busier.
- The current UI already has a component structure that can support a cleaner result through token and composition changes rather than visual noise.
- This directly addresses the desire for a more “clean” design.

**Alternatives considered**
- Add more gradients, ornaments, or large visual flourishes: rejected because they can quickly cheapen the interface or age badly.

## Risks / Trade-offs

- **[Yellow can overpower the UI]** → If overused, the interface may feel promotional instead of premium. **Mitigation:** keep yellow focused on primary actions and brand cues, while relying on warm neutrals and white surfaces for most of the layout.
- **[Dual-font system can become inconsistent]** → Too many font-role exceptions can dilute the refresh. **Mitigation:** constrain Poppins to headings and branded emphasis while keeping Inter for most UI/body text.
- **[Foundation-only work may expose product-model tension]** → The UI may look more premium while still reflecting the current marketplace flow. **Mitigation:** explicitly keep structural public-journey changes out of scope and use this refresh to prepare for the later single-petshop change.
- **[Broad frontend surface area]** → This can sprawl into an endless redesign. **Mitigation:** prioritize tokens, shells, primitives, and representative high-traffic pages instead of every route at once.

## Migration Plan

1. Update the global visual tokens in `globals.css` for color, typography, radii, shadows, and surface hierarchy.
2. Refactor shared UI primitives and layout shells to consume the new foundation consistently.
3. Apply the refreshed foundation to representative public and admin pages so the new direction is visible in the product immediately.
4. Update tests and documentation to reflect the new shared foundation.
5. Rollback would restore the previous tokens and primitive styles without affecting backend behavior.

## Open Questions

- None for this slice. The user already supplied the visual direction strongly enough to define the first premium foundation refresh.
