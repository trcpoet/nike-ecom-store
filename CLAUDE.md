# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start dev server with Turbopack (fast)
npm run build        # Production build
npm run lint         # ESLint

npm run db:push      # Push schema changes to Neon DB (no migration file)
npm run db:migrate   # Run migration files
npm run db:generate  # Generate migration files from schema changes
npm run db:seed      # Seed the database (tsx src/lib/db/seed.ts)
npm run db:studio    # Open Drizzle Studio (DB GUI)
npm run db:reset     # Drop + push + seed (destructive)
```

Requires `.env.local` with `DATABASE_URL` (Neon PostgreSQL) and `BETTER_AUTH_SECRET`.

## Architecture

**Stack:** Next.js 15 App Router · Drizzle ORM · Neon (serverless Postgres) · Zustand · Better Auth · Tailwind v4

### Route structure

```
app/
  layout.tsx              # Root shell (font, globals.css)
  (root)/
    layout.tsx            # Navbar + Footer wrapper
    page.tsx              # Home — latest products grid
    products/
      page.tsx            # Product listing with filters + sort (server component)
      [id]/page.tsx       # Product detail (server component)
    cart/page.tsx         # Cart page (client component)
  (auth)/
    sign-in/page.tsx
    sign-up/page.tsx
```

### Data flow on the product detail page

The `[id]/page.tsx` is a **server component** that fetches all variant data and builds a `ColorVariant[]` array (one entry per color, each containing its sizes with per-size `inStock`, `price`, and `salePrice`). This is passed to `ProductOptions` (client component) which handles all interactivity reactively:

- Color selection → resets size, updates size grid and price for that color
- Size selection → updates price to the exact variant's price
- "Add to Bag" → calls `useCartStore`

`ProductGallery` (client) reads the selected color index from `useVariantStore` to switch image sets.

### State management (Zustand)

Two stores in `src/store/`:

- **`useVariantStore`** — per-product color index (`selectedByProduct`) and size (`selectedSizeByProduct`). Keyed by `productId`. NOT persisted.
- **`useCartStore`** — cart items array + total. Persisted to `localStorage` via `zustand/middleware persist`. Cart count in `Navbar` uses `mounted` guard to avoid SSR hydration mismatch.

Always use **separate `useStore` calls** per value — never return a plain object `{}` from a selector (causes infinite re-render).

### Database schema

Schema files live in `src/lib/db/schema/`. Key relationships:

- `products` → `productVariants` (one product, many color+size variants)
- `productVariants` has `colorId`, `sizeId`, `inStock` (integer count), `price`, `salePrice`
- `productImages` links to either a `productId` (fallback images) or a `variantId` (color-specific images)
- Colors, sizes, genders live in `src/lib/db/schema/filters/`
- Auth tables: `users`, `sessions`, `accounts`, `verifications` — managed by Better Auth

DB client: `src/lib/db/index.ts` exports `db` (Drizzle + Neon HTTP driver). Auth: `src/lib/auth/index.ts` exports `auth` (Better Auth with Drizzle adapter).

### Server actions

All DB queries are in `src/lib/actions/product.ts` marked `"use server"`. Key functions:
- `getAllProducts(filters)` — paginated product list with filtering/sorting via Drizzle subqueries
- `getProduct(id)` — full product with all variants, colors, sizes, images in one query (de-duped in JS)
- `getProductReviews(productId)` / `getRecommendedProducts(productId)`

### Filtering / URL params

`src/lib/utils/query.ts` owns all URL param logic. Filters are URL-driven (no client state). `parseFilterParams()` normalizes raw `searchParams` into `NormalizedProductFilters`. `toggleArrayParam`, `withUpdatedParams`, etc. build new URLs — `Filters.tsx` calls `router.push` with these.

### Components barrel

`src/components/index.ts` re-exports shared components. `ProductOptions`, `ColorSwatches`, `ProductActions` are imported directly (not via barrel) since they're page-specific or have named type exports.
