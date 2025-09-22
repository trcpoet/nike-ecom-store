import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/lib/db";
import * as schema from "@/lib/db/schema/index"
import { nextCookies } from "better-auth/next-js";


export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
      schema: {
        user: schema.user,
        session: schema.session,
        account: schema.account,
        verification: schema.verification,
      },
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  socialProviders: {},
  session: {
      cookieCache: {
          enabled: true,
          maxAge: 60 * 60 * 24* 7
      }
  },
    plugins: [nextCookies()],     // ← important

});
