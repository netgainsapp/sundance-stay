/**
 * Stateless admin session token, signed with HMAC-SHA256 via Web Crypto so it
 * verifies in both the Node runtime (server actions) and the edge runtime
 * (middleware). Token format: `<base64url(payload)>.<base64url(hmac)>` where
 * payload is `{ exp: <unix seconds> }`.
 */

// The __Host- prefix forces the browser to require Secure + path=/ + no Domain,
// which hardens against subdomain and downgrade attacks. It requires HTTPS, so
// it is only used in production (local dev runs over plain http).
export const COOKIE_NAME =
  process.env.NODE_ENV === "production"
    ? "__Host-sundance_admin"
    : "sundance_admin";
export const MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

function getSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) throw new Error("ADMIN_SESSION_SECRET is not set");
  return secret;
}

function toBase64url(bytes: Uint8Array): string {
  let binary = "";
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64url(str: string): Uint8Array {
  const padded = str.replace(/-/g, "+").replace(/_/g, "/");
  const binary = atob(padded + "=".repeat((4 - (padded.length % 4)) % 4));
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

async function sign(data: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(data));
  return toBase64url(new Uint8Array(sig));
}

/**
 * Constant-time string comparison. Loops over the longer input and folds any
 * length difference into the result, so it does not early-return on a length
 * mismatch (which would leak length via timing).
 */
function safeEqual(a: string, b: string): boolean {
  const ab = new TextEncoder().encode(a);
  const bb = new TextEncoder().encode(b);
  const len = Math.max(ab.length, bb.length);
  let mismatch = ab.length ^ bb.length;
  for (let i = 0; i < len; i++) {
    mismatch |= (ab[i] ?? 0) ^ (bb[i] ?? 0);
  }
  return mismatch === 0;
}

export async function createSessionToken(nowMs: number = Date.now()): Promise<string> {
  const payload = toBase64url(
    new TextEncoder().encode(
      JSON.stringify({ exp: Math.floor(nowMs / 1000) + MAX_AGE_SECONDS }),
    ),
  );
  const sig = await sign(payload, getSecret());
  return `${payload}.${sig}`;
}

export async function verifySessionToken(
  token: string | undefined | null,
  nowMs: number = Date.now(),
): Promise<boolean> {
  if (!token) return false;
  const dot = token.indexOf(".");
  if (dot <= 0) return false;
  const payload = token.slice(0, dot);
  const sig = token.slice(dot + 1);

  const expected = await sign(payload, getSecret());
  if (!safeEqual(sig, expected)) return false;

  try {
    const data = JSON.parse(new TextDecoder().decode(fromBase64url(payload)));
    return typeof data.exp === "number" && data.exp > Math.floor(nowMs / 1000);
  } catch {
    return false;
  }
}
