import type { FormState } from "@/actions/submit-lead";

export function FormStatus({ state }: { state: FormState }) {
  if (!state.message) return null;
  return (
    <p role="status" className={`rounded-card px-4 py-3 text-sm ${state.ok ? "bg-mountain/10 text-mountain" : "bg-copper/10 text-copper"}`}>
      {state.message}
    </p>
  );
}
