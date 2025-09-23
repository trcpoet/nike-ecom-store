import { pgTable, uuid, varchar } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { productVariants } from '../variants';

export const colors = pgTable('colors', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 100 }).notNull(),
  slug: varchar('slug', { length: 150 }).notNull(),
  hexCode: varchar('hex_code', { length: 7 }).notNull(),
});

export const colorsRelations = relations(colors, ({ many }) => ({
  variants: many(productVariants),
}));
