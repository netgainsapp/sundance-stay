import Image from "next/image";
import Link from "next/link";
import type { Business } from "@/content/types";

export function BusinessCard({ business }: { business: Business }) {
  return (
    <Link href={`/business/${business.slug}`} className="group block overflow-hidden rounded-card bg-white shadow-sm ring-1 ring-charcoal/5 transition-shadow hover:shadow-lg">
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image src={business.coverImage} alt={business.name} fill sizes="(max-width:768px) 100vw, 33vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
      </div>
      <div className="p-5">
        <h3 className="font-heading text-xl text-charcoal">{business.name}</h3>
        <p className="mt-1 text-sm text-charcoal/60">{business.serviceArea}</p>
        <p className="mt-3 text-sm text-charcoal/70">{business.services.slice(0, 2).join(", ")}</p>
      </div>
    </Link>
  );
}
