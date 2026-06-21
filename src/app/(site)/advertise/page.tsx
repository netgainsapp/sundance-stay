import { SectionHeader } from "@/components/ui/SectionHeader";
import { Cta } from "@/components/ui/Cta";
import { InquiryForm } from "@/components/forms/InquiryForm";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Advertise with Sundance Stay Collective",
  description:
    "Reach Festival Season visitors and Boulder area travelers. Local, category, and festival sponsorships available.",
  path: "/advertise",
});

const tiers = [
  {
    name: "Local Sponsor",
    positioning: "A trusted presence among Boulder area businesses.",
    benefits: ["Business listing", "Category placement", "Full profile"],
    emphasized: false,
  },
  {
    name: "Category Sponsor",
    positioning: "Own your category with featured, exclusive visibility.",
    benefits: [
      "One per category",
      "Featured placement",
      "Premium category exposure",
    ],
    emphasized: true,
  },
  {
    name: "Festival Sponsor",
    positioning: "Our most visible partnership, limited to a select few.",
    benefits: [
      "Maximum three partners",
      "Homepage exposure",
      "Premium positioning",
      "Sitewide visibility",
    ],
    emphasized: false,
  },
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

export default function AdvertisePage() {
  return (
    <>
      <section className="mx-auto max-w-7xl px-6 py-[var(--space-section)]">
        <SectionHeader
          eyebrow="Advertise"
          title="Reach Boulder visitors during Festival Season"
          intro="Connect with an engaged, high intent travel audience as they plan where to stay, eat, and explore. Our sponsorships place your business in front of visitors at the moment they are making decisions."
        />
      </section>

      <section className="mx-auto max-w-7xl px-6 py-[var(--space-section)]">
        <div className="grid gap-8 md:grid-cols-3">
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
              <ul className="mt-6 flex-1 space-y-3">
                {tier.benefits.map((b) => (
                  <li key={b} className="flex items-start gap-3 text-sm text-charcoal/80">
                    <Check />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <Cta
                  href="#sponsor-inquiry"
                  variant={tier.emphasized ? "primary" : "secondary"}
                  className="w-full"
                >
                  Contact for pricing
                </Cta>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section
        id="sponsor-inquiry"
        className="mx-auto max-w-7xl px-6 py-[var(--space-section)]"
      >
        <SectionHeader
          eyebrow="Get in touch"
          title="Request sponsor information"
        />
        <div className="mt-12 max-w-2xl rounded-card border border-charcoal/10 p-6 md:p-8">
          <InquiryForm
            sourceType="sponsor_inquiry"
            submitLabel="Request Sponsor Info"
          />
        </div>
      </section>
    </>
  );
}
