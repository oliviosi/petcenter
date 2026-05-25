## Why

The public booking journey is already specified and largely supported by backend APIs, but the repository still lacks a web application shell that turns catalog discovery, petshop detail, slot selection, booking submission, and booking status follow-up into a usable end-to-end experience. Now that queue-backed booking resolution exists, the highest-value next step is exposing that journey in a real public interface.

## What Changes

- Add a public web shell for the unauthenticated booking journey, from petshop discovery through booking submission and status follow-up.
- Define the user-facing page flow, state transitions, and loading/error handling for catalog search, petshop detail, slot discovery, booking submission, and public booking status.
- Define how the web shell consumes the existing backend APIs and handles asynchronous booking resolution without exposing internal queue details.
- Establish the frontend surface and routing needed for the first public booking slice in the monorepo.

## Capabilities

### New Capabilities
- `public-booking-web-shell`: Public web experience that orchestrates the existing catalog, detail, slot, booking, and status capabilities into a coherent browser flow for unauthenticated clients.

### Modified Capabilities
- `public-booking-status`: Clarify the client-facing status presentation requirements needed for the public web shell while preserving the existing booking-token status lookup contract.

## Impact

- Affects the frontend application surface in the monorepo, including public routing, data fetching, and UI state management.
- Depends on existing public backend APIs for petshop catalog, petshop detail, slots, booking creation, and booking status lookup.
- Establishes the first demonstrable browser-based public booking journey for the product.
