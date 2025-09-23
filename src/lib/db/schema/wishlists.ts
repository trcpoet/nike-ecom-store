import { pgTable, uuid, timestamp } from 'drizzle-orm/pg-core';
export const wishlists = pgTable('wishlists', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull(),
  productId: uuid('product_id').notNull(),
  addedAt: timestamp('added_at').notNull().defaultNow(),
});
