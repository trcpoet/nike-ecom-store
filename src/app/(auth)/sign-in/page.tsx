import Link from "next/link";
import AuthForm from "@/components/AuthForm";

export default function Page() {
  return (
    <>
      <div className="mb-2 text-center text-body text-dark-700">
        <span>Don&apos;t have an account? </span>
        <Link href="/sign-up" className="underline hover:opacity-80">
          Sign Up
        </Link>
      </div>
      <AuthForm mode="sign-in" />
    </>
  );
}
