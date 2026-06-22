import Link from "next/link";
import { notFound } from "next/navigation";
import { BusinessCard } from "@/components/cards/BusinessCard";
import { serviceCategories, getServiceCategory } from "@/content/services";
import { businessesByCategory } from "@/content/businesses";
import { pageMetadata } from "@/lib/seo";

export async function generateStaticParams() {
  return serviceCategories.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category: slug } = await params;
  const category = getServiceCategory(slug);
  if (!category) {
    return pageMetadata({
      title: "Local Services in Boulder",
      description: "Trusted Boulder area businesses for your stay.",
      path: `/services/${slug}`,
    });
  }
  return pageMetadata({
    title: `${category.name} in Boulder`,
    description: category.blurb,
    path: `/services/${category.slug}`,
    image: category.image,
  });
}

export default async function ServiceCategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category: slug } = await params;
  const category = getServiceCategory(slug);
  if (!category) notFound();

  const list = businessesByCategory(slug);
  const isCareCategory = slug === "child-care" || slug === "pet-care";

  return (
    <section className="mx-auto max-w-7xl px-6 py-[var(--space-section)]">
      <Link href="/services" className="text-sm text-mountain">
        All services
      </Link>

      <div className="mt-6 max-w-2xl">
        <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-copper">
          Local Services
        </p>
        <h1 className="font-heading text-4xl text-charcoal">{category.name}</h1>
        <p className="mt-4 text-base leading-relaxed text-charcoal/70">{category.blurb}</p>
      </div>

      {isCareCategory && (
        <p className="mt-6 max-w-2xl rounded-card bg-mountain/5 px-4 py-3 text-sm leading-relaxed text-charcoal/70">
          Every provider here lists their vetting credentials, references,
          licenses, affiliations, or certifications. Always confirm them directly
          before booking care for your family or pets.
        </p>
      )}

      {list.length > 0 ? (
        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {list.map((b) => (
            <BusinessCard key={b.slug} business={b} />
          ))}
        </div>
      ) : (
        <p className="mt-12 text-base text-charcoal/70">
          We are adding businesses to this category. Check back soon.
        </p>
      )}
    </section>
  );
}
