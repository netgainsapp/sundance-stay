export function SectionHeader({ eyebrow, title, intro, align = "left" }: { eyebrow?: string; title: string; intro?: string; align?: "left" | "center" }) {
  return (
    <div className={align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      {eyebrow && <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-copper">{eyebrow}</p>}
      <h2 className="font-heading text-3xl text-charcoal md:text-4xl">{title}</h2>
      {intro && <p className="mt-4 text-base leading-relaxed text-charcoal/70">{intro}</p>}
    </div>
  );
}
