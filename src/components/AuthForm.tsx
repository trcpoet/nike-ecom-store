"use client";
import React, { useState } from "react";
import SocialProviders from "./SocialProviders";

export default function AuthForm({ mode }: { mode: "sign-in" | "sign-up" }) {
  const [show, setShow] = useState(false);
  const headline = mode === "sign-up" ? "Join Nike Today!" : "Welcome back";
  const sub = mode === "sign-up" ? "Create your account to start your fitness journey" : "Sign in to continue";

  return (
    <section>
      <h2 className="text-center text-heading-3 leading-[var(--text-heading-3--line-height)] font-[var(--text-heading-3--font-weight)]">
        {headline}
      </h2>
      <p className="mt-1 text-center text-dark-700">{sub}</p>

      <div className="mt-6">
        <SocialProviders />
      </div>

      <div className="my-6 flex items-center gap-4 text-caption text-dark-500">
        <div className="h-px flex-1 bg-light-300" />
        <span>Or {mode === "sign-up" ? "sign up" : "sign in"} with</span>
        <div className="h-px flex-1 bg-light-300" />
      </div>

      <form
        className="space-y-4"
        onSubmit={async (e) => {
          e.preventDefault();
          const form = e.currentTarget as HTMLFormElement;
          const formData = new FormData(form);
          const actionType = (form.dataset.mode as string) === "sign-up" ? "sign-up" : "sign-in";
          const payload: Record<string, unknown> = {
            type: actionType,
            email: formData.get("email"),
            password: formData.get("password"),
          };
          if (actionType === "sign-up") {
            payload.name = formData.get("name");
          }
          const res = await fetch("/api/auth", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
          const data = await res.json();
          if (!res.ok || !data?.ok) {
            console.error("Auth error:", data?.error || "Unknown error");
            alert(data?.error || "Authentication failed");
            return;
          }
          window.location.href = "/";
        }}
        data-mode={mode}
        noValidate
      >
        {mode === "sign-up" && (
          <div>
            <label htmlFor="name" className="mb-1 block text-caption text-dark-900">
              Full Name
            </label>
            <input
              id="name"
              name="name"
              autoComplete="name"
              placeholder="Enter your full name"
              className="w-full rounded-xl border border-light-300 px-4 py-3 text-body placeholder:text-dark-500 focus:outline-none focus:ring-2 focus:ring-dark-900/20"
            />
          </div>
        )}

        <div>
          <label htmlFor="email" className="mb-1 block text-caption text-dark-900">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="johndoe@gmail.com"
            className="w-full rounded-xl border border-light-300 px-4 py-3 text-body placeholder:text-dark-500 focus:outline-none focus:ring-2 focus:ring-dark-900/20"
          />
        </div>

        <div>
          <label htmlFor="password" className="mb-1 block text-caption text-dark-900">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={show ? "text" : "password"}
              autoComplete={mode === "sign-up" ? "new-password" : "current-password"}
              placeholder="minimum 8 characters"
              className="w-full rounded-xl border border-light-300 px-4 py-3 pr-12 text-body placeholder:text-dark-500 focus:outline-none focus:ring-2 focus:ring-dark-900/20"
            />
            <button
              type="button"
              aria-label={show ? "Hide password" : "Show password"}
              onClick={() => setShow((v) => !v)}
              className="absolute inset-y-0 right-3 my-auto h-8 w-8 rounded-full text-dark-700 hover:text-dark-900 focus:outline-none"
            >
              {show ? "🙈" : "👁️"}
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="mt-2 w-full rounded-full bg-dark-900 px-6 py-3 text-light-100 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-dark-900/30"
        >
          {mode === "sign-up" ? "Sign Up" : "Sign In"}
        </button>

        <p className="text-center text-footnote text-dark-700">
          By {mode === "sign-up" ? "signing up" : "signing in"}, you agree to our{" "}
          <a className="underline" href="#">
            Terms of Service
          </a>{" "}
          and{" "}
          <a className="underline" href="#">
            Privacy Policy
          </a>
          .
        </p>
      </form>
    </section>
  );
}
