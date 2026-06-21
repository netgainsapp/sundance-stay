import { SectionHeader } from "@/components/ui/SectionHeader";
import { GuideCard } from "@/components/cards/GuideCard";
import { guides } from "@/content/guides";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Boulder Travel Guides",
  description:
    "Lodging, transportation, neighborhood, dining, and host guides for visiting Boulder during Festival Season.",
  path: "/guides",
});

export default function GuidesPage() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-[var(--space-section)]">
      <SectionHeader
        eyebrow="Guides"
        title="Everything you need to plan your trip"
      />
      <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {guides.map((g) => (
          <GuideCard key={g.slug} guide={g} />
        ))}
      </div>
    </section>
  );
}
