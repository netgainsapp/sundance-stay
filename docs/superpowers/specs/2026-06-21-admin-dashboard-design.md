# Sundance Stay Collective — Admin Dashboard Design Spec

Date: 2026-06-21
Status: Approved for build
Scope: v1 operator console over DB-backed data. Single operator. No payments.

## Context

The v1 marketing site captures leads and property submissions into Neon
(`Lead`, `PropertySubmission`). There is currently no UI to view or manage
them. This admin gives the operator (Scott) a secure console to work that
pipeline, plus a lightweight CRM to track advertiser/sponsor deals while
monetization is handled manually (no Stripe in this phase).

## Scope decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Access model | Single operator login | One person manages everything. Hosts and advertisers interact only through public forms. |
| Auth | Email + bcrypt password, signed httpOnly session cookie, middleware-guarded `/admin/*` | Secure and dependency-light. bcrypt verify in the Node login action, HMAC cookie verify in middleware (edge safe). |
| Payments | None in this phase | Sponsorships are tracked manually as CRM records. Stripe is a later phase gated on real prices and a Stripe account. |
| Catalog editing | Out of scope | Properties, businesses, and guides are version-controlled content files, not DB rows. CRUD over them needs a CMS migration, a separate phase. |
| Data managed | Leads, PropertySubmissions, Sponsorships | All DB-backed, so the admin operates on live data. |

## Tech

Same stack as the site: Next.js 16 App Router, TypeScript, Tailwind v4,
Prisma 7 + Neon. New dependency: `bcryptjs` for password hashing. Session
signing uses Web Crypto HMAC-SHA256 (no new dependency, edge safe).

## Auth design

Environment variables (operator sets these; dev values in `.env.local`):
- `ADMIN_EMAIL` operator login email
- `ADMIN_PASSWORD_HASH` bcrypt hash of the operator password
- `ADMIN_SESSION_SECRET` random string used to sign the session cookie

Flow:
1. `/admin/login` posts to a `login` server action (Node runtime).
2. The action rate limits per IP (reuse `checkRateLimit`), verifies the email
   matches `ADMIN_EMAIL` and `bcrypt.compare(password, ADMIN_PASSWORD_HASH)`
   with constant-time behavior, and on success sets a `sundance_admin` cookie:
   httpOnly, secure, sameSite lax, ~7 day expiry. The cookie value is
   `base64url(payload).hmac` where payload is `{ exp }` signed with
   `ADMIN_SESSION_SECRET` via HMAC-SHA256.
3. `middleware.ts` matches `/admin/:path*` (excluding `/admin/login`), reads the
   cookie, verifies the HMAC and expiry with Web Crypto, and redirects to
   `/admin/login` when missing or invalid.
4. A `logout` action clears the cookie.
5. `/admin/login` and all `/admin` routes are `noindex` via metadata. robots
   already allows `/`; admin pages set `robots: { index: false }`.

Login failures return a generic message (no email enumeration). The login
endpoint is the main public attack surface, so it is throttled.

## Data model additions

Existing (no change): `Lead` (status new|contacted|closed), `PropertySubmission`
(status new|contacted|closed).

New `Sponsorship` model:
- id, businessName, contactName?, contactEmail, contactPhone?
- level (LeadSource-like enum: local | category | festival) -> reuse a new
  `SponsorLevel` enum
- placement (free text, e.g. a category slug or "homepage")
- amountCents (Int?, optional, what they agreed to pay)
- status (`SponsorshipStatus`: pending | active | expired)
- startDate (DateTime?), endDate (DateTime?)
- notes (String?)
- createdAt (DateTime default now)

## Routes

- `/admin/login` public login form (noindex)
- `/admin` overview: cards for new leads, new submissions, active sponsorships, plus recent leads list
- `/admin/leads` table of all leads; filter by sourceType and status; per row status update; CSV export link
- `/admin/submissions` table of property submissions; status update; CSV export
- `/admin/sponsorships` list of sponsorship records; create and edit form
- `/api/admin/leads/export` and `/api/admin/submissions/export` stream CSV (guarded by middleware)

Shared admin chrome: a left nav (Overview, Leads, Submissions, Sponsorships) and
a header with a logout button. Visually consistent with the site tokens but
utilitarian (dense tables, not editorial).

## Mutations

Server actions, all of which re-check the session server side (defense in depth
beyond middleware):
- `login`, `logout`
- `updateLeadStatus(id, status)`
- `updateSubmissionStatus(id, status)`
- `createSponsorship(data)`, `updateSponsorship(id, data)`

All validate input with zod. All mutations revalidate the relevant admin path.

## Security notes

- Middleware guards every `/admin` route; server actions independently verify the
  session cookie so a direct action call without a valid session is rejected.
- Login throttled per IP; constant-time password compare; generic error copy.
- No secrets rendered to the client. The lead inbox email is never shown.
- `/admin/*` noindexed.

## Out of scope (later phases)

- Stripe checkout, subscriptions, invoicing, automated placement, revenue
  reporting (the funds backend), gated on prices + Stripe account.
- Catalog CRUD over properties, businesses, guides (CMS migration).
- Multi-role accounts (host and vendor self-serve dashboards).
- Email automation, advanced analytics.

## Success criteria

- Operator can log in securely and is redirected away when unauthenticated.
- Leads and submissions are viewable, filterable, status-updatable, exportable.
- Sponsorship records can be created and edited.
- `/admin/*` is protected by middleware AND server-side session checks, throttled, and noindexed.
- All existing site tests still pass; new auth and CSV logic is unit tested.
