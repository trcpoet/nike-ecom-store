import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/lib/db";
import * as schema from "@/lib/db/schema/index"
import { nextCookies } from "better-auth/next-js";
import { v4 as uuidv4 } from 'uuid';


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
    cookies :  {
      sessionToken: {
          name: "auth_session",
          options: {
              httpOnly: true,
              secure: process.env.NODE_ENV === "production",
              sameSite: "strict",
              path: "/",
              maxAge: 60 * 60 * 24 * 7,
          }
      }
    },     // ← important
    advanced : {
      database: {
          generateId: () => uuidv4()
      }
    },
    plugins: [nextCookies()]
    //Allows Better Auth to use Next.js cookies properly in serverside functions
    // like server actions or API routes
});
