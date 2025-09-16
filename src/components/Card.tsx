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
      className={`group rounded-xl bg-light-100 ring-1 ring-light-300 transition-colors hover:ring-dark-500  ${className}`}
    >
        <div className="relative aspect-square overflow-hidden rounded-t-xl bg-light-200">
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-300 ease-out group-hover:scale-105"
            priority={false}
          />
        </div>
      <div className="px-4 pt-4 bg-white">
        <div className="mb-1 flex items-center justify-between">
          <h3 className="text-[var(--text-heading-3)] font-medium text-[var(-dark-900)]">
            {title}
          </h3>
          {price !== undefined && price !== null ? (
            <span className="text-[var(--text-heading-3)] font-medium text-[var(-dark-900)]">
              {typeof price === "number" ? `$${price.toFixed(2)}` : price}
            </span>
          ) : null}
        </div>
        {subtitle ? (
          <p className="text-[var(--text-body)]  mt-1">{subtitle}</p>
        ) : null}
        {meta ? (
          <p className="text-[var(--text-body)] ">{meta}</p>
        ) : null}
      </div>
    </article>
  );

  return href ? (
    <Link
      href={href}
      aria-label={title}
      className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(-dark-900)]"
    >
      {content}
    </Link>
  ) : (
    content
  );
}
