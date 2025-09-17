"use server";

import { cookies } from "next/headers";
import { z } from "zod";
import { db } from "../db";
import { guests } from "../db/schema/guest";
import { eq, lt } from "drizzle-orm";
import { auth } from "./index";

const EMAIL = z.string().email().max(255);
const PASSWORD = z.string().min(8).max(128);
const NAME = z.string().min(1).max(100).optional();

const cookieBase = {
  httpOnly: true as const,
  secure: true as const,
  sameSite: "strict" as const,
  path: "/" as const,
  maxAge: 60 * 60 * 24 * 7, // 7 days
};

const GUEST_COOKIE = "guest_session";

export async function guestSession() {
  const store = await cookies();
  const token = store.get(GUEST_COOKIE)?.value || null;
  return token;
}

export async function createGuestSession() {
  const store = await cookies();
  const existing = store.get(GUEST_COOKIE)?.value;
  if (existing) return existing;

  const sessionToken = crypto.randomUUID();
  const expires = new Date(Date.now() + cookieBase.maxAge * 1000);

  await db.insert(guests).values({
    sessionToken,
    expiresAt: expires,
  });

  store.set(GUEST_COOKIE, sessionToken, { ...cookieBase });

  return sessionToken;
}

const SignUpSchema = z.object({
  email: EMAIL,
  password: PASSWORD,
  name: NAME,
});

export async function signUp(input: z.infer<typeof SignUpSchema>) {
  const data = SignUpSchema.parse(input);
  await mergeGuestCartWithUserCart();
  await clearGuestSession();
  return { ok: true, note: "Sign-up handler placeholder; integrate with Better Auth API." };
}

const SignInSchema = z.object({
  email: EMAIL,
  password: PASSWORD,
});

export async function signIn(input: z.infer<typeof SignInSchema>) {
  const data = SignInSchema.parse(input);
  await mergeGuestCartWithUserCart();
  await clearGuestSession();
  return { ok: true, note: "Sign-in handler placeholder; integrate with Better Auth API." };
}

export async function signOut() {
  await clearGuestSession();
  return { ok: true, note: "Sign-out handler placeholder; integrate with Better Auth API." };
}

export async function mergeGuestCartWithUserCart() {
  return { merged: true };
}

export async function clearGuestSession() {
  const store = await cookies();
  const token = store.get(GUEST_COOKIE)?.value;

  if (token) {
    await db
      .delete(guests)
      .where(eq(guests.sessionToken, token));

    store.delete(GUEST_COOKIE);
  }
  return { cleared: true };
}

export async function cleanupExpiredGuests() {
  await db.delete(guests).where(lt(guests.expiresAt, new Date()));
  return { cleaned: true };
}
