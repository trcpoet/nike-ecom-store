import { pgTable, uuid, varchar, text, boolean, timestamp, integer } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { categories } from './categories';
import { genders } from './filters/genders';
import { productVariants } from './variants';
import { productCollections } from './collections';

export const brands = pgTable('brands', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 200 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull(),
  logoUrl: varchar('logo_url', { length: 1024 }),
});

export const products = pgTable('products', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description').notNull(),
  categoryId: uuid('category_id').notNull(),
  genderId: uuid('gender_id').notNull(),
  brandId: uuid('brand_id').notNull(),
  isPublished: boolean('is_published').notNull().default(false),
  defaultVariantId: uuid('default_variant_id'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const productImages = pgTable('product_images', {
  id: uuid('id').primaryKey().defaultRandom(),
  productId: uuid('product_id').notNull(),
  variantId: uuid('variant_id'),
  url: varchar('url', { length: 1024 }).notNull(),
  sortOrder: integer('sort_order').notNull().default(0),
  isPrimary: boolean('is_primary').notNull().default(false),
});

export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(categories, { fields: [products.categoryId], references: [categories.id] }),
  gender: one(genders, { fields: [products.genderId], references: [genders.id] }),
  brand: one(brands, { fields: [products.brandId], references: [brands.id] }),
  variants: many(productVariants),
  images: many(productImages),
  collections: many(productCollections),
}));

export const productImagesRelations = relations(productImages, ({ one }) => ({
  product: one(products, { fields: [productImages.productId], references: [products.id] }),
  variant: one(productVariants, { fields: [productImages.variantId], references: [productVariants.id] }),
}));
