import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const verifications = pgTable("verification", {
  id: uuid("id").primaryKey().defaultRandom(),
  identifier: text("identifier").notNull(), // e.g., email
  value: text("value").notNull(), // token/code
  expiresAt: timestamp("expiresAt", { mode: "date", withTimezone: false }).notNull(),
  createdAt: timestamp("createdAt", { mode: "date", withTimezone: false }).notNull().default(sql`now()`),
  updatedAt: timestamp("updatedAt", { mode: "date", withTimezone: false }).notNull().default(sql`now()`),
});

export type Verification = typeof verifications.$inferSelect;
export type NewVerification = typeof verifications.$inferInsert;
