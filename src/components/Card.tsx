import React from "react";
import Image from "next/image";
import Link from "next/link";

export type BadgeTone = string;

export interface CardProps {
  imageSrc: string;
  imageAlt: string;
  title: string;
  subtitle?: string;
  meta?: string;
  price?: number | string;
  badge?: { label: string; tone?: BadgeTone };
  href?: string;
  className?: string;
}


export default function Card({
  imageSrc,
  imageAlt,
  title,
  subtitle,
  meta,
  price,
  badge,
  href,
  className = "",
}: CardProps) {
  const content = (
    <article
      className={`group transition-transform duration-200 ease-out hover:-translate-y-1 ${className}`}
    >
      <div className="relative bg-[#f5f5f5] rounded-lg overflow-hidden">
        {badge ? (
          <span
            className="absolute left-4 top-4 rounded-full px-3 py-1 text-[var(--text-caption)] font-medium"
            style={{ backgroundColor: "#fff1e6", color: "#d37918" }}
            aria-label={badge.label}
          >
            {badge.label}
          </span>
        ) : null}

        <div className="relative w-full aspect-[16/10]">
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-contain transition-transform duration-300 ease-out group-hover:scale-[1.03]"
            priority={false}
          />
        </div>
      </div>

      <div className="px-4 pt-4 bg-white">
        <div className="flex items-center justify-between">
          <h3 className="text-[var(--text-heading-3)] font-medium text-[var(--color-dark-900)]">
            {title}
          </h3>
          {price !== undefined && price !== null ? (
            <span className="text-[var(--text-heading-3)] font-medium text-[var(--color-dark-900)]">
              {typeof price === "number" ? `$${price.toFixed(2)}` : price}
            </span>
          ) : null}
        </div>
        {subtitle ? (
          <p className="text-[var(--text-body)] text-[var(--color-dark-600)] mt-1">{subtitle}</p>
        ) : null}
        {meta ? (
          <p className="text-[var(--text-body)] text-[var(--color-dark-600)]">{meta}</p>
        ) : null}
      </div>
    </article>
  );

  return href ? (
    <Link
      href={href}
      aria-label={title}
      className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-dark-900)]"
    >
      {content}
    </Link>
  ) : (
    content
  );
}
