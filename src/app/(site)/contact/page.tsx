import Link from "next/link";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { InquiryForm } from "@/components/forms/InquiryForm";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Contact",
  description:
    "Questions about staying in Boulder, listing your home, or local services. Send us a message.",
  path: "/contact",
});

const journeys = [
  {
    href: "/stay",
    heading: "Find a place to stay",
    line: "Browse curated Boulder area homes for your Festival Season visit.",
  },
  {
    href: "/list-your-home",
    heading: "List your home",
    line: "Share your property with travelers planning a Boulder stay.",
  },
  {
    href: "/services",
    heading: "Find local services",
    line: "Discover trusted Boulder area businesses and concierge resources.",
  },
];

export default function ContactPage() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-[var(--space-section)]">
      <SectionHeader
        eyebrow="Contact"
        title="How can we help?"
        intro="Whether you are planning a stay, listing a home, or looking for local services, send us a note and we will point you in the right direction."
      />
      <div className="mt-12 grid gap-12 lg:grid-cols-2">
        <div className="space-y-5">
          {journeys.map((j) => (
            <Link
              key={j.href}
              href={j.href}
              className="block rounded-card border border-charcoal/10 p-5 transition-colors hover:border-mountain"
            >
              <h3 className="font-heading text-lg text-charcoal">{j.heading}</h3>
              <p className="mt-2 text-sm text-charcoal/70">{j.line}</p>
            </Link>
          ))}
        </div>
        <div className="rounded-card border border-charcoal/10 p-6 md:p-8">
          <h3 className="font-heading text-xl text-charcoal">
            Send us a message
          </h3>
          <div className="mt-6">
            <InquiryForm
              sourceType="general_contact"
              submitLabel="Send Message"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
