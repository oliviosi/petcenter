## 1. Rating summary aggregation

- [x] 1.1 Add public read-side aggregation that computes petshop rating average and feedback count from stored booking feedback using `PetshopRating`.
- [x] 1.2 Ensure unrated petshops remain discoverable while keeping their rating summary explicitly absent rather than defaulting to zero.

## 2. Public discovery contracts

- [x] 2.1 Extend public petshop catalog responses to include petshop rating summary fields when available.
- [x] 2.2 Extend public petshop detail responses to include petshop rating summary fields when available.
- [x] 2.3 Add public catalog filtering and ordering behavior based on rating summaries, including explicit handling for unrated petshops.

## 3. Verification

- [x] 3.1 Add or update automated tests covering rating aggregation, unrated petshop behavior, public catalog filtering/ordering by rating, and public detail responses with rating summaries.
- [x] 3.2 Verify backend build, tests, and public discovery endpoint contracts after rating summaries are wired end to end.
