import { pgTable, uuid, timestamp, integer, varchar } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { productVariants } from './variants';

export const carts = pgTable('carts', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id'),
  guestId: varchar('guest_id', { length: 255 }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const cartItems = pgTable('cart_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  cartId: uuid('cart_id').notNull(),
  productVariantId: uuid('product_variant_id').notNull(),
  quantity: integer('quantity').notNull().default(1),
});

export const cartsRelations = relations(carts, ({ many }) => ({
  items: many(cartItems),
}));

export const cartItemsRelations = relations(cartItems, ({ one }) => ({
  cart: one(carts, { fields: [cartItems.cartId], references: [carts.id] }),
  variant: one(productVariants, { fields: [cartItems.productVariantId], references: [productVariants.id] }),
}));
