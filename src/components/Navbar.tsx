"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/store/cart";

const NAV_LINKS = [
    { label: "Men", href: "/men" },
    { label: "Women", href: "/women" },
    { label: "Kids", href: "/kids" },
    { label: "Collections", href: "/collections" },
    { label: "Contact", href: "/contact" },
]

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const total = useCartStore((s) => s.getTotalItems());

  return (
    <header className="w-full border-b border-[#e5e5e5] bg-white sticky top-0 z-50">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" aria-label="Home" className="flex items-center">
            <Image src="/logo.svg" alt="Nike" width={36} height={36} priority />
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {["Men", "Women", "Kids", "Collections", "Contact"].map((label) => (
              <Link
                key={label}
                href="#"
                className="text-[var(--color-dark-900)] text-[var(--text-body)] font-medium hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-[var(--color-dark-900)] rounded"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>

        <div className="hidden md:flex items-center gap-6">
          <button
            type="button"
            className="text-[var(--color-dark-900)] text-[var(--text-body)] hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-[var(--color-dark-900)] rounded px-2 py-1"
          >
            Search
          </button>
          <Link
            href="#"
            className="text-[var(--color-dark-900)] text-[var(--text-body)] font-medium hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-[var(--color-dark-900)] rounded px-2 py-1"
          >
            My Cart ({total})
          </Link>
        </div>

        <button
          className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-dark-900)]"
          aria-label="Open menu"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
          type="button"
        >
          <span className="sr-only">Menu</span>
          <span className="relative block w-6 h-[2px] bg-black before:content-[''] before:absolute before:-top-2 before:left-0 before:w-6 before:h-[2px] before:bg-black after:content-[''] after:absolute after:top-2 after:left-0 after:w-6 after:h-[2px] after:bg-black" />
        </button>
      </nav>

      <div
        id="mobile-menu"
        className={`md:hidden ${open ? "block" : "hidden"} border-t border-[#e5e5e5] bg-white`}
      >
        <div className="px-4 pt-3 pb-6 space-y-3">
          {["Men", "Women", "Kids", "Collections", "Contact"].map((label) => (
            <Link
              key={label}
              href="#"
              className="block text-[var(--color-dark-900)] text-[var(--text-body)] font-medium py-1.5"
            >
              {label}
            </Link>
          ))}
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              className="text-[var(--color-dark-900)] text-[var(--text-body)]"
            >
              Search
            </button>
            <Link href="#" className="font-medium">
              My Cart ({total})
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
