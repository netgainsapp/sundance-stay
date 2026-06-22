/**
 * Renders long-form markdown-lite content: blocks separated by blank lines,
 * "## " section headings, and "- " bullet lists. Shared by guides and blog.
 */
export function ArticleBody({ content }: { content: string }) {
  const blocks = content.trim().split(/\n\n+/);
  return (
    <>
      {blocks.map((block, i) => {
        const trimmed = block.trim();
        if (trimmed.startsWith("## ")) {
          return (
            <h2
              key={i}
              className="mt-12 font-heading text-2xl text-charcoal first:mt-0"
            >
              {trimmed.slice(3).trim()}
            </h2>
          );
        }
        const lines = trimmed.split(/\n/);
        if (lines.every((l) => l.trim().startsWith("- "))) {
          return (
            <ul key={i} className="mt-5 space-y-2">
              {lines.map((l, j) => (
                <li
                  key={j}
                  className="flex items-start gap-3 leading-relaxed text-charcoal/80"
                >
                  <span
                    aria-hidden="true"
                    className="mt-2 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-copper"
                  />
                  <span>{l.trim().slice(2)}</span>
                </li>
              ))}
            </ul>
          );
        }
        return (
          <p
            key={i}
            className={`leading-relaxed text-charcoal/80 ${
              i === 0 ? "text-lg" : "mt-5"
            }`}
          >
            {trimmed}
          </p>
        );
      })}
    </>
  );
}
