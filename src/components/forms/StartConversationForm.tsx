"use client";

import { useActionState } from "react";
import { startThread, type MsgState } from "@/actions/board-threads";

const initial: MsgState = { ok: false };

export function StartConversationForm({ postId }: { postId: string }) {
  const action = startThread.bind(null, postId);
  const [state, formAction, pending] = useActionState(action, initial);

  return (
    <form action={formAction} className="space-y-3">
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="absolute left-[-9999px]"
        aria-hidden="true"
      />
      <textarea
        name="body"
        rows={4}
        required
        placeholder="Introduce yourself and share what you are looking for. Keep contact details for the chat."
        className="w-full rounded-card border border-charcoal/20 px-3 py-2 text-sm focus:border-mountain focus:outline-none focus:ring-1 focus:ring-mountain"
      />
      {state.error && <p className="text-xs text-copper">{state.error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="rounded-card bg-mountain px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-charcoal disabled:opacity-60"
      >
        {pending ? "Sending..." : "Send and start the conversation"}
      </button>
    </form>
  );
}
