/**
 * Magic link tokens. The raw token travels in the email link; only its SHA-256
 * hash is stored, so a database read never exposes a usable token. Tokens are
 * single use and short lived.
 */

export const MAGIC_LINK_TTL_MS = 1000 * 60 * 30; // 30 minutes

/** A URL-safe random token (the raw value emailed to the user). */
export function generateRawToken(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  let binary = "";
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

/** SHA-256 hex hash of a raw token, for storage and lookup. */
export async function hashToken(raw: string): Promise<string> {
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(raw),
  );
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
