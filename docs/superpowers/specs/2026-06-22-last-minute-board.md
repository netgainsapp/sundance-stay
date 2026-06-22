# Spec: Last-Minute Lodging Board (two sided marketplace)

Status: DRAFT for approval. 2026-06-22.

## Summary

Turn the Last-Minute page from a manual matchmaker (lead forms we connect by
hand) into a self serve two sided board for the Festival Season window.

- Either side posts for free. A traveler posts a lodging need, or a host posts
  short notice availability.
- Posts are browsable on a public board.
- The side that wants to start a conversation pays a flat fee to unlock
  messaging with that party.
- The two parties then communicate through in app messaging.
- We never take a cut of the stay. The flat fee is a match and access fee only.

This is a real platform feature. It introduces three systems the site does not
have today: public user accounts, in app messaging, and payments.

## Decisions (assumed defaults, confirm or change)

1. Auth: passwordless email magic link, sent via Resend. Lowest friction, no
   passwords to store, reuses existing email infra.
2. Fee model: pay per conversation. One flat fee opens a thread with one
   specific party. Constant `LODGING_MATCH_FEE` in `src/lib/pricing.ts`
   (currently 199).
3. Interim: keep the current urgent request and standby host forms live as the
   funnel until Phase 1 and 2 ship, then swap the page to the board.
4. Either side can post, and either side can be the paying initiator.

## Phased build

### Phase 1: Accounts + Board (free, no payments)
- Public user accounts (magic link). New `User` model, session cookie distinct
  from the admin cookie.
- Post creation: two post types, `need` (traveler) and `availability` (host).
  Fields: dates, party size or sleeps, area, budget or rate range, notes.
- Board: browse and filter posts by type, area, and dates. Post detail pages.
- Moderation hook: posts default to a pending state and appear after admin
  approval (reuses the admin console).

### Phase 2: Messaging (free during build)
- `Thread` between two users tied to a post, plus `Message` records.
- Inbox view for each signed in user. New message email alerts via Resend.
- Rate limits on posting and messaging (reuse durable rate limit helpers).

### Phase 3: Paywall (Stripe, gated on explicit go)
- Starting a new thread requires a paid unlock for the initiating user.
- Stripe Checkout for the flat `LODGING_MATCH_FEE`. On success, record a
  `ContactUnlock` entitlement that opens that one thread.
- No real charges until Scott greenlights Stripe and provides keys.

### Phase 4: Moderation + abuse controls
- Admin review and removal of posts and threads, report a post or message,
  spam and flood controls, block list.

## Data model (Prisma, additive)

- `User`: id, email (unique), name, role (guest or host or both), createdAt.
- `MagicLinkToken`: id, userId, tokenHash, expiresAt, usedAt.
- `BoardPost`: id, authorId, type (need or availability), area, dates,
  partySize, budget, notes, status (pending, active, closed, removed),
  createdAt.
- `Thread`: id, postId, initiatorId, recipientId, status, createdAt.
- `Message`: id, threadId, senderId, body, createdAt, readAt.
- `ContactUnlock`: id, userId, threadId, amount, stripeRef, createdAt.

## Security notes (this is auth + payments + user content)

- Magic link tokens stored hashed, single use, short expiry. Per IP and per
  email send throttling, mirroring the admin login guard.
- Separate session cookie and middleware matcher for the public area so it
  never grants admin access.
- All post and message input validated with zod, length capped, sanitized on
  render. No raw HTML.
- Stripe webhook signature verification. Entitlement granted server side only.
- Moderation queue so user content is reviewed before it is public.
- security-reviewer pass before Phase 1 and Phase 3 merge.

## Out of scope for v1
- Reviews or ratings, public user profiles, payments to hosts, taking any cut
  of the stay, real time websockets (polling or email alerts are enough).
