import React from "react";
import Image from "next/image";
import Link from "next/link";

const footerCols = [
  { title: "Featured", links: ["Air Force 1", "Huarache", "Air Max 90", "Air Max 95"] },
  { title: "Shoes", links: ["All Shoes", "Custom Shoes", "Jordan Shoes", "Running Shoes"] },
  { title: "Clothing", links: ["All Clothing", "Modest Wear", "Hoodies & Pullovers", "Shirts & Tops"] },
  { title: "Kids'", links: ["Infant & Toddler Shoes", "Kids' Shoes", "Kids' Jordan Shoes", "Kids' Basketball Shoes"] },
];

export default function Footer() {
  return (
    <footer className="bg-black text-[var(--color-dark-700)] mt-24">
      <nav aria-label="Footer" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-10">
          <div className="flex items-start">
            <Image src="/logo.svg" alt="Nike" width={56} height={56} />
          </div>
          {footerCols.map((col) => (
            <div key={col.title}>
              <h4 className="text-[var(--text-heading-3)] text-white mb-4">{col.title}</h4>
              <ul className="space-y-2">
                {col.links.map((l) => (
                  <li key={l}>
                    <Link href="#" className="hover:text-white transition-colors">
                      {l}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col-reverse gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2 text-white/90">
            <Image src="/globe.svg" alt="" width={16} height={16} />
            <span className="text-[var(--text-caption)]">Croatia</span>
            <span className="ml-4 text-[var(--text-caption)] text-white/70">
              © 2025 Nike, Inc. All Rights Reserved
            </span>
          </div>

          <div className="flex items-center gap-4">
            {["/x.svg", "/facebook.svg", "/instagram.svg"].map((src) => (
              <Link key={src} href="#" aria-label={src.replace("/", "").split(".")[0]}>
                <span className="inline-flex w-10 h-10 rounded-full bg-white items-center justify-center">
                  <Image src={src} alt="" width={18} height={18} />
                </span>
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-8 flex flex-col md:flex-row md:items-center md:justify-center gap-6">
          {["Guides", "Terms of Sale", "Terms of Use", "Nike Privacy Policy"].map((i) => (
            <Link key={i} href="#" className="hover:text-white text-[var(--text-footnote)]">
              {i}
            </Link>
          ))}
        </div>
      </nav>
    </footer>
  );
}
