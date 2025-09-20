import Link from "next/link";
import AuthForm from "@/components/AuthForm";
import { redirect } from "next/navigation";
import { signUp } from "@/lib/auth/actions";
import {auth} from "@/lib/auth";
import React from "react";

export default async function Page() {
  async function action(formData: FormData) {
    "use server";
    const name = formData.get("name") ? String(formData.get("name")) : undefined;
    const email = String(formData.get("email") || "");
    const password = String(formData.get("password") || "");
    await signUp({ email, password, name });
    redirect("/");
  }


    return (
    <>
      <div className="mb-2 text-center text-body text-dark-700">
        <span>Already have an account? </span>
        <Link href="/sign-in" className="underline hover:opacity-80">
          Sign In
        </Link>
      </div>
      <AuthForm mode="sign-up" action={action} />
    </>
  );
}
