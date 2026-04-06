# Nike Ecom Store - Backend Documentation

This project is built with a modern **Serverless Architecture** using **Next.js 15 (App Router)**. It leverages **PostgreSQL** (hosted on **Neon**) and **Drizzle ORM** for high-performance, type-safe data management.

---

## 🏗️ Architecture & Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org/) (App Router & Server Actions)
- **Database:** [Neon PostgreSQL](https://neon.tech/) (Serverless Postgres)
- **ORM:** [Drizzle ORM](https://orm.drizzle.team/) (TypeScript-first ORM)
- **Authentication:** [Better Auth](https://www.better-auth.com/) (Secure session-based auth)
- **Validation:** [Zod](https://zod.dev/) (Schema-based validation)

---

## 🗄️ Database Schema (`src/lib/db/schema/`)

The database is structured into several logical modules to support a complex e-commerce flow:

- **Authentication & Users:** Managed by Better Auth (`user.ts`, `session.ts`, `account.ts`, `verification.ts`).
- **Product Catalog:**
  - **Products:** Core product metadata (Name, Description).
  - **Variants:** Manages every combination of **Size** and **Color** as a unique SKU.
  - **Images:** Stores product-level and variant-level media.
- **Taxonomy & Filters:** Hierarchical categorization (`categories.ts`), Brands, Genders, Colors, and Sizes.
- **Customer Lifecycle:** Shopping Carts, Orders, Reviews, Wishlists, and Shipping Addresses.
- **Payments & Promotions:** Transaction tracking and Discount Coupon logic.

---

## ⚙️ Business Logic (`src/lib/actions/product.ts`)

The store's core functionality is implemented via **Next.js Server Actions**, providing a secure and performant bridge between the UI and the database.

### 1. Advanced Filtering (`getAllProducts`)
- **Multi-faceted Search:** Simultaneously filters by Search terms, Genders, Brands, Colors, Sizes, and Price Ranges.
- **Subquery Optimization:** Uses Drizzle subqueries to efficiently match products based on their underlying variant attributes.
- **Dynamic Pricing:** Aggregates `minPrice` and `maxPrice` across all variants in real-time.

### 2. Deep Data Hydration (`getProduct`)
- Performs complex **SQL Joins** across 7+ tables to fetch a complete product profile (Images, Variants, Category details, etc.) in a single database round-trip.

### 3. Recommendation System (`getRecommendedProducts`)
- Uses a **Weighted Priority Algorithm** to suggest related items. Products are scored based on Category (3pts), Brand (2pts), and Gender (1pts) matches.

---

## 🔐 Authentication Flow

We use **Better Auth** for a robust and secure user experience:
- **Session Management:** Uses secure, HTTP-only cookies (`auth_session`) for cross-request persistence.
- **Database Integration:** Sessions and users are stored directly in our PostgreSQL database via the `drizzleAdapter`.
- **Catch-all API:** A single dynamic route (`/api/auth/[...all]`) handles all authentication endpoints (Login, Signup, Social Auth).

---

## 🔌 Database Connection (`src/lib/db/index.ts`)

- **HTTP Driver:** Uses the `@neondatabase/serverless` driver. Unlike traditional TCP connections, this is optimized for **Serverless environments** (like Vercel), allowing for near-instant connections without exhausting database pools.
- **Type-Safety:** The Drizzle instance is initialized with the full project schema, enabling end-to-end TypeScript support for all database operations.

---

## 🔄 Request Lifecycle: How it Connects

The project follows a **Unidirectional Data Flow** from the UI to the Database:

1.  **The Trigger (Frontend):** A **Client Component** (e.g., `Filters.tsx`) updates the URL's query parameters (e.g., `?gender=men`) using `router.push()`.
2.  **The Bridge (Server Page):** Next.js re-renders the **Server Page** (`src/app/(root)/products/page.tsx`), which reads the new `searchParams`.
3.  **The Logic (Server Action):** The page calls a **Server Action** (e.g., `getAllProducts`), passing the parsed filters.
4.  **The Plumbing (ORM & DB):** The Action uses **Drizzle ORM** to build a SQL query. This query is sent via the **Neon HTTP Driver** to the cloud database.
5.  **The Return Flow:** Database rows are converted back into TypeScript objects by Drizzle, returned to the Server Page, and rendered as HTML for the browser.

---

## 🚀 Key Performance Features for Interviews

- **N+1 Avoidance:** Heavy use of Drizzle's relational joins to fetch related data in a single query.
- **Serverless Optimized:** The Neon HTTP driver ensures the application scales horizontally without database connection bottlenecks.
- **Strict Validation:** Every input (via Server Actions) is validated with **Zod**, preventing SQL injection and data corruption.
