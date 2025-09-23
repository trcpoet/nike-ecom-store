import { pgEnum, pgTable, uuid, varchar, boolean } from 'drizzle-orm/pg-core';

export const addressTypeEnum = pgEnum('address_type', ['billing', 'shipping']);

export const addresses = pgTable('addresses', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull(),
  type: addressTypeEnum('type').notNull(),
  line1: varchar('line1', { length: 255 }).notNull(),
  line2: varchar('line2', { length: 255 }),
  city: varchar('city', { length: 100 }).notNull(),
  state: varchar('state', { length: 100 }).notNull(),
  country: varchar('country', { length: 100 }).notNull(),
  postalCode: varchar('postal_code', { length: 20 }).notNull(),
  isDefault: boolean('is_default').notNull().default(false),
});
