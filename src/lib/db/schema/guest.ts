import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const guests = pgTable("guest", {
  id: uuid("id").primaryKey().defaultRandom(),
  sessionToken: text("sessionToken").notNull().unique(),
  createdAt: timestamp("createdAt", { mode: "date", withTimezone: false }).notNull().default(sql`now()`),
  expiresAt: timestamp("expiresAt", { mode: "date", withTimezone: false }).notNull(),
});

export type Guest = typeof guests.$inferSelect;
export type NewGuest = typeof guests.$inferInsert;
