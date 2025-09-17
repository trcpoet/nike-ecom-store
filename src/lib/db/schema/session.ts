import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";
import { users } from "./user";
import { sql } from "drizzle-orm";

export const sessions = pgTable("session", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  token: text("token").notNull().unique(),
  ipAddress: text("ipAddress"),
  userAgent: text("userAgent"),
  expiresAt: timestamp("expiresAt", { mode: "date", withTimezone: false }).notNull(),
  createdAt: timestamp("createdAt", { mode: "date", withTimezone: false }).notNull().default(sql`now()`),
  updatedAt: timestamp("updatedAt", { mode: "date", withTimezone: false }).notNull().default(sql`now()`),
});

export type Session = typeof sessions.$inferSelect;
export type NewSession = typeof sessions.$inferInsert;
