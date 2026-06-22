/**
 * Deterministic, unique SVG cover art for a blog post, derived from its slug.
 * Flatiron-style layered ridges in the brand palette. Because the composition
 * is seeded by the slug, two posts can never share a cover. No external image,
 * no network request. Renders as a full-bleed background (slice = object-cover).
 */

const PALETTE = {
  charcoal: "#1F2933",
  mountain: "#1D4E89",
  sand: "#D9C4A1",
  copper: "#B87333",
};

// Sky gradient pairs (top, bottom), each on-brand.
const SKIES: [string, string][] = [
  ["#1D4E89", "#D9C4A1"], // day: mountain to sand
  ["#B87333", "#E8D4B0"], // dawn: copper to light sand
  ["#1F2933", "#1D4E89"], // dusk: charcoal to mountain
  ["#2C5F9E", "#E7D8BD"], // bright alpine
  ["#3A3140", "#B87333"], // late dusk to copper
];
const SUNS = ["#F2E4C9", "#E8B07A", "#F4D9A6", "#D9C4A1"];

function hashSeed(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function rng(seed: number): () => number {
  let a = seed || 1;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const W = 1200;
const H = 675;

function ridgePath(baseY: number, amp: number, segments: number, r: () => number): string {
  const step = W / segments;
  const pts: string[] = [`M0,${H}`, `L0,${baseY - r() * amp}`];
  for (let i = 1; i <= segments; i++) {
    pts.push(`L${Math.round(i * step)},${Math.round(baseY - r() * amp)}`);
  }
  pts.push(`L${W},${H}`, "Z");
  return pts.join(" ");
}

export function BlogCover({
  seed,
  className,
}: {
  seed: string;
  className?: string;
}) {
  const r = rng(hashSeed(seed));
  const sky = SKIES[Math.floor(r() * SKIES.length)];
  const sun = SUNS[Math.floor(r() * SUNS.length)];
  const sunX = 180 + r() * 840;
  const sunY = 150 + r() * 130;
  const sunR = 70 + r() * 60;
  const gid = `sky-${hashSeed(seed).toString(36)}`;

  // A few atmosphere dots in the sky.
  const dots = Array.from({ length: 7 }, () => ({
    x: Math.round(r() * W),
    y: Math.round(r() * 260),
    rad: 1 + r() * 2.5,
  }));

  // Front-ridge Flatiron slabs (steep tilted slabs leaning right).
  const slabBaseX = 380 + r() * 320;
  const slabW = 120 + r() * 70;
  const slabH = 230 + r() * 90;
  const lean = 60 + r() * 50;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid slice"
      className={className}
      role="img"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={sky[0]} />
          <stop offset="100%" stopColor={sky[1]} />
        </linearGradient>
      </defs>

      <rect width={W} height={H} fill={`url(#${gid})`} />

      {dots.map((d, i) => (
        <circle key={i} cx={d.x} cy={d.y} r={d.rad} fill="#ffffff" opacity={0.5} />
      ))}

      <circle cx={sunX} cy={sunY} r={sunR} fill={sun} opacity={0.92} />

      {/* Back ridge */}
      <path d={ridgePath(440, 110, 6, r)} fill={PALETTE.mountain} opacity={0.7} />
      {/* Mid ridge */}
      <path d={ridgePath(510, 140, 7, r)} fill="#27496d" />
      {/* Flatiron slabs on the front face */}
      <polygon
        points={`${slabBaseX},560 ${slabBaseX + slabW},${560 - slabH} ${slabBaseX + slabW + lean},${560 - slabH + 70} ${slabBaseX + lean},${590}`}
        fill="#172029"
        opacity={0.95}
      />
      <polygon
        points={`${slabBaseX + slabW + 40},575 ${slabBaseX + slabW * 1.6 + 40},${575 - slabH * 0.8} ${slabBaseX + slabW * 1.6 + lean + 40},${575 - slabH * 0.8 + 60} ${slabBaseX + slabW + lean + 40},600`}
        fill="#10161d"
        opacity={0.95}
      />
      {/* Front ridge */}
      <path d={ridgePath(585, 80, 9, r)} fill={PALETTE.charcoal} />
    </svg>
  );
}
