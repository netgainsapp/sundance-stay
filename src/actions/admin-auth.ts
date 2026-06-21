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
import { checkRateLimit } from "@/lib/rate-limit";
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
  if (!checkRateLimit(`admin-login:${ip}`).ok) {
    return { error: "Too many attempts. Please wait a few minutes and try again." };
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
    return { error: "Invalid email or password." };
  }

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
