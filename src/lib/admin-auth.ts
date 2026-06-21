import { cookies } from "next/headers";
import { verifySessionToken, COOKIE_NAME } from "./admin-session";

/** True when the current request carries a valid admin session cookie. */
export async function isAdminAuthed(): Promise<boolean> {
  const store = await cookies();
  return verifySessionToken(store.get(COOKIE_NAME)?.value);
}

/** Throws when the caller is not an authenticated admin. Use in server actions. */
export async function requireAdmin(): Promise<void> {
  if (!(await isAdminAuthed())) throw new Error("Unauthorized");
}
