## 1. Public shell entry and routing

- [x] 1.1 Update the primary public shell entry so the default unauthenticated journey starts from a single petshop storefront instead of emphasizing catalog-first discovery.
- [x] 1.2 Rework homepage behavior and route priorities in the public frontend so `/` no longer presents multi-petshop discovery as the main product experience.

## 2. Storefront-first public journey

- [x] 2.1 Refine the petshop storefront experience at the slug-based public detail layer so it becomes the main entry point into booking for one specific petshop.
- [x] 2.2 Preserve and adapt the transition from storefront to booking, booking status, and booking-backed feedback follow-up without changing the existing public booking contracts.

## 3. Secondary catalog behavior

- [x] 3.1 Demote the public catalog UX and copy so it operates as a secondary or optional discovery surface rather than the primary booking shell.
- [x] 3.2 Ensure tenant-maintained public storefront profile data continues to support both direct storefront access and any remaining secondary catalog use.

## 4. Validation and documentation

- [x] 4.1 Add or update frontend tests for the new public shell entry, storefront-first navigation, and any changed homepage or catalog behavior.
- [x] 4.2 Update frontend documentation to describe the single-petshop public shell model and how the public journey now starts from a petshop-specific storefront.
