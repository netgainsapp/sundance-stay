"use client";

import { useActionState } from "react";
import { submitBoardPost, type PostState } from "@/actions/board-posts";
import { FormStatus } from "./FormStatus";

const initial: PostState = { ok: false };

export function BoardPostForm() {
  const [state, action, pending] = useActionState(submitBoardPost, initial);

  if (state.ok) {
    return (
      <div className="rounded-card border border-mountain/30 bg-mountain/5 p-6">
        <h3 className="font-heading text-lg text-charcoal">Post received</h3>
        <p className="mt-2 text-sm leading-relaxed text-charcoal/70">
          {state.message ?? "Your post is in review and goes live once approved."}
        </p>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-4">
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="absolute left-[-9999px]"
        aria-hidden="true"
      />
      <div>
        <label htmlFor="type" className="block text-sm font-medium text-charcoal">
          I am posting a<span className="text-copper"> *</span>
        </label>
        <select
          id="type"
          name="type"
          required
          defaultValue="need"
          className="mt-1 w-full rounded-card border border-charcoal/20 px-3 py-2 text-sm focus:border-mountain focus:outline-none focus:ring-1 focus:ring-mountain"
        >
          <option value="need">Need a place (traveler)</option>
          <option value="availability">Offer a place (host)</option>
        </select>
      </div>
      <Field label="Area" name="area" placeholder="Downtown Boulder, South Boulder, Louisville" error={state.errors?.area} required />
      <Field label="Dates" name="dates" placeholder="Jan 22 to Jan 26" error={state.errors?.dates} required />
      <Field label="Party size or sleeps" name="partySize" placeholder="4 guests" error={state.errors?.partySize} />
      <Field label="Budget or nightly rate" name="budget" placeholder="Up to $600 a night" error={state.errors?.budget} />
      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-charcoal">
          Details<span className="text-copper"> *</span>
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={4}
          required
          className="mt-1 w-full rounded-card border border-charcoal/20 px-3 py-2 text-sm focus:border-mountain focus:outline-none focus:ring-1 focus:ring-mountain"
        />
        {state.errors?.notes && (
          <p className="mt-1 text-xs text-copper">{state.errors.notes}</p>
        )}
      </div>
      <FormStatus state={state} />
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-card bg-mountain px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-charcoal disabled:opacity-60"
      >
        {pending ? "Posting..." : "Post to the board"}
      </button>
      <p className="text-xs leading-relaxed text-charcoal/50">
        Posting is free. Posts are reviewed before they go live. Do not include
        personal contact details in your post.
      </p>
    </form>
  );
}

function Field({
  label,
  name,
  error,
  required,
  placeholder,
}: {
  label: string;
  name: string;
  error?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-charcoal">
        {label}
        {required && <span className="text-copper"> *</span>}
      </label>
      <input
        id={name}
        name={name}
        type="text"
        required={required}
        placeholder={placeholder}
        className="mt-1 w-full rounded-card border border-charcoal/20 px-3 py-2 text-sm focus:border-mountain focus:outline-none focus:ring-1 focus:ring-mountain"
      />
      {error && <p className="mt-1 text-xs text-copper">{error}</p>}
    </div>
  );
}
