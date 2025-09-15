import { pgTable, serial, text, decimal, integer, timestamp, boolean } from 'drizzle-orm/pg-core';

export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  price: decimal('price', { precision: 10, scale: 2 }).notNull().$type<number>(),
  imageUrl: text('image_url').notNull(),
  category: text('category').notNull(),
  brand: text('brand').notNull().default('Nike'),
  sizes: text('sizes').array().notNull(), // JSON array of available sizes
  colors: text('colors').array().notNull(), // JSON array of available colors
  inStock: boolean('in_stock').notNull().default(true),
  stockQuantity: integer('stock_quantity').notNull().default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
