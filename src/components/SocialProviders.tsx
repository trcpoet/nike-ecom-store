import React from "react";
import Image from "next/image";

export default function SocialProviders() {
  return (
    <div className="space-y-3">
      <button
        type="button"
        className="w-full inline-flex items-center justify-center gap-3 rounded-xl border border-light-300 px-4 py-3 text-body text-dark-900 hover:bg-light-200 focus:outline-none focus:ring-2 focus:ring-dark-900/20"
      >
        <Image src="/icons/google.svg" alt="" width={20} height={20} aria-hidden="true" />
        Continue with Google
      </button>
      <button
        type="button"
        className="w-full inline-flex items-center justify-center gap-3 rounded-xl border border-light-300 px-4 py-3 text-body text-dark-900 hover:bg-light-200 focus:outline-none focus:ring-2 focus:ring-dark-900/20"
      >
        <Image src="/icons/apple.svg" alt="" width={20} height={20} aria-hidden="true" />
        Continue with Apple
      </button>
    </div>
  );
}
