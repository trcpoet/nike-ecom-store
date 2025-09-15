import React from "react";
import Image from "next/image";
import Link from "next/link";

export type BadgeTone = "success" | "warning" | "error";

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

function badgeColor(tone: BadgeTone = "warning") {
  switch (tone) {
    case "success":
      return { bg: "#007d48", text: "#ffffff" };
    case "error":
      return { bg: "#d33918", text: "#ffffff" };
    case "warning":
    default:
      return { bg: "#d37918", text: "#ffffff" };
  }
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
    <article className={`group ${className}`}>
      <div className="relative bg-[#f5f5f5] rounded-lg overflow-hidden">
        {badge ? (
          <span
            className="absolute left-4 top-4 rounded-full px-4 py-1 text-[var(--text-caption)] font-medium"
            style={{ backgroundColor: badgeColor(badge.tone).bg, color: badgeColor(badge.tone).text }}
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
            className="object-contain"
            priority={false}
          />
        </div>
      </div>

      <div className="bg-[var(--color-dark-900)] text-white px-4 py-4 rounded-b-lg -mt-2">
        <div className="flex items-center justify-between">
          <h3 className="text-[var(--text-heading-3)] font-medium">{title}</h3>
          {price !== undefined && price !== null ? (
            <span className="text-[var(--text-heading-3)] font-medium">
              {typeof price === "number" ? `$${price.toFixed(2)}` : price}
            </span>
          ) : null}
        </div>
        {subtitle ? (
          <p className="text-[var(--text-body)] text-[var(--color-dark-500)] mt-1">{subtitle}</p>
        ) : null}
        {meta ? (
          <p className="text-[var(--text-body)] text-[var(--color-dark-500)]">{meta}</p>
        ) : null}
      </div>
    </article>
  );

  return href ? (
    <Link href={href} aria-label={title} className="block">
      {content}
    </Link>
  ) : (
    content
  );
}
