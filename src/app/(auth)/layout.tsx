import { ReactNode } from "react";
import Link from "next/link";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh grid grid-cols-1 lg:grid-cols-12">
      <aside className="hidden lg:block lg:col-span-6 bg-dark-900 text-light-100">
        <div className="flex h-full flex-col justify-between p-8">
          <div className="h-10 w-10 rounded-md bg-orange" />
          <div className="pb-16">
            <h1 className="text-heading-2 leading-[var(--text-heading-2--line-height)] font-[var(--text-heading-2--font-weight)]">
              Just Do It
            </h1>
            <p className="mt-4 max-w-md text-lead text-light-400">
              Join millions of athletes and fitness enthusiasts who trust Nike for their performance needs.
            </p>
            <div className="mt-6 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-light-300" />
              <span className="h-2 w-2 rounded-full bg-light-300/60" />
              <span className="h-2 w-2 rounded-full bg-light-300/40" />
            </div>
          </div>
          <p className="text-footnote text-light-400/80">© 2024 Nike. All rights reserved.</p>
        </div>
      </aside>

      <main className="lg:col-span-6 bg-light-100">
        <div className="mx-auto w-full max-w-md px-6 py-10 lg:py-16">
          <div className="mb-6 text-center text-body text-dark-700">
          </div>
          {children}
        </div>
      </main>
    </div>
  );
}
