import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";
import { users } from "./user";
import { sql } from "drizzle-orm";

export const accounts = pgTable("account", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  accountId: text("accountId").notNull(),
  providerId: text("providerId").notNull(), // e.g., "credentials", "google"
  accessToken: text("accessToken"),
  refreshToken: text("refreshToken"),
  accessTokenExpiresAt: timestamp("accessTokenExpiresAt", { mode: "date", withTimezone: false }),
  refreshTokenExpiresAt: timestamp("refreshTokenExpiresAt", { mode: "date", withTimezone: false }),
  scope: text("scope"),
  idToken: text("idToken"),
  password: text("password"),
  createdAt: timestamp("createdAt", { mode: "date", withTimezone: false }).notNull().default(sql`now()`),
  updatedAt: timestamp("updatedAt", { mode: "date", withTimezone: false }).notNull().default(sql`now()`),
});

export type Account = typeof accounts.$inferSelect;
export type NewAccount = typeof accounts.$inferInsert;
