## Context

The repository already has the backend contracts for feedback eligibility and feedback submission, plus a public web shell that reaches the booking status page and preserves booking context in the browser. The missing piece is the user-facing experience that lets a client move from a completed booking into the feedback flow, validate eligibility with the feedback token, submit ratings, and understand the outcome in browser terms.

This is a cross-cutting frontend-focused change because it extends the public shell journey, introduces a new post-status route, and must safely reuse booking-backed feedback tokens without introducing accounts or tenant authentication. It also needs to connect feedback submission back to the product loop that drives public rating summaries in discovery.

## Goals / Non-Goals

**Goals:**
- Extend the public shell so eligible completed bookings can enter a feedback flow from the status experience.
- Reuse the feedback access token already issued at booking creation time and preserved in browser session context.
- Validate eligibility before showing the rating form and present clear client-facing states for eligible, ineligible, invalid-token, already-submitted, submission-success, and recoverable failures.
- Submit professional and petshop ratings plus optional comment through the existing public feedback API.
- Keep the journey fully unauthenticated and aligned with the existing booking status/token model.

**Non-Goals:**
- Changing feedback eligibility or feedback submission backend contracts.
- Adding authenticated customer accounts, user profiles, or favorites.
- Redesigning rating aggregation logic or public rating summaries.
- Building broader CRM or review moderation workflows.

## Decisions

### 1. Add a dedicated public feedback route under the booking journey
The public shell will extend the route map with `/bookings/[bookingId]/feedback` as the single place where feedback eligibility is checked and, when allowed, the form is shown.

**Why this approach**
- Keeps feedback clearly attached to the booking lifecycle rather than to generic petshop pages.
- Reuses the existing browser session keyed by booking identifier.
- Makes success, ineligible, and already-submitted states share one stable public URL.

**Alternatives considered**
- Inline modal on the status page: rejected because eligibility, submission, and success states become harder to recover or revisit.
- Route feedback from the petshop detail page: rejected because eligibility is booking-backed, not petshop-backed.

### 2. Reuse browser-stored booking session data to persist the feedback token
The same booking session record that already stores the status token and contextual summary will be extended to persist the feedback access token needed for eligibility checks and feedback submission.

**Why this approach**
- Keeps token handling consistent inside the existing public shell.
- Avoids inventing a second client-side storage mechanism just for feedback.
- Makes the flow resilient when a client returns later in the same browser.

**Alternatives considered**
- Put the feedback token in the feedback route URL: rejected because token leakage through URLs is undesirable.
- Require the user to manually input a code: rejected because the backend already issues a usable token and the browser can preserve it.

### 3. Gate the rating form behind explicit eligibility lookup
The feedback route will first call the eligibility endpoint and only show the rating form when the booking is truly eligible. Ineligible or invalid-token results will render explicit client-facing states instead of a broken or partially interactive form.

**Why this approach**
- Mirrors the backend capability split between eligibility and submission.
- Prevents misleading the user with a form they cannot actually submit.
- Makes already-submitted and not-yet-completed cases understandable in product terms.

**Alternatives considered**
- Skip eligibility and rely only on submit-time failure: rejected because it creates poorer UX and less predictable state handling.

### 4. Keep the entry point anchored in the public status experience
Completed bookings that remain feedback-eligible will expose a clear call-to-action from the status page into the feedback route, rather than hiding feedback behind petshop browsing or generic follow-up UI.

**Why this approach**
- The status page is already the user’s stable return point for post-booking information.
- It naturally expresses “you can rate this now” only when the lifecycle state makes sense.
- It minimizes discovery friction for the feedback flow.

**Alternatives considered**
- Auto-redirect from completed status to feedback: rejected because not every completed booking should forcibly move the user into rating.
- Add feedback CTA everywhere in the app: rejected because eligibility is booking-specific.

### 5. Treat submission success as a terminal public state
After successful feedback submission, the client should see an explicit success state that confirms the review was saved and prevents repeat submission from looking available in the same browser session.

**Why this approach**
- Aligns with the backend rule that only one feedback record can exist per booking.
- Gives the client closure instead of dropping them back into a generic status page.
- Reduces confusion around duplicate submissions.

**Alternatives considered**
- Return immediately to the status page without feedback confirmation: rejected because the client loses clear confirmation of what happened.

## Risks / Trade-offs

- **[Browser-stored feedback token is local to one device]** -> A client may not see the feedback flow on another browser/device. Mitigation: keep the UX explicit about same-browser continuity, consistent with the existing status-token model.
- **[Eligibility and lifecycle can drift over time]** -> A booking may become ineligible between viewing status and opening feedback. Mitigation: always perform real eligibility lookup on the feedback route.
- **[Completed does not always mean eligible]** -> The frontend must avoid implying that every completed booking can still be rated. Mitigation: gate the CTA and form with eligibility-aware states rather than status alone.
- **[A new post-status route can expand shell complexity]** -> The journey becomes longer. Mitigation: keep the first slice narrow and booking-scoped, with no unrelated review features.

## Migration Plan

1. Extend the public shell session model to preserve the feedback token alongside existing booking context.
2. Add the booking feedback route and integrate eligibility and submission calls against the existing backend endpoints.
3. Update the booking status experience to surface the feedback entry point only when appropriate.
4. Validate success, ineligible, invalid-token, and already-submitted flows in the frontend.
5. Deploy without backend contract changes; rollback would simply remove the frontend route and CTA while leaving existing APIs intact.

## Open Questions

- Should the status page proactively check feedback eligibility for completed bookings before rendering the CTA, or can the first slice always show the CTA on completed status and let the feedback route resolve eligibility?
- Should successful feedback submission return the user to the status page with a confirmation banner, or remain on a dedicated success state inside the feedback route?
- Do we want the first slice to expose any link from feedback success back into the petshop catalog or public detail page?