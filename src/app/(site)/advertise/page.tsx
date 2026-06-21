import { SectionHeader } from "@/components/ui/SectionHeader";
import { Cta } from "@/components/ui/Cta";
import { InquiryForm } from "@/components/forms/InquiryForm";
import { pageMetadata } from "@/lib/seo";
import {
  ADVERTISER_CATEGORIES,
  LISTING_TIERS,
  TIER_LABEL,
  TIER_BLURB,
  CATEGORY_LABEL,
  CAROUSEL_TOTAL_SLOTS,
  priceFor,
  formatPrice,
} from "@/lib/pricing";

export const metadata = pageMetadata({
  title: "Advertise with Sundance Stay Collective",
  description:
    "Reach Festival Season visitors and Boulder area travelers. Listing tiers, featured guide placement, and a limited homepage carousel.",
  path: "/advertise",
});

function Check() {
  return (
    <span
      aria-hidden="true"
      className="mt-1 inline-flex h-4 w-4 flex-none items-center justify-center rounded-full bg-mountain/10 text-[10px] font-bold text-mountain"
    >
      &#10003;
    </span>
  );
}

const featuredGuidePrice = priceFor("restaurants", "featured_guide");
const carouselPrice = priceFor("restaurants", "carousel");

export default function AdvertisePage() {
  return (
    <>
      <section className="mx-auto max-w-7xl px-6 py-[var(--space-section)]">
        <SectionHeader
          eyebrow="Advertise"
          title="Reach Boulder visitors during Festival Season"
          intro="Connect with an engaged, high intent travel audience as they plan where to stay, eat, and explore. Every placement is a flat fee for the Festival Season window, with no commission on your business."
        />
      </section>

      <section className="mx-auto max-w-7xl px-6 py-[var(--space-section)]">
        <SectionHeader
          eyebrow="Listing tiers"
          title="Pricing by business type"
          intro="Pick a tier, priced by category. Restaurants are the base rate, services run higher, and short-term rentals are the premium tier."
        />
        <div className="mt-10 overflow-x-auto rounded-card border border-charcoal/10 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-charcoal/10 text-charcoal/60">
              <tr>
                <th className="px-5 py-4 font-medium">Placement</th>
                {ADVERTISER_CATEGORIES.map((category) => (
                  <th key={category} className="px-5 py-4 text-right font-medium">
                    {CATEGORY_LABEL[category]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {LISTING_TIERS.map((tier) => (
                <tr
                  key={tier}
                  className="border-b border-charcoal/5 last:border-0"
                >
                  <td className="px-5 py-5">
                    <div className="font-heading text-lg text-charcoal">
                      {TIER_LABEL[tier]}
                    </div>
                    <div className="mt-1 max-w-xs text-xs leading-relaxed text-charcoal/60">
                      {TIER_BLURB[tier]}
                    </div>
                  </td>
                  {ADVERTISER_CATEGORIES.map((category) => (
                    <td
                      key={category}
                      className="px-5 py-5 text-right font-heading text-xl text-charcoal"
                    >
                      {formatPrice(priceFor(category, tier))}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-xs text-charcoal/50">
          Flat fee per festival window. Short-term rental listings are managed on
          the List Your Home page.
        </p>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-[var(--space-section)]">
        <SectionHeader
          eyebrow="Premium placements"
          title="Maximum visibility"
          intro="Two flat rate placements at the top of the funnel, priced the same for every business type."
        />
        <div className="mt-12 grid gap-8 md:grid-cols-2">
          <div className="flex flex-col rounded-card border border-charcoal/10 p-8">
            <h3 className="font-heading text-2xl text-charcoal">
              {TIER_LABEL.featured_guide}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-charcoal/70">
              {TIER_BLURB.featured_guide}
            </p>
            <p className="mt-6 font-heading text-4xl text-charcoal">
              {formatPrice(featuredGuidePrice)}
              <span className="ml-2 text-sm font-normal text-charcoal/50">
                per festival window
              </span>
            </p>
            <ul className="mt-6 flex-1 space-y-3">
              {[
                "Your brand placed inside the editorial guides",
                "Contextual exposure where travelers plan",
                "Any business type, one flat rate",
              ].map((b) => (
                <li
                  key={b}
                  className="flex items-start gap-3 text-sm text-charcoal/80"
                >
                  <Check />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <Cta href="#sponsor-inquiry" variant="secondary" className="w-full">
                Request availability
              </Cta>
            </div>
          </div>

          <div className="flex flex-col rounded-card border border-mountain p-8 ring-1 ring-mountain">
            <div className="flex items-center justify-between">
              <h3 className="font-heading text-2xl text-charcoal">
                {TIER_LABEL.carousel}
              </h3>
              <span className="rounded-full bg-copper px-3 py-1 text-xs font-medium text-white">
                {CAROUSEL_TOTAL_SLOTS} slots only
              </span>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-charcoal/70">
              {TIER_BLURB.carousel}
            </p>
            <p className="mt-6 font-heading text-4xl text-charcoal">
              {formatPrice(carouselPrice)}
              <span className="ml-2 text-sm font-normal text-charcoal/50">
                per festival window
              </span>
            </p>
            <ul className="mt-6 flex-1 space-y-3">
              {[
                `Limited to ${CAROUSEL_TOTAL_SLOTS} businesses sitewide`,
                "Rotating homepage placement seen on every page",
                "Any business type, one flat rate",
              ].map((b) => (
                <li
                  key={b}
                  className="flex items-start gap-3 text-sm text-charcoal/80"
                >
                  <Check />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <Cta href="#sponsor-inquiry" className="w-full">
                Reserve a slot
              </Cta>
            </div>
          </div>
        </div>
      </section>

      <section
        id="sponsor-inquiry"
        className="mx-auto max-w-7xl px-6 py-[var(--space-section)]"
      >
        <SectionHeader
          eyebrow="Get in touch"
          title="Request placement information"
        />
        <div className="mt-12 max-w-2xl rounded-card border border-charcoal/10 p-6 md:p-8">
          <InquiryForm
            sourceType="sponsor_inquiry"
            submitLabel="Request Placement Info"
          />
        </div>
      </section>
    </>
  );
}
