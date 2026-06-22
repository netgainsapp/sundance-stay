# Last-Minute / Festival-Only Lodging — Design Spec

Date: 2026-06-21
Status: Draft for review
Scope: A supply segment for short-notice / festival-only homes plus an urgent-stay
intake, built on the existing directory and lead model. No booking engine.

## Context and opportunity

Festival demand creates an acute, price-insensitive lodging shortage and unlocks
latent supply: homeowners who would never normally rent will vacate their primary
residence for the festival window at a premium. The most valuable match in the
market is a late, motivated traveler paired with a willing-to-vacate homeowner.

This feature captures that match as a FACILITATOR, not a principal. Sundance Stay
Collective surfaces the supply, intakes the urgent demand, and routes the two
together. Bookings still settle on the host's own channel or off platform. We never
hold inventory, process guest payments, or take booking commission. For the
highest-value matches, the operator may broker an introduction for a flat finder
fee, tracked manually.

## Scope decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Role | Facilitator, not principal | Avoids the capital, liability, insurance, and trust-and-safety burden of a booking platform (the engine we already rejected). |
| Supply opt-in | A `shortNotice` flag on a listing | A homeowner marks that they accept last-minute, festival-window stays. No new listing SKU. |
| Demand intake | An `urgent_stay` lead type | Reuses the hardened lead pipeline; routes fast to the operator. |
| Concierge finder fee | Documented and manual in v1 | A flat placement fee for a brokered match is not a booking commission, so it does not make us a payment platform. No billing integration yet. |
| Real-time availability | Out of scope (v1) | iCal sync is a later enhancement; v1 relies on the flag plus fast human routing. |

## Data model additions

- `Property.shortNotice?: boolean` (content seed) — appears in the short-notice
  segment and shows a badge.
- `PropertySubmission.shortNotice: Boolean?` (Prisma) — host opt-in captured on the
  List Your Home form.
- `LeadSource` enum gains `urgent_stay`. The `leadSchema` sourceType enum and the
  admin leads filter add the same value.

No new pricing SKU. The short-notice flag is available on any listing tier.

## Surfaces

### 1. Stay page segment and badge
- `StayFilters` gains a "Available on short notice" toggle (URL param `shortNotice=1`).
- `PropertyCard` and the property detail page show a small "Short notice" badge when
  `property.shortNotice` is true.
- `/stay?shortNotice=1` filters to the short-notice pool.

### 2. Last-Minute page (`/last-minute`)
A dedicated page that:
- Explains the short-notice / festival-only path for travelers with urgent needs.
- Lists the short-notice homes (cards, linking to detail pages where the Book or
  inquiry options live).
- Presents the URGENT INTAKE FORM (below).
- Carries a clear licensing note (see Legal section).
- Is linked from the main nav or the Stay page and from the homepage during the
  festival window.

### 3. Urgent intake form (demand side)
A focused form using the existing lead pipeline with `sourceType = "urgent_stay"`.
Fields: name, email, phone, dates needed, party size, budget, message. On submit it
persists a `Lead` and emails the operator immediately so a fast match can happen.
Same validation, honeypot, and rate limiting as the other forms.

### 4. Host opt-in (supply side)
The List Your Home submission form gains a checkbox: "Open to last-minute or
festival-only stays (you would vacate on short notice)." It persists to
`PropertySubmission.shortNotice` and appears in the submission email and admin view.

### 5. Admin
Urgent-stay leads appear in `/admin/leads`, filterable by the new `urgent_stay`
source. Short-notice submissions are visible in `/admin/submissions`. The operator
works these fast. The concierge finder-fee for a brokered match is recorded as a
manual note for now (a future enhancement may add it as a tracked line item, similar
to the Sponsorship CRM).

## Concierge finder-fee path (noted, manual in v1)

For a high-value urgent request, the operator sources a willing-to-vacate homeowner
and brokers the introduction for a flat finder or placement fee. This is a manual,
relationship-driven process in v1. It is intentionally a finder fee, not a booking
commission, so it does not require payment processing or change our facilitator
posture. A later phase could formalize it (tracked records, optional invoicing).

## Legal and compliance (gating dependency)

Boulder regulates short-term rentals tightly. A one-off, unlicensed festival rental
of a primary residence may require a license and lodging-tax collection, or may not
be permitted. Before promoting the short-notice / festival-only path, the operator
must confirm the current Boulder rules. The feature copy reinforces that hosts are
responsible for their own licensing, taxes, and compliance, consistent with the
existing List Your Home disclaimer, and links to the City of Boulder short-term
rental licensing resource. This is a launch dependency, not a code blocker: the UI
can be built and reviewed while the legal question is confirmed.

## Out of scope (later phases)

- On-platform booking, payments, payouts, calendars, instant booking.
- iCal real-time availability sync.
- Automated host broadcast or auto-matching of urgent requests to hosts.
- Billing for the concierge finder fee.
- Identity verification and screening for primary-residence hosting.

## Success criteria

- Hosts can flag a listing as short notice (seed plus the submission opt-in).
- The Stay page can filter to short-notice homes, with a clear badge.
- A `/last-minute` page explains the path, lists short-notice homes, and intakes
  urgent requests, which persist as `urgent_stay` leads and email the operator.
- Urgent leads are filterable in the admin.
- The licensing disclaimer is present on the Last-Minute page.
- No booking, payment, or inventory-holding behavior is introduced.
- All existing tests stay green; new validation logic is covered.
