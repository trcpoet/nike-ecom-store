"use server";

import {cookies, headers} from "next/headers";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { guest} from "@/lib/db/schema/index";
import { and, eq, lt } from "drizzle-orm";
import { randomUUID } from "crypto";

const IS_PROD = process.env.NODE_ENV === "production";
const COOKIE_OPTIONS = {
    httpOnly: true as const,
    secure: true as const,
    sameSite: "strict" as const,
    path: "/" as const,
    maxAge: 60 * 60 * 24 * 7, // 7 days
};

const emailSchema = z.string().email();
const passwordSchema = z.string().min(8).max(128);
const nameSchema = z.string().min(1).max(100);

export async function createGuestSession() {
    const cookieStore = cookies();
    const existing = (await cookieStore).get("guest_session");
    if (existing?.value) return { ok: true, sessionToken: existing.value };


    const sessionToken = randomUUID();
    const expiresAt = new Date(Date.now() + COOKIE_OPTIONS.maxAge * 1000);
    await db.insert(guest).values({ sessionToken, expiresAt });

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
    await db
        .delete(guest)
        .where(and(eq(guest.sessionToken, token), lt(guest.expiresAt, now)));

    return { sessionToken: token };
}

const signUpSchema = z.object({
    email: emailSchema,
    password: passwordSchema,
    name: nameSchema,
});

export async function signUp(formData: FormData) {
    const rawData = {
        name: formData.get('name') as string,
        email: formData.get('email') as string,
        password: formData.get('password') as string,
    }
    const data = signUpSchema.parse(rawData);

    // ✅ forward request headers so the auth API can set/read cookies/CSRF, etc.
    const res = await auth.api.signUpEmail({
        body: {
            email: data.email,
            password: data.password,
            name: data.name
        },  headers: await headers(),
    });

    await migrateGuestToUser();
    return { ok: true, userId: res.user?.id };
}

const signInSchema = z.object({
    email: emailSchema,
    password: passwordSchema,
});

export async function signIn(formData: FormData) {
    const rawData = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
    };
    const data = signInSchema.parse(rawData);

    const res = await auth.api.signInEmail({
        body: {
            email: data.email,
            password: data.password
        }, headers: await headers(), // ✅
    });

    await migrateGuestToUser();
    return { ok: true, userId: res.user?.id };
}

export async function getCurrentUser() {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        })

        return session?.user ?? null;
    } catch (e) {
        console.log(e);
        return null;
    }
}

export async function signOut() {
    await auth.api.signOut({ headers: await headers() });
    return { ok: true };
}

export async function mergeGuestCartWithUserCart() {
    await migrateGuestToUser();
    return { ok: true };
}

async function migrateGuestToUser() {
    const cookieStore = cookies();
    const token = (await (cookieStore)).get("guest_session")?.value;
    if (!token) return;

    await db.delete(guest).where(eq(guest.sessionToken, token));
    (await cookieStore).delete("guest_session");
}