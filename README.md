This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Environment variables and Drizzle config explained

This project uses a Postgres database (Neon) with Drizzle ORM and an auth library. Several values must be provided via environment variables in `.env.local` during development.

Why `.env.local`?
- Next.js automatically loads variables from `.env.local` into `process.env` at build/runtime in development.
- We also call `dotenv.config({ path: '.env.local' })` in tooling or server-side code that runs outside Next.js (e.g., Drizzle CLI and the standalone DB client) so those processes can read the same values.
- Never commit real secrets. Keep `.env.local` out of version control.

Variables
- DATABASE_URL
  - What it is: A full Postgres connection string. Example (Neon):
    postgresql://USER:PASSWORD@HOST/DB?sslmode=require&channel_binding=require
  - Where it’s used:
    - drizzle.config.ts: Drizzle Kit needs it to connect when you run codegen/migrations (generate/push/introspect).
    - src/lib/db/index.ts: The application uses it at runtime to create the Neon client and Drizzle instance.
  - Why you need it: Without this URL, Drizzle can’t generate/apply migrations and the app can’t talk to the database.
  - Notes:
    - The `sslmode=require` and `channel_binding=require` flags are typical for Neon’s secure connections.
    - Treat this as a secret. Do not commit it.

- BETTER_AUTH_SECRET
  - What it is: A cryptographic secret used by the Better Auth library (or a similar auth solution) to sign/encrypt tokens, session cookies, and/or CSRF state.
  - Why you need it: Ensures tokens/cookies can’t be forged and protects sessions. Must be strong and random (e.g., 32+ bytes base64/hex).
  - Dev vs prod: Use any strong random string locally. In production, store it in the hosting provider’s env settings and rotate carefully if needed.

- BETTER_AUTH_URL
  - What it is: The canonical public URL of your app for the auth library to build absolute callback/redirect URLs and set correct cookie attributes (domain/secure flags).
  - Why you need it: OAuth/OpenID flows, magic links, and server redirects require an absolute site URL.
  - Dev tip: If you aren’t serving HTTPS locally, set this to http://localhost:3000 (not https). Use https only if you actually run HTTPS locally.

- NEXTAUTH_URL
  - What it is: The site URL used by NextAuth.js to generate absolute URLs for callbacks, email links, and redirects.
  - Why you need it: Many auth flows require absolute URLs and will fail without it.
  - When relevant: If you use NextAuth anywhere (directly or via adapters), set it. For local dev it’s usually http://localhost:3000, and in production it should be your real domain (https).

Drizzle configuration (drizzle.config.ts)
- dotenv.config({ path: '.env.local' }): Ensures Drizzle Kit (which runs as a separate Node process) can read your DATABASE_URL. Next.js doesn’t auto-load envs for external CLIs.
- schema: './src/lib/db/schema/index.ts': Where your Drizzle schema lives. Drizzle reads this to generate SQL migrations and types.
- out: './drizzle': Folder where Drizzle writes migration files and metadata.
- dialect: 'postgresql': Tells Drizzle which SQL dialect to target.
- dbCredentials.url: process.env.DATABASE_URL: The actual connection string Drizzle uses in CLI operations.

Runtime DB client (src/lib/db/index.ts)
- Loads `.env.local` and throws if DATABASE_URL is missing.
- Uses the Neon serverless driver (`@neondatabase/serverless`) with `drizzle-orm/neon-http`, suitable for serverless/edge-style environments.

Common tasks
- Generate migrations from your schema:
  npx drizzle-kit generate
- Apply migrations to the database:
  npx drizzle-kit push
- Introspect an existing DB into schema:
  npx drizzle-kit introspect

Production tips
- Do not commit `.env.local`. Provide production values via your hosting provider (e.g., Vercel environment variables).
- Use a real domain (https) for BETTER_AUTH_URL/NEXTAUTH_URL in production so cookies are set with the Secure flag and OAuth providers accept your callbacks.
- Rotate BETTER_AUTH_SECRET carefully; rotating invalidates existing sessions.
