import { SectionHeader } from "@/components/ui/SectionHeader";
import { Cta } from "@/components/ui/Cta";
import { InquiryForm } from "@/components/forms/InquiryForm";
import { pageMetadata } from "@/lib/seo";
import {
  ADVERTISER_CATEGORIES,
  CATEGORY_LABEL,
  TIER_LABEL,
  TIER_BLURB,
  CAROUSEL_TOTAL_SLOTS,
  REALTOR_SPOT_SLOTS,
  CARE_LISTING_PRICE,
  priceFor,
  formatPrice,
} from "@/lib/pricing";

export const metadata = pageMetadata({
  title: "Advertise with Boulder Film Collective",
  description:
    "Reach Festival Season visitors and Boulder area travelers. Standard listings, Premier placement, and a limited homepage carousel.",
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

const standardByCategory = ADVERTISER_CATEGORIES.map((category) => ({
  label: CATEGORY_LABEL[category],
  price: priceFor(category, "standard"),
}));

const premierPrice = priceFor("restaurants", "premier");
const carouselPrice = priceFor("restaurants", "carousel");
const realtorSpotPrice = priceFor("realtors", "realtor_spot");

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
        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">
          {/* Standard */}
          <div className="flex flex-col rounded-card border border-charcoal/10 p-8">
            <h3 className="font-heading text-2xl text-charcoal">
              {TIER_LABEL.standard}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-charcoal/70">
              {TIER_BLURB.standard}
            </p>
            <p className="mt-6 font-heading text-2xl text-charcoal">
              From {formatPrice(standardByCategory[0].price)}
            </p>
            <ul className="mt-4 space-y-1 text-sm text-charcoal/60">
              {standardByCategory.map((row) => (
                <li key={row.label} className="flex justify-between">
                  <span>{row.label}</span>
                  <span className="text-charcoal">{formatPrice(row.price)}</span>
                </li>
              ))}
            </ul>
            <ul className="mt-6 flex-1 space-y-3">
              {[
                "Directory listing with full details",
                "Category placement",
                "Direct inquiry form",
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
                Request a listing
              </Cta>
            </div>
          </div>

          {/* Premier */}
          <div className="flex flex-col rounded-card border border-mountain p-8 ring-1 ring-mountain">
            <h3 className="font-heading text-2xl text-charcoal">
              {TIER_LABEL.premier}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-charcoal/70">
              {TIER_BLURB.premier}
            </p>
            <p className="mt-6 font-heading text-2xl text-charcoal">
              {formatPrice(premierPrice)}
              <span className="ml-2 text-sm font-normal text-charcoal/50">
                flat, any business type
              </span>
            </p>
            <ul className="mt-6 flex-1 space-y-3">
              {[
                "Everything in Standard",
                "Top placement and a featured profile",
                "Highlighted across the site",
                "One flat rate for every category",
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
                Request Premier
              </Cta>
            </div>
          </div>

          {/* Large Carousel */}
          <div className="flex flex-col rounded-card border border-copper p-8 ring-1 ring-copper">
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
            <p className="mt-6 font-heading text-2xl text-charcoal">
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

          {/* Realtor Spotlight */}
          <div className="flex flex-col rounded-card border border-charcoal bg-charcoal p-8 text-white">
            <div className="flex items-center justify-between">
              <h3 className="font-heading text-2xl text-white">
                {TIER_LABEL.realtor_spot}
              </h3>
              <span className="rounded-full bg-sand px-3 py-1 text-xs font-medium text-charcoal">
                {REALTOR_SPOT_SLOTS} spot only
              </span>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-white/75">
              {TIER_BLURB.realtor_spot}
            </p>
            <p className="mt-6 font-heading text-2xl text-white">
              {formatPrice(realtorSpotPrice)}
              <span className="ml-2 text-sm font-normal text-white/50">
                per festival window
              </span>
            </p>
            <ul className="mt-6 flex-1 space-y-3">
              {[
                "The only realtor placement on the site",
                "Exposure to festival visitors and home buyers",
                "Realtors can also take a Standard or Premier listing",
              ].map((b) => (
                <li key={b} className="flex items-start gap-3 text-sm text-white/85">
                  <span
                    aria-hidden="true"
                    className="mt-1 inline-flex h-4 w-4 flex-none items-center justify-center rounded-full bg-white/15 text-[10px] font-bold text-white"
                  >
                    &#10003;
                  </span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <a
                href="#sponsor-inquiry"
                className="inline-flex w-full items-center justify-center rounded-card bg-white px-6 py-3 text-sm font-medium text-charcoal transition-colors hover:bg-sand"
              >
                Claim the realtor spot
              </a>
            </div>
          </div>
        </div>
        <p className="mt-6 text-xs text-charcoal/50">
          Flat fee per festival window. Short-term rental listings are managed on
          the List Your Home page.
        </p>

        <div className="mt-8 flex flex-col items-start justify-between gap-4 rounded-card bg-sand/20 p-6 md:flex-row md:items-center">
          <div>
            <h3 className="font-heading text-xl text-charcoal">
              Child Care and Pet Care providers
            </h3>
            <p className="mt-1 text-sm leading-relaxed text-charcoal/70">
              A flat {formatPrice(CARE_LISTING_PRICE)} listing for vetted sitters,
              nannies, and pet care. You set and show your own rates, and list your
              vetting credentials.
            </p>
          </div>
          <span className="font-heading text-3xl text-charcoal">
            {formatPrice(CARE_LISTING_PRICE)}
          </span>
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
