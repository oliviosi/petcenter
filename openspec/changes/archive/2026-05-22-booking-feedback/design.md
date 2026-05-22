## Context

The platform now supports booking intake, asynchronous confirmation, and tenant-side completion with a final charged price. The product journey, however, still ends at service completion even though the documented flow says the client may optionally rate the professional and the petshop afterward.

This change has to solve two problems at once: feedback must be backed by a real completed booking, and the product still does not have customer accounts. That means the design must provide a secure enough proof of feedback eligibility without introducing a full end-user authentication system or weakening the integrity of ratings.

## Goals / Non-Goals

**Goals:**
- Allow clients to submit one feedback record for a completed booking.
- Capture separate ratings for the professional and the petshop, plus an optional comment.
- Ensure feedback eligibility is tied to a real completed booking and cannot be reused indefinitely.
- Provide a public eligibility check that lets the client know whether feedback can still be submitted.
- Keep the feedback model ready for later public rating summaries without introducing them now.

**Non-Goals:**
- Customer account registration or login.
- Editing, deleting, or moderating feedback.
- Public rating aggregation, ranking, or sorting changes in discovery.
- Favorites, recommendations, or social features.
- Tenant-side reply workflows or dispute handling.

## Decisions

### 1. Anchor feedback to bookings, not to petshops or professionals directly

The system should create one feedback record per completed booking rather than allowing loose ratings against a petshop or professional. This guarantees that every rating is linked to a real completed service and preserves a clean audit trail back to the booking.

**Alternatives considered:**
- Let clients rate a petshop directly without a booking: rejected because it weakens trust and allows unaudited reviews.
- Store separate unrelated records for professional and petshop ratings: rejected because one completed appointment should yield one cohesive feedback submission.

### 2. Use an opaque feedback access token instead of customer authentication

Because there is no customer account system, the booking flow should issue a feedback access token during booking creation and store only a protected representation of that token in persistence. The raw token is returned to the booking client and later used to prove feedback eligibility and authorize one feedback submission.

This keeps the flow public, avoids adding account infrastructure, and still provides stronger proof than relying on owner contact fields or booking identifiers alone.

**Alternatives considered:**
- Require full customer authentication before feedback: rejected because it pulls an entire account system into a narrow slice.
- Use booking id plus owner contact as proof: rejected because it is too easy to guess or replay.

### 3. Make feedback eligibility depend on `completed` plus token validity plus unused state

The system should treat a booking as feedback-eligible only when all of these conditions are true:
- the booking is in `completed`
- the feedback token matches
- no feedback has already been submitted for that booking

This keeps feedback tightly coupled to the operational lifecycle and prevents duplicate reviews.

**Alternatives considered:**
- Allow feedback as soon as a booking is `confirmed`: rejected because ratings should reflect delivered service, not reserved service.
- Allow multiple feedback entries per booking: rejected because it complicates trust and aggregation semantics.

### 4. Add a lightweight eligibility endpoint before submission

The public client should be able to check whether feedback can still be submitted for a booking using booking id plus feedback token. This supports a cleaner UX by letting the client know whether the booking is completed, already rated, or invalid before showing the submission flow.

**Alternatives considered:**
- Skip eligibility checks and only validate on submit: rejected because the UI would have to infer too much from submission failures.
- Expose booking state publicly without token proof: rejected because it leaks operational information.

### 5. Keep feedback output narrow and defer public rating summaries

The first slice should only handle eligibility and submission. Public averages, counts, and display in discovery should be a later change once review volume, aggregation rules, and moderation expectations are better understood.

**Alternatives considered:**
- Add public averages immediately: rejected because it expands scope into read aggregation and public ranking concerns.
- Let feedback submission also update discovery sorting rules now: rejected because that couples write and discovery behavior too early.

## Risks / Trade-offs

- **[Risk] A leaked feedback token could allow an unauthorized submission** -> Mitigation: store only a protected token representation, validate it against a single booking, and allow only one successful submission.
- **[Risk] Clients may lose the token before the booking is completed** -> Mitigation: keep the first slice narrow and accept that better retrieval/recovery UX can come later with customer accounts or notification flows.
- **[Risk] One optional comment shared across petshop and professional may feel coarse** -> Mitigation: keep structured ratings separate and defer richer review text modeling until real usage emerges.
- **[Trade-off] No edit/delete flow means mistaken submissions remain fixed** -> Mitigation: prioritize one trustworthy write path now and defer moderation/changes to a later change.

## Migration Plan

1. Extend booking persistence with feedback token storage and feedback-submitted state.
2. Add a feedback entity and mappings tied one-to-one with booking records.
3. Add the public eligibility endpoint and public submission endpoint using booking id plus token proof.
4. Verify that only completed bookings can be rated and that each booking accepts only one feedback submission.

Rollback can remove the feedback entity, token storage, and feedback endpoints while preserving the booking lifecycle already in place.

## Open Questions

- None for the first slice; public rating summaries and moderation are intentionally deferred.
