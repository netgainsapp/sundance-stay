import Link from "next/link";
import { SITE } from "@/lib/site";

export function Footer() {
  return (
    <footer className="mt-[var(--space-section)] border-t border-charcoal/10 bg-charcoal text-white/80">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <p className="font-heading text-lg text-white">
            Sundance Stay Collective
          </p>
          <p className="mt-3 max-w-md text-sm leading-relaxed">
            {SITE.description}
          </p>
        </div>
        <nav
          aria-label="Footer navigation"
          className="flex flex-col gap-2 text-sm"
        >
          {SITE.nav.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-sand">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="text-sm">
          <p className="text-white">Boulder, Colorado</p>
          <p className="mt-2">Festival Season and year round.</p>
        </div>
      </div>
      <div className="border-t border-white/10">
        <p className="mx-auto max-w-7xl px-6 py-6 text-xs leading-relaxed text-white/60">
          {SITE.disclaimer}
        </p>
      </div>
    </footer>
  );
}
