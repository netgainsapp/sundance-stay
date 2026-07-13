"use client";

import { useEffect } from "react";

/** Registers the minimal service worker that makes the site installable. */
export function RegisterSW() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // Non-fatal: the site works identically without the worker.
      });
    }
  }, []);
  return null;
}
