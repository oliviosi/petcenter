## Context

The platform now accepts public booking requests, resolves them asynchronously through queue events, and supports tenant-side operational outcomes such as completion, cancellation, and no-show. The missing piece is on the client side: after a booking is created, the client still has no public way to know whether the request is still pending, confirmed, rejected, cancelled, completed, or ended as no-show.

This change must preserve the current constraints of the booking architecture: the queue contract is frozen, there is no customer-account system, and public visibility into a booking cannot rely on tenant authentication. The design also needs to avoid leaking operational data broadly, since a booking status endpoint will expose information about a specific appointment to unauthenticated callers.

## Goals / Non-Goals

**Goals:**
- Add a secure public lookup flow for the current lifecycle status of a booking.
- Introduce a public status access token that authorizes booking status checks without tenant authentication.
- Return the current booking state together with limited public outcome details that are safe and useful for the client.
- Extend booking creation so the client receives the status access mechanism at the moment the booking is requested.
- Preserve the existing queue contract and asynchronous booking model.

**Non-Goals:**
- Customer account registration, login, or account-based booking history.
- Push notifications, webhooks, email delivery, or realtime subscriptions.
- Editing, cancelling, or rescheduling bookings from the public status flow.
- Public exposure of internal tenant-only operational notes beyond the outcome details already needed by the client.
- Reuse of feedback eligibility rules as a substitute for status authorization.

## Decisions

### 1. Add a dedicated status access token instead of reusing the feedback token

Booking status needs to be visible immediately after request creation and throughout the full lifecycle, while the feedback token is specifically intended for post-service feedback eligibility. The system should therefore issue a separate opaque status access token during booking creation and store only its protected representation.

This keeps authorization purposes clean and avoids overloading one token with multiple unrelated lifecycles.

**Alternatives considered:**
- Reuse the feedback token for status lookups: rejected because it couples two different public capabilities and gives a post-service token a broader surface than necessary.
- Expose booking status by booking id alone: rejected because it leaks appointment information too easily.

### 2. Expose status through a public `/bookings/{id}/status` endpoint

The public client should query booking status using the booking identifier plus a status access token in the request body. A dedicated status endpoint keeps the resource model explicit and lets the API return a constrained public view instead of tenant operational detail.

**Alternatives considered:**
- Add status fields to existing booking creation only and rely on polling the same response: rejected because booking creation is a write contract, not a read surface.
- Expose status under a separate `/public/bookings` namespace: rejected because the repository already distinguishes visibility primarily through authorization and payload rules, not duplicated route trees.

### 3. Keep the public status payload narrow and state-driven

The status response should return:
- booking id
- current state
- requested/confirmed/completed/cancelled/no-show timestamps when applicable
- rejection details when state is `rejected`
- slot summary and basic petshop/professional/service identifiers if already public in the creation contract

It should not expose tenant-only operational detail unrelated to the client’s own appointment outcome.

**Alternatives considered:**
- Return the full tenant booking detail response: rejected because it exposes unnecessary operational data.
- Return only the state string: rejected because clients still need enough context to explain outcomes and render the booking timeline.

### 4. Status token validation should mirror the public-token pattern already used for feedback

The system should generate an opaque random token, return the raw token once at booking creation, store only a protected hash, and validate later requests by booking id plus token. This follows an established pattern in the codebase and avoids introducing a new security model for public booking capabilities.

**Alternatives considered:**
- Sign a JWT-like public token: rejected because it adds complexity and verification concerns without a strong need in this slice.
- Use owner contact plus booking id as proof: rejected because it is weaker and easier to guess or replay.

### 5. Public status should reflect the persisted booking lifecycle exactly, including later tenant outcomes

The status endpoint should surface the real persisted state of the booking, including `requested`, `confirmed`, `rejected`, `cancelled`, `completed`, and `no-show`. This ensures that the client sees the current truth of the appointment as tenant and queue workflows progress.

**Alternatives considered:**
- Collapse terminal outcomes into simplified buckets like “accepted” vs “not accepted”: rejected because it hides meaningful client outcomes such as cancellation or no-show.
- Limit status visibility to pre-service states only: rejected because the client may need to confirm the final appointment outcome later as well.

## Risks / Trade-offs

- **[Risk] A leaked status token would expose one booking’s lifecycle information** -> Mitigation: keep the token opaque, store only a protected representation, and scope lookup strictly to one booking id plus token pair.
- **[Risk] Returning too much detail could leak tenant operational data** -> Mitigation: define a narrow public status read model instead of reusing tenant booking detail responses.
- **[Risk] Managing both feedback and status tokens increases persistence complexity** -> Mitigation: keep the implementation explicit and separate so each token has one responsibility.
- **[Trade-off] Clients must preserve another token after booking creation** -> Mitigation: accept the extra token burden now in exchange for avoiding customer-account scope and preserving a secure public flow.

## Migration Plan

1. Extend booking persistence with protected status-token storage.
2. Extend booking creation contracts to issue the raw status token together with the booking identifier.
3. Add a public booking status validation and lookup endpoint using booking id plus status token.
4. Map persisted booking lifecycle states into a narrow public status response model.
5. Verify public status lookup behavior across pending, confirmed, rejected, cancelled, completed, and no-show outcomes.

Rollback can remove the status token storage and public lookup endpoint while preserving booking creation, tenant operations, and feedback capabilities.

## Open Questions

- None for this slice; notifications and account-based retrieval are intentionally deferred.
