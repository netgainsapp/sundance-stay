import type { Neighborhood } from "@/content/types";

// In-city Boulder neighborhoods, colored differently from the surrounding towns.
const BOULDER_SLUGS = new Set([
  "downtown-boulder",
  "university-hill",
  "north-boulder",
  "south-boulder",
]);

// Colors mirror the design tokens (charcoal, mountain, sand, copper). Inline
// hex is used so the standalone SVG renders reliably.
const CHARCOAL = "#1f2933";
const MOUNTAIN = "#1d4e89";
const SAND = "#d9c4a1";
const COPPER = "#b87333";

export function AreaMap({ neighborhoods }: { neighborhoods: Neighborhood[] }) {
  return (
    <div className="overflow-hidden rounded-card border border-charcoal/10 bg-sand/10">
      <svg
        viewBox="0 0 100 100"
        role="img"
        aria-label="Orientation map of Boulder area neighborhoods, from the Flatirons in the west to Denver in the southeast"
        className="h-auto w-full"
      >
        {/* Foothills band on the west edge */}
        <path
          d="M0 0 L0 100 L14 100 L10 78 L15 60 L9 44 L16 28 L11 12 L14 0 Z"
          fill={SAND}
          opacity="0.5"
        />
        <path
          d="M2 40 L6 30 L10 40 Z M7 56 L12 44 L16 56 Z M3 70 L8 58 L12 70 Z"
          fill={MOUNTAIN}
          opacity="0.35"
        />
        <text x="8" y="94" fontSize="2.6" fill={CHARCOAL} opacity="0.5">
          Flatirons
        </text>

        {neighborhoods.map((n) => {
          const inBoulder = BOULDER_SLUGS.has(n.slug);
          return (
            <g key={n.slug}>
              <circle
                cx={n.mapX}
                cy={n.mapY}
                r={2}
                fill={inBoulder ? COPPER : MOUNTAIN}
              />
              <text
                x={n.mapX}
                y={n.mapY - 3}
                fontSize="2.8"
                textAnchor="middle"
                fill={CHARCOAL}
                fontWeight="500"
              >
                {n.name}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
