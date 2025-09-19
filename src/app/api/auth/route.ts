import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { type, ...data } = body || {};

    if (type === "sign-up") {
      const res = await auth.api.signUpEmail({ body: data, request: req });
      return NextResponse.json({ ok: true, userId: res.user?.id });
    }

    if (type === "sign-in") {
      const res = await auth.api.signInEmail({ body: data, request: req });
      return NextResponse.json({ ok: true, userId: res.user?.id });
    }

    if (type === "sign-out") {
      await auth.api.signOut({ request: req });
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ ok: false, error: "Unknown action" }, { status: 400 });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Auth failed";
    console.error("Auth error:", e);
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");

    if (type === "session") {
      const session = await auth.api.getSession({ request: req });
      return NextResponse.json({ ok: true, session });
    }

    return NextResponse.json({ ok: false, error: "Unknown action" }, { status: 400 });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Auth failed";
    console.error("Auth error:", e);
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
