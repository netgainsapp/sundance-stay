"use client";

import { useState } from "react";
import Link from "next/link";

type Option = { label: string; slugs: string[] };
type Question = { q: string; options: Option[] };

const QUESTIONS: Question[] = [
  {
    q: "What is your ideal pace?",
    options: [
      { label: "In the middle of it all", slugs: ["downtown-boulder", "university-hill"] },
      { label: "Quiet, close to trails", slugs: ["south-boulder", "north-boulder"] },
      { label: "A charming small town", slugs: ["louisville", "lafayette", "longmont"] },
      { label: "A big city base", slugs: ["denver", "broomfield"] },
    ],
  },
  {
    q: "What matters most?",
    options: [
      { label: "Dining and walkability", slugs: ["downtown-boulder"] },
      { label: "Trails and the outdoors", slugs: ["south-boulder", "north-boulder"] },
      { label: "Arts and local character", slugs: ["north-boulder", "lafayette"] },
      { label: "Space and value", slugs: ["longmont", "louisville"] },
      { label: "Airport access and central", slugs: ["broomfield"] },
    ],
  },
  {
    q: "Who is coming?",
    options: [
      { label: "Couple or friends, want nightlife", slugs: ["downtown-boulder", "university-hill"] },
      { label: "Family, want room to spread out", slugs: ["south-boulder", "louisville"] },
      { label: "Just need an easy base", slugs: ["broomfield", "denver"] },
    ],
  },
];

export function NeighborhoodQuiz({
  neighborhoods,
}: {
  neighborhoods: { slug: string; name: string }[];
}) {
  const [step, setStep] = useState(0);
  const [scores, setScores] = useState<Record<string, number>>({});

  const nameOf = (slug: string) =>
    neighborhoods.find((n) => n.slug === slug)?.name ?? slug;

  function choose(option: Option) {
    setScores((prev) => {
      const next = { ...prev };
      for (const s of option.slugs) next[s] = (next[s] ?? 0) + 1;
      return next;
    });
    setStep((s) => s + 1);
  }

  function reset() {
    setScores({});
    setStep(0);
  }

  const done = step >= QUESTIONS.length;
  const winner =
    Object.entries(scores).sort((a, b) => b[1] - a[1])[0]?.[0] ??
    "downtown-boulder";

  if (done) {
    return (
      <div className="rounded-card border border-mountain bg-mountain/5 p-8 text-center ring-1 ring-mountain">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-copper">
          Your best fit
        </p>
        <h3 className="mt-2 font-heading text-3xl text-charcoal">
          {nameOf(winner)}
        </h3>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
          <a
            href={`#${winner}`}
            className="rounded-card border border-charcoal px-6 py-3 text-sm font-medium text-charcoal transition-colors hover:bg-charcoal hover:text-white"
          >
            Read about {nameOf(winner)}
          </a>
          <Link
            href={`/stay?neighborhood=${winner}`}
            className="rounded-card bg-mountain px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-charcoal"
          >
            View homes there
          </Link>
        </div>
        <button
          onClick={reset}
          className="mt-6 text-xs text-charcoal/50 underline hover:text-charcoal"
        >
          Start over
        </button>
      </div>
    );
  }

  const question = QUESTIONS[step];
  return (
    <div className="rounded-card border border-charcoal/10 p-8">
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-copper">
        Question {step + 1} of {QUESTIONS.length}
      </p>
      <h3 className="mt-2 font-heading text-2xl text-charcoal">{question.q}</h3>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {question.options.map((option) => (
          <button
            key={option.label}
            onClick={() => choose(option)}
            className="rounded-card border border-charcoal/15 px-4 py-3 text-left text-sm text-charcoal/80 transition-colors hover:border-mountain hover:bg-mountain/5 hover:text-mountain"
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
