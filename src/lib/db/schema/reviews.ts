import { pgTable, uuid, integer, text, timestamp } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { products } from './products';

export const reviews = pgTable('reviews', {
  id: uuid('id').primaryKey().defaultRandom(),
  productId: uuid('product_id').notNull(),
  userId: uuid('user_id').notNull(),
  rating: integer('rating').notNull(),
  comment: text('comment').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const reviewsRelations = relations(reviews, ({ one }) => ({
  product: one(products, { fields: [reviews.productId], references: [products.id] }),
}));
