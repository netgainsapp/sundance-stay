import Link from "next/link";
import { SITE } from "@/lib/site";

export function Footer() {
  const navCol1 = SITE.nav.slice(0, 5);
  const navCol2 = SITE.nav.slice(5, 10);

  return (
    <footer className="mt-[var(--space-section)] border-t border-charcoal/10 bg-charcoal text-white/80">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-6">
        <div className="md:col-span-2">
          <p className="font-heading text-lg text-white">
            {SITE.name}
          </p>
          <p className="mt-3 max-w-md text-sm leading-relaxed">
            {SITE.description}
          </p>
        </div>
        <nav
          aria-label="Footer navigation column 1"
          className="flex flex-col gap-2 text-sm"
        >
          {navCol1.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-sand">
              {item.label}
            </Link>
          ))}
        </nav>
        <nav
          aria-label="Footer navigation column 2"
          className="flex flex-col gap-2 text-sm"
        >
          {navCol2.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-sand">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="md:col-span-1 text-sm">
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
