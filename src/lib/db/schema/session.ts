import { pgTable, uuid, text, timestamp } from 'drizzle-orm/pg-core';
import { user } from './user';
import { relations } from 'drizzle-orm';

export const session = pgTable('session', {
  id: uuid('id').primaryKey(),
  userId: uuid('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  token: text('token').notNull().unique(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});


