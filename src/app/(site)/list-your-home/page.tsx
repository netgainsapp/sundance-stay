import Image from "next/image";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Cta } from "@/components/ui/Cta";
import Link from "next/link";
import { PropertySubmissionForm } from "@/components/forms/PropertySubmissionForm";
import { pageMetadata } from "@/lib/seo";
import { priceFor, formatPrice } from "@/lib/pricing";

export const metadata = pageMetadata({
  title: "List Your Boulder Home",
  description:
    "Reach Festival Season visitors looking for quality Boulder area lodging. List your home with a trusted local resource.",
  path: "/list-your-home",
});

const benefits = [
  {
    heading: "Reach Festival Season visitors",
    body: "Your home is presented to travelers actively planning a Boulder stay during the busiest weekends of the year, when quality lodging is in highest demand.",
  },
  {
    heading: "Curated and editorial presentation",
    body: "We feature your property with large photography and thoughtful writing, the kind of presentation that helps a home stand out and earns guest confidence.",
  },
  {
    heading: "Direct inquiries with no middleman",
    body: "Interested guests reach you through our inquiry form. You stay in control of conversations, terms, and bookings from the first message onward.",
  },
];

const tiers = [
  {
    name: "Standard Listing",
    positioning: "A clean, credible presence for your home.",
    price: priceFor("short_term_rentals", "standard"),
    features: [
      "Directory listing with full details",
      "Neighborhood placement",
      "Photo gallery",
      "Direct inquiry form",
    ],
    emphasized: false,
  },
  {
    name: "Premier",
    positioning: "Top placement and a featured profile for homes that deserve attention.",
    price: priceFor("short_term_rentals", "premier"),
    features: [
      "Everything in Standard",
      "Top placement in search",
      "Highlighted featured card",
      "Larger gallery",
      "Homepage eligibility",
    ],
    emphasized: true,
  },
];

const steps = [
  { number: "1", label: "Submit your property" },
  { number: "2", label: "We review and curate" },
  { number: "3", label: "Your listing goes live" },
  { number: "4", label: "Receive guest inquiries" },
];

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

export default function ListYourHomePage() {
  return (
    <>
      <section className="relative flex min-h-[55vh] items-center overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=2000&q=80"
          alt="Warm, light filled living room in a Boulder area home"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/85 via-charcoal/45 to-charcoal/30" />
        <div className="relative mx-auto w-full max-w-7xl px-6 py-24">
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-copper">
            For Hosts
          </p>
          <h1 className="max-w-3xl font-heading text-4xl text-white md:text-6xl">
            Share your Boulder home with festival guests
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/85">
            Join a curated collection of Boulder area homes and connect with
            travelers seeking a memorable place to stay during Festival Season.
          </p>
          <div className="mt-8">
            <Cta href="#submit">List Your Home</Cta>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-[var(--space-section)]">
        <SectionHeader
          eyebrow="Why list with us"
          title="A trusted local audience"
        />
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {benefits.map((b) => (
            <div
              key={b.heading}
              className="rounded-card border border-charcoal/10 p-6"
            >
              <h3 className="font-heading text-xl text-charcoal">{b.heading}</h3>
              <p className="mt-3 text-sm leading-relaxed text-charcoal/70">
                {b.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-[var(--space-section)]">
        <SectionHeader
          eyebrow="Listing tiers"
          title="Choose how you appear"
          intro="Flat fee for the Festival Season window. No commission on your bookings, ever."
        />
        <div className="mt-12 grid gap-8 md:grid-cols-2">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`flex flex-col rounded-card border p-8 ${
                tier.emphasized
                  ? "border-mountain ring-1 ring-mountain"
                  : "border-charcoal/10"
              }`}
            >
              <h3 className="font-heading text-2xl text-charcoal">{tier.name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-charcoal/70">
                {tier.positioning}
              </p>
              <p className="mt-6 font-heading text-2xl text-charcoal">
                {formatPrice(tier.price)}
                <span className="ml-2 text-sm font-normal text-charcoal/50">
                  per festival window
                </span>
              </p>
              <ul className="mt-6 flex-1 space-y-3">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm text-charcoal/80">
                    <Check />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <Cta
                  href="#submit"
                  variant={tier.emphasized ? "primary" : "secondary"}
                  className="w-full"
                >
                  Request this listing
                </Cta>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-8 text-sm text-charcoal/60">
          Want maximum reach? Featured Guide placement and the homepage Large
          Carousel are available on the{" "}
          <Link href="/advertise" className="text-mountain underline">
            Advertise
          </Link>{" "}
          page.
        </p>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-[var(--space-section)]">
        <SectionHeader title="How it works" />
        <div className="mt-12 grid gap-8 md:grid-cols-4">
          {steps.map((step) => (
            <div key={step.number}>
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-copper font-heading text-lg text-white">
                {step.number}
              </span>
              <p className="mt-4 font-heading text-lg text-charcoal">
                {step.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-[var(--space-section)]">
        <div className="rounded-card bg-sand/20 p-8">
          <h3 className="font-heading text-xl text-charcoal">
            Licensing and compliance
          </h3>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-charcoal/70">
            Boulder area short term rentals may require a license. Hosts are
            responsible for their own licensing, taxes, and compliance, and we
            encourage you to confirm the current requirements before listing. You
            can learn more through the{" "}
            <a
              href="https://bouldercolorado.gov/services/short-term-rental-licensing"
              target="_blank"
              rel="noopener noreferrer"
              className="text-mountain underline"
            >
              City of Boulder short term rental licensing
            </a>{" "}
            resource.
          </p>
        </div>
      </section>

      <section
        id="submit"
        className="mx-auto max-w-7xl px-6 py-[var(--space-section)]"
      >
        <SectionHeader eyebrow="Get started" title="Submit your property" />
        <div className="mt-12 max-w-3xl rounded-card border border-charcoal/10 p-6 md:p-8">
          <PropertySubmissionForm />
        </div>
      </section>
    </>
  );
}
