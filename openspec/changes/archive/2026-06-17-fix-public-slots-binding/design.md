# Design: public slots binding fix

## Problem

Minimal API model binding treats GetPublicSlotsRequest (declared with [AsParameters]) as a set of scalar parameters to bind from query/route. Because the request has a non-nullable Guid PetshopId property and the route parameter is named `id`, the binder doesn't find a matching `PetshopId` query/route value and throws a BadHttpRequestException before the handler runs.

## Proposed fix

- Change GetPublicSlotsRequest.PetshopId from Guid to Guid? (nullable).
- Keep the handler signature as-is (Guid id, [AsParameters] GetPublicSlotsRequest request, ...).
- Immediately inside the handler assign request.PetshopId = id (already present in code).
- Let FluentValidation keep RuleFor(x => x.PetshopId).NotEmpty() — validation will still run and fail if assignment wasn't done for some reason.

Rationale: minimal, low-risk change that avoids the binder throwing on missing query param while keeping existing validation semantics and handler logic.

Alternatives considered:
- Rename route parameter `id` to `petshopId` to match request property — viable but more invasive (route URL change may affect some clients and tests).
- Add binding attributes to map request property from route — less portable in Minimal APIs and more verbose.

## Rollback

Revert the Request.cs change; no DB or data migration required.
