'use server';

import * as schema from "../db/schema";
import { headers, cookies } from "next/headers";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { db } from "../db";
import { account as accountTable } from "../db/schema/account";
import { guest as guestTable } from "../db/schema/guest";
import { eq } from "drizzle-orm";
import { auth } from ".";

const C_GUEST = "guest_session";
const COOKIE_MAX_AGE_DAYS = 7;

const emailSchema = z.string().email("Invalid email address");
const passwordSchema = z.string().min(8);
const nameSchema = z.string().min(1).optional();

export async function createGuestSession() {
    const cookieStore = await cookies();
    const existing = cookieStore.get(C_GUEST)?.value;
    if (existing) return { sessionToken: existing };

    const sessionToken = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + COOKIE_MAX_AGE_DAYS * 24 * 60 * 60 * 1000);

    await db.insert(guestTable).values({ sessionToken, expiresAt });

    cookieStore.set({
        name: C_GUEST,
        value: sessionToken,
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        path: "/",
        expires: expiresAt,
    });

    return { sessionToken };
}

export async function guestSession() {
    const cookieStore = await cookies();
    const token = cookieStore.get(C_GUEST)?.value;
    if (!token) return null;

    const [g] = await db
        .select()
        .from(guestTable)
        .where(eq(guestTable.sessionToken, token))
        .limit(1);

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
    const nameValue = (name ?? email.split("@")[0]) || "User";
    const body = { email, password, name: nameValue };

    try {
        // Better Auth first
        const res = await auth.api.signUpEmail({ body });

        if (res?.user) {
            await db.insert(accountTable).values({
                userId: res.user.id,
                accountId: email,
                providerId: "credentials",
                password: hashed,
            });

            await mergeGuestCartWithUserCart({ userId: res.user.id });
            return { userId: res.user.id };
        }
    } catch (err) {
        console.error("Better Auth signup failed:", err);
    }

    // Fallback: manual insert
    const [user] = await db
        .insert(schema.user)
        .values({
            name: nameValue,
            email,
            emailVerified: false,
            image: null,
            createdAt: new Date(),
            updatedAt: new Date(),
        })
        .returning();

    if (!user) throw new Error("Failed to create user (Better Auth + fallback both failed)");

    await db.insert(accountTable).values({
        userId: user.id,
        accountId: email,
        providerId: "credentials",
        password: hashed,
    });

    return { userId: user.id };
}

export async function signIn(input: { email: string; password: string }) {
    const email = emailSchema.parse(input.email);
    const password = passwordSchema.parse(input.password);

    try {
        const res = await auth.api.signInEmail({ body: { email, password } });
        if (res?.user) {
            await mergeGuestCartWithUserCart({ userId: res.user.id });
            return { userId: res.user.id };
        }
    } catch (err) {
        console.error("Better Auth signIn failed:", err);
    }

    // Fallback: check credentials manually
    const [account] = await db
        .select()
        .from(accountTable)
        .where(eq(accountTable.accountId, email))
        .limit(1);

    if (!account || !account.password) {
        throw new Error("Invalid credentials");
    }

    const valid = await bcrypt.compare(password, account.password);
    if (!valid) throw new Error("Invalid credentials");

    return { userId: account.userId };
}

export async function signOut() {
    await auth.api.signOut({} as Parameters<typeof auth.api.signOut>[0]);
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

export async function getCurrentUser() {
    try {
        // Wait for the headers to resolve
        const h = new Headers(Object.fromEntries((await headers()).entries()));

        const session = await auth.api.getSession({ headers: h });
        if (session?.user) {
            return {
                id: session.user.id,
                email: session.user.email,
                name: session.user.name,
                isGuest: false,
            };
        }

        const guest = await guestSession();
        if (guest) {
            return {
                id: guest.sessionToken,
                email: null,
                name: "Guest",
                isGuest: true,
            };
        }
        return null;
    } catch (err) {
        console.error("Error fetching current user:", err);
        return null;
    }
}


