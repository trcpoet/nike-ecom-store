import { pgEnum, pgTable, uuid, varchar, numeric, timestamp, integer, uniqueIndex } from 'drizzle-orm/pg-core';

export const couponDiscountTypeEnum = pgEnum('coupon_discount_type', ['percentage', 'fixed']);

export const coupons = pgTable('coupons', {
  id: uuid('id').primaryKey().defaultRandom(),
  code: varchar('code', { length: 100 }).notNull(),
  discountType: couponDiscountTypeEnum('discount_type').notNull(),
  discountValue: numeric('discount_value').notNull(),
  expiresAt: timestamp('expires_at'),
  maxUsage: integer('max_usage').notNull().default(0),
  usedCount: integer('used_count').notNull().default(0),
}, (t) => ({
  codeIdx: uniqueIndex('coupons_code_idx').on(t.code),
}));
