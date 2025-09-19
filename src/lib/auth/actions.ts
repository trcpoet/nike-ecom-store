'use server';

import { cookies } from 'next/headers';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { db } from '../db';
import { account as accountTable } from '../db/schema/account';
import { guest as guestTable } from '../db/schema/guest';
import { eq } from 'drizzle-orm';
import { auth } from '.';

const C_GUEST = 'guest_session';
const COOKIE_MAX_AGE_DAYS = 7;

const emailSchema = z.string().email();
const passwordSchema = z.string().min(8);
const nameSchema = z.string().min(1).optional();

export async function createGuestSession() {
  const cookieStore = await cookies();
  const existing = cookieStore.get(C_GUEST)?.value;
  if (existing) {
    return { sessionToken: existing };
  }
  const sessionToken = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + COOKIE_MAX_AGE_DAYS * 24 * 60 * 60 * 1000);

  await db.insert(guestTable).values({
    sessionToken,
    expiresAt,
  });

  cookieStore.set({
    name: C_GUEST,
    value: sessionToken,
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    path: '/',
    expires: expiresAt,
  });

  return { sessionToken };
}

export async function guestSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(C_GUEST)?.value;
  if (!token) return null;

  const [g] = await db.select().from(guestTable).where(eq(guestTable.sessionToken, token)).limit(1);
  if (!g) return null;
  if (g.expiresAt && g.expiresAt < new Date()) {
    await db.delete(guestTable).where(eq(guestTable.sessionToken, token));
    cookieStore.delete(C_GUEST);
    return null;
  }
  return g;
}

export async function signUp(input: { email: string; password: string; name?: string }) {
  const email = emailSchema.parse(input.email);
  const password = passwordSchema.parse(input.password);
  const name = nameSchema.parse(input.name);

  const hashed = await bcrypt.hash(password, 10);

  const nameValue = name ?? email.split('@')[0] || 'User';
  const body: { email: string; password: string; name: string } = { email, password, name: nameValue };

  const res = await auth.api.signUpEmail({ body });

  if (!res?.user) {
    throw new Error('Sign up failed');
  }

  await db.insert(accountTable).values({
    userId: res.user.id,
    accountId: email,
    providerId: 'credentials',
    password: hashed,
  });

  await mergeGuestCartWithUserCart({ userId: res.user.id });

  return { userId: res.user.id };
}

export async function signIn(input: { email: string; password: string }) {
  const email = emailSchema.parse(input.email);
  const password = passwordSchema.parse(input.password);

  const res = await auth.api.signInEmail({
    body: { email, password },
  });

  if (!res?.user) {
    throw new Error('Invalid credentials');
  }

  await mergeGuestCartWithUserCart({ userId: res.user.id });

  return { userId: res.user.id };
}

export async function signOut() {
  await auth.api.signOut({ method: 'POST' });
  return { ok: true };
}

export async function mergeGuestCartWithUserCart({ userId }: { userId: string }) {
  const cookieStore = await cookies();
  const token = cookieStore.get(C_GUEST)?.value;
  if (!token) return { ok: true };


  await db.delete(guestTable).where(eq(guestTable.sessionToken, token));
  cookieStore.delete(C_GUEST);

  return { ok: true, userId };
}
