import { pgTable, uuid, varchar, timestamp } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { products } from './products';

export const collections = pgTable('collections', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 200 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const productCollections = pgTable('product_collections', {
  id: uuid('id').primaryKey().defaultRandom(),
  productId: uuid('product_id').notNull(),
  collectionId: uuid('collection_id').notNull(),
});

export const collectionsRelations = relations(collections, ({ many }) => ({
  productLinks: many(productCollections),
}));

export const productCollectionsRelations = relations(productCollections, ({ one }) => ({
  product: one(products, {
    fields: [productCollections.productId],
    references: [products.id],
  }),
  collection: one(collections, {
    fields: [productCollections.collectionId],
    references: [collections.id],
  }),
}));
