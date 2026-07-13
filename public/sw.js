// Minimal service worker: enables PWA installability and a graceful offline
// message. Deliberately does NOT cache app pages or assets, so deploys are
// never masked by a stale cache. Web push lands here later (December).
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});
self.addEventListener("fetch", (event) => {
  if (event.request.mode !== "navigate") return;
  event.respondWith(
    fetch(event.request).catch(
      () =>
        new Response(
          "<!doctype html><meta charset='utf-8'><title>Offline</title><body style='font-family:Georgia,serif;background:#F7F3EA;color:#22272B;display:flex;min-height:100vh;align-items:center;justify-content:center;text-align:center'><div><h1>You are offline</h1><p>Boulder Film Collective will be here when you reconnect.</p></div>",
          { headers: { "content-type": "text/html; charset=utf-8" } },
        ),
    ),
  );
});
