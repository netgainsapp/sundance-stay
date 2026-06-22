import Link from "next/link";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Cta } from "@/components/ui/Cta";
import { ConciergeRequestForm } from "@/components/forms/ConciergeRequestForm";
import { CONCIERGE_TIERS, formatPrice } from "@/lib/pricing";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Festival Concierge in Boulder",
  description:
    "A dedicated concierge for your Boulder festival. We arrange lodging, rides, dining, experiences, and more. You just show up.",
  path: "/concierge",
});

const arranges = [
  "Lodging and last-minute matches",
  "Private drivers and airport transfers",
  "Dining, private chefs, and reservations",
  "Guided hikes, ski days, and spa time",
  "Grocery stocking, gear rental, home prep",
  "Festival-day planning and logistics",
];

const steps = [
  "Tell us your dates, your party, and what you want handled.",
  "We build the plan and book through our vetted local network.",
  "You enjoy the festival with one point of contact for anything.",
];

export default function ConciergePage() {
  return (
    <>
      <section className="mx-auto max-w-7xl px-6 py-[var(--space-section)]">
        <SectionHeader
          eyebrow="Concierge"
          title="Your Boulder festival, handled."
          intro="From the airport to the after-party, we arrange the lodging, rides, dining, and experiences so you can just show up. One dedicated point of contact for your entire stay."
        />
        <div className="mt-10">
          <Cta href="#request">Request concierge</Cta>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-[var(--space-section)]">
        <h2 className="font-heading text-2xl text-charcoal">What we arrange</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {arranges.map((item) => (
            <div
              key={item}
              className="rounded-card border border-charcoal/10 p-5 text-sm text-charcoal/80"
            >
              {item}
            </div>
          ))}
        </div>
        <p className="mt-6 text-sm text-charcoal/60">
          We can also arrange vetted childcare and pet care through our trusted
          local providers. See{" "}
          <Link href="/services/child-care" className="text-mountain underline">
            Child Care
          </Link>{" "}
          and{" "}
          <Link href="/services/pet-care" className="text-mountain underline">
            Pet Care
          </Link>
          .
        </p>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-[var(--space-section)]">
        <SectionHeader
          eyebrow="Packages"
          title="Choose your level of coverage"
          intro="Flat fee for the festival window. We arrange and coordinate. The licensed local providers deliver the service."
        />
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {CONCIERGE_TIERS.map((tier) => (
            <div
              key={tier.key}
              className={`flex flex-col rounded-card border p-8 ${
                tier.emphasized
                  ? "border-mountain ring-1 ring-mountain"
                  : "border-charcoal/10"
              }`}
            >
              <h3 className="font-heading text-2xl text-charcoal">{tier.label}</h3>
              <p className="mt-2 text-sm text-charcoal/60">{tier.coverage}</p>
              <p className="mt-6 font-heading text-4xl text-charcoal">
                {formatPrice(tier.price)}
                <span className="ml-2 text-sm font-normal text-charcoal/50">
                  per festival window
                </span>
              </p>
              <p className="mt-6 flex-1 text-sm leading-relaxed text-charcoal/70">
                {tier.blurb}
              </p>
              <div className="mt-8">
                <Cta
                  href="#request"
                  variant={tier.emphasized ? "primary" : "secondary"}
                  className="w-full"
                >
                  Request this package
                </Cta>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-[var(--space-section)]">
        <SectionHeader title="How it works" />
        <div className="mt-10 grid gap-5 sm:grid-cols-3">
          {steps.map((step, i) => (
            <div key={step} className="rounded-card border border-charcoal/10 p-6">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-copper font-heading text-sm text-white">
                {i + 1}
              </span>
              <p className="mt-4 text-sm leading-relaxed text-charcoal/80">
                {step}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section
        id="request"
        className="mx-auto max-w-7xl px-6 pb-[var(--space-section)]"
      >
        <SectionHeader eyebrow="Get started" title="Request concierge" />
        <div className="mt-12 max-w-2xl rounded-card border border-charcoal/10 p-6 shadow-sm md:p-8">
          <ConciergeRequestForm />
        </div>
      </section>
    </>
  );
}
