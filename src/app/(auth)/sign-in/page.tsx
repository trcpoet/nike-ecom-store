import Link from "next/link";
import AuthForm from "@/components/AuthForm";
import { redirect } from "next/navigation";
import { signIn } from "@/lib/auth/actions";

export default function Page() {
  async function action(formData: FormData) {
    "use server";
    const email = String(formData.get("email") || "");
    const password = String(formData.get("password") || "");
    await signIn({ email, password });
    redirect("/");
  }

  return (
    <>
      <div className="mb-2 text-center text-body text-dark-700">
        <span>Don&apos;t have an account? </span>
        <Link href="/sign-up" className="underline hover:opacity-80">
          Sign Up
        </Link>
      </div>
      <AuthForm mode="sign-in" action={action} />
    </>
  );
}
