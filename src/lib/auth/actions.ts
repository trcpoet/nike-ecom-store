"use server";

import { cookies, headers } from "next/headers";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { guests } from "@/lib/db/schema/index";
import { and, eq, lt } from "drizzle-orm";
import { randomUUID } from "crypto";

const COOKIE_OPTIONS = {
  httpOnly: true as const,
  secure: true as const,
  sameSite: "strict" as const,
  path: "/" as const,
  maxAge: 60 * 60 * 24 * 7,
};

const emailSchema = z.string().email();
const passwordSchema = z.string().min(8).max(128);
const nameSchema = z.string().min(1).max(100);

export async function createGuestSession() {
  const cookieStore = await cookies();
  const existing = (await cookieStore).get("guest_session");
  if (existing?.value) {
    return { ok: true, sessionToken: existing.value };
  }

  const sessionToken = randomUUID();
  const now = new Date();
  const expiresAt = new Date(now.getTime() + COOKIE_OPTIONS.maxAge * 1000);

  await db.insert(guests).values({
    sessionToken,
    expiresAt,
  });

  (await cookieStore).set("guest_session", sessionToken, COOKIE_OPTIONS);
  return { ok: true, sessionToken };
}

export async function guestSession() {
  const cookieStore = await cookies();
  const token = (await cookieStore).get("guest_session")?.value;
  if (!token) {
    return { sessionToken: null };
  }
  const now = new Date();
  await db.delete(guests).where(and(eq(guests.sessionToken, token), lt(guests.expiresAt, now)));
  return { sessionToken: token };
}

const SignUpSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  name: nameSchema,
});

export async function signUp(input: z.infer<typeof SignUpSchema>) {
  const parsed = SignUpSchema.parse(input);
  const res = await fetch("/api/auth", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type: "sign-up", ...parsed }),
  });
  const data = await res.json();
  if (!res.ok || !data?.ok) throw new Error(data?.error || "Failed to create user");
  await mergeGuestCartWithUserCart();
  await clearGuestSession();
  return data;
}

const SignInSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export async function signIn(input: z.infer<typeof SignInSchema>) {
  const parsed = SignInSchema.parse(input);
  const res = await fetch("/api/auth", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type: "sign-in", ...parsed }),
  });
  const data = await res.json();
  if (!res.ok || !data?.ok) throw new Error(data?.error || "Failed to sign in");
  await mergeGuestCartWithUserCart();
  await clearGuestSession();
  return data;
}

export async function getCurrentUser() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    return session?.user ?? null;
  } catch {
    return null;
  }
}

export async function signOut() {
  const res = await fetch("/api/auth", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type: "sign-out" }),
  });
  const data = await res.json();
  if (!res.ok || !data?.ok) throw new Error(data?.error || "Failed to sign out");
  await clearGuestSession();
  return data;
}

export async function mergeGuestCartWithUserCart() {
  await migrateGuestToUser();
  return { ok: true };
}

export async function clearGuestSession() {
  const cookieStore = await cookies();
  const token = (await cookieStore).get("guest_session")?.value;
  if (token) {
    await db.delete(guests).where(eq(guests.sessionToken, token));
    (await cookieStore).delete("guest_session");
  }
  return { cleared: true };
}

async function migrateGuestToUser() {
  const cookieStore = await cookies();
  const token = (await cookieStore).get("guest_session")?.value;
  if (!token) return;
  await db.delete(guests).where(eq(guests.sessionToken, token));
  (await cookieStore).delete("guest_session");
}
