"use client";

import { useActionState } from "react";
import { reportContent, type ReportState } from "@/actions/board-report";

const initial: ReportState = { ok: false };
const REASONS = [
  "Spam or scam",
  "Inappropriate content",
  "Suspicious or unsafe",
  "Other",
];

export function ReportForm({
  targetType,
  targetId,
}: {
  targetType: "post" | "thread";
  targetId: string;
}) {
  const action = reportContent.bind(null, targetType, targetId);
  const [state, formAction, pending] = useActionState(action, initial);

  if (state.ok) {
    return <p className="mt-4 text-xs text-charcoal/50">{state.message}</p>;
  }

  return (
    <details className="mt-4">
      <summary className="cursor-pointer text-xs text-charcoal/50 underline">
        Report this {targetType === "post" ? "post" : "conversation"}
      </summary>
      <form action={formAction} className="mt-2 flex flex-wrap items-center gap-2">
        <select
          name="reason"
          required
          defaultValue=""
          className="rounded-card border border-charcoal/20 px-2 py-1 text-xs focus:border-mountain focus:outline-none"
        >
          <option value="" disabled>
            Choose a reason
          </option>
          {REASONS.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
        <button
          type="submit"
          disabled={pending}
          className="rounded-card border border-charcoal/20 px-3 py-1 text-xs text-charcoal/70 transition-colors hover:bg-charcoal/5 disabled:opacity-60"
        >
          {pending ? "Sending..." : "Submit report"}
        </button>
        {state.message && (
          <span className="text-xs text-copper">{state.message}</span>
        )}
      </form>
    </details>
  );
}
