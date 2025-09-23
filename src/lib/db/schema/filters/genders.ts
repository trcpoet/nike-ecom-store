import { pgTable, uuid, varchar, uniqueIndex } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { products } from '../products';

export const genders = pgTable('genders', {
  id: uuid('id').primaryKey().defaultRandom(),
  label: varchar('label', { length: 100 }).notNull(),
  slug: varchar('slug', { length: 150 }).notNull(),
}, (t) => ({
  slugIdx: uniqueIndex('genders_slug_idx').on(t.slug),
}));

export const gendersRelations = relations(genders, ({ many }) => ({
  products: many(products),
}));
