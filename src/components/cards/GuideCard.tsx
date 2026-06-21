import Image from "next/image";
import Link from "next/link";
import type { Guide } from "@/content/types";

export function GuideCard({ guide }: { guide: Guide }) {
  return (
    <Link href={`/guides/${guide.slug}`} className="group block overflow-hidden rounded-card bg-white shadow-sm ring-1 ring-charcoal/5 transition-shadow hover:shadow-lg">
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image src={guide.featuredImage} alt={guide.title} fill sizes="(max-width:768px) 100vw, 33vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
      </div>
      <div className="p-5">
        <p className="text-xs uppercase tracking-[0.2em] text-copper">{guide.category}</p>
        <h3 className="mt-2 font-heading text-lg text-charcoal">{guide.title}</h3>
        <p className="mt-2 text-sm text-charcoal/70">{guide.excerpt}</p>
      </div>
    </Link>
  );
}
