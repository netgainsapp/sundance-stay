import { SectionHeader } from "@/components/ui/SectionHeader";
import { InquiryForm } from "@/components/forms/InquiryForm";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Contact",
  description:
    "Questions about staying in Boulder, listing your home, or local services. Send us a message.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-[var(--space-section)]">
      <SectionHeader
        eyebrow="Contact"
        title="How can we help?"
        intro="Whether you are planning a stay, listing a home, or looking for local services, send us a note and we will point you in the right direction."
      />
      <div className="mt-12 max-w-2xl rounded-card border border-charcoal/10 p-6 md:p-8">
        <h3 className="font-heading text-xl text-charcoal">Send us a message</h3>
        <div className="mt-6">
          <InquiryForm sourceType="general_contact" submitLabel="Send Message" />
        </div>
      </div>
    </section>
  );
}
