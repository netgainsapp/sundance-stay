"use client";

import { useRouter, useSearchParams } from "next/navigation";

type Props = {
  neighborhoods: { slug: string; name: string }[];
  current: Record<string, string>;
};

const PROPERTY_TYPES = ["House", "Condo", "Cabin", "Loft", "Townhome"];
const GUESTS = ["2", "4", "6", "8", "10"];
const BEDROOMS = ["1", "2", "3", "4"];
const BATHROOMS = ["1", "2", "3"];

const selectClass =
  "rounded-card border border-charcoal/20 px-3 py-2 text-sm focus:border-mountain focus:outline-none focus:ring-1 focus:ring-mountain";

export function StayFilters({ neighborhoods, current }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const onChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/stay?${params.toString()}`);
  };

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end">
      <label className="flex flex-col gap-1 text-xs font-medium uppercase tracking-wide text-charcoal/60">
        Neighborhood
        <select
          className={selectClass}
          value={current.neighborhood ?? ""}
          onChange={(e) => onChange("neighborhood", e.target.value)}
        >
          <option value="">Any neighborhood</option>
          {neighborhoods.map((n) => (
            <option key={n.slug} value={n.slug}>
              {n.name}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1 text-xs font-medium uppercase tracking-wide text-charcoal/60">
        Property type
        <select
          className={selectClass}
          value={current.type ?? ""}
          onChange={(e) => onChange("type", e.target.value)}
        >
          <option value="">Any</option>
          {PROPERTY_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1 text-xs font-medium uppercase tracking-wide text-charcoal/60">
        Guests
        <select
          className={selectClass}
          value={current.guests ?? ""}
          onChange={(e) => onChange("guests", e.target.value)}
        >
          <option value="">Any</option>
          {GUESTS.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1 text-xs font-medium uppercase tracking-wide text-charcoal/60">
        Bedrooms
        <select
          className={selectClass}
          value={current.bedrooms ?? ""}
          onChange={(e) => onChange("bedrooms", e.target.value)}
        >
          <option value="">Any</option>
          {BEDROOMS.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1 text-xs font-medium uppercase tracking-wide text-charcoal/60">
        Bathrooms
        <select
          className={selectClass}
          value={current.bathrooms ?? ""}
          onChange={(e) => onChange("bathrooms", e.target.value)}
        >
          <option value="">Any</option>
          {BATHROOMS.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>
      </label>

      <label className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-charcoal/60 sm:pb-2">
        <input
          type="checkbox"
          checked={current.shortNotice === "1"}
          onChange={(e) => onChange("shortNotice", e.target.checked ? "1" : "")}
          className="h-4 w-4 rounded border-charcoal/30 text-mountain focus:ring-mountain"
        />
        Short notice
      </label>
    </div>
  );
}
