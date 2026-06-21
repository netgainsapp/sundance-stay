"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { z } from "zod";
import {
  createSessionToken,
  COOKIE_NAME,
  MAX_AGE_SECONDS,
} from "@/lib/admin-session";
import {
  isLoginLocked,
  recordLoginFailure,
  clearLoginFailures,
} from "@/lib/login-guard";
import { clientIp } from "@/lib/request";

const loginSchema = z.object({
  email: z.string().min(1),
  password: z.string().min(1),
});

export type LoginState = { error?: string };

export async function login(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const hdrs = await headers();
  const ip = clientIp(hdrs);

  const lock = await isLoginLocked(ip);
  if (lock.locked) {
    const mins = Math.max(1, Math.ceil((lock.retryAfterSec ?? 60) / 60));
    return { error: `Too many attempts. Try again in about ${mins} minutes.` };
  }

  const parsed = loginSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return { error: "Enter your email and password." };
  }

  const email = process.env.ADMIN_EMAIL;
  const hash = process.env.ADMIN_PASSWORD_HASH;
  if (!email || !hash) {
    return { error: "Admin login is not configured." };
  }

  const emailOk = parsed.data.email.trim().toLowerCase() === email.toLowerCase();
  // Always run bcrypt so timing does not reveal whether the email matched.
  const passOk = await bcrypt.compare(parsed.data.password, hash);
  if (!emailOk || !passOk) {
    await recordLoginFailure(ip);
    return { error: "Invalid email or password." };
  }

  await clearLoginFailures(ip);

  const token = await createSessionToken();
  const store = await cookies();
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });

  redirect("/admin");
}

export async function logout(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE_NAME);
  redirect("/admin/login");
}
