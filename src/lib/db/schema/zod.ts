import { z } from 'zod';
import { addressTypeEnum } from './addresses';
import { orderStatusEnum, paymentMethodEnum, paymentStatusEnum } from './orders';
import { couponDiscountTypeEnum } from './coupons';

const uuid = () => z.string().uuid();
const ts = () => z.date().or(z.string()).transform((v) => (v instanceof Date ? v : new Date(v)));
const money = () => z.string().regex(/^\d+(\.\d{1,2})?$/).or(z.number()).transform(String);

export const addressInsertSchema = z.object({
  id: uuid().optional(),
  userId: uuid(),
  type: z.enum(addressTypeEnum.enumValues as [string, ...string[]]),
  line1: z.string().min(1),
  line2: z.string().optional(),
  city: z.string().min(1),
  state: z.string().min(1),
  country: z.string().min(1),
  postalCode: z.string().min(1),
  isDefault: z.boolean().optional(),
});
export const addressSelectSchema = addressInsertSchema.extend({ id: uuid() });

export const brandInsertSchema = z.object({
  id: uuid().optional(),
  name: z.string().min(1),
  slug: z.string().min(1),
  logoUrl: z.string().url().optional(),
});
export const brandSelectSchema = brandInsertSchema.extend({ id: uuid() });

export const categoryInsertSchema = z.object({
  id: uuid().optional(),
  name: z.string().min(1),
  slug: z.string().min(1),
  parentId: uuid().nullable().optional(),
});
export const categorySelectSchema = categoryInsertSchema.extend({ id: uuid() });

export const genderInsertSchema = z.object({
  id: uuid().optional(),
  label: z.string().min(1),
  slug: z.string().min(1),
});
export const genderSelectSchema = genderInsertSchema.extend({ id: uuid() });

export const colorInsertSchema = z.object({
  id: uuid().optional(),
  name: z.string().min(1),
  slug: z.string().min(1),
  hexCode: z.string().regex(/^#([0-9a-fA-F]{6})$/),
});
export const colorSelectSchema = colorInsertSchema.extend({ id: uuid() });

export const sizeInsertSchema = z.object({
  id: uuid().optional(),
  name: z.string().min(1),
  slug: z.string().min(1),
  sortOrder: z.number().int().nonnegative().optional(),
});
export const sizeSelectSchema = sizeInsertSchema.extend({ id: uuid() });

export const productInsertSchema = z.object({
  id: uuid().optional(),
  name: z.string().min(1),
  description: z.string().min(1),
  categoryId: uuid(),
  genderId: uuid(),
  brandId: uuid(),
  isPublished: z.boolean().optional(),
  defaultVariantId: uuid().nullable().optional(),
  createdAt: ts().optional(),
  updatedAt: ts().optional(),
});
export const productSelectSchema = productInsertSchema.extend({ id: uuid() });

export const productImageInsertSchema = z.object({
  id: uuid().optional(),
  productId: uuid(),
  variantId: uuid().nullable().optional(),
  url: z.string().min(1),
  sortOrder: z.number().int().nonnegative().optional(),
  isPrimary: z.boolean().optional(),
});
export const productImageSelectSchema = productImageInsertSchema.extend({ id: uuid() });

export const productVariantInsertSchema = z.object({
  id: uuid().optional(),
  productId: uuid(),
  sku: z.string().min(1),
  price: money(),
  salePrice: money().nullable().optional(),
  colorId: uuid(),
  sizeId: uuid(),
  inStock: z.number().int().nonnegative().optional(),
  weight: z.number().nonnegative().optional(),
  dimensions: z.object({ length: z.number(), width: z.number(), height: z.number() }),
  createdAt: ts().optional(),
});
export const productVariantSelectSchema = productVariantInsertSchema.extend({ id: uuid() });

export const reviewInsertSchema = z.object({
  id: uuid().optional(),
  productId: uuid(),
  userId: uuid(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().min(1),
  createdAt: ts().optional(),
});
export const reviewSelectSchema = reviewInsertSchema.extend({ id: uuid() });

export const cartInsertSchema = z.object({
  id: uuid().optional(),
  userId: uuid().nullable().optional(),
  guestId: z.string().optional(),
  createdAt: ts().optional(),
  updatedAt: ts().optional(),
});
export const cartSelectSchema = cartInsertSchema.extend({ id: uuid() });

export const cartItemInsertSchema = z.object({
  id: uuid().optional(),
  cartId: uuid(),
  productVariantId: uuid(),
  quantity: z.number().int().positive(),
});
export const cartItemSelectSchema = cartItemInsertSchema.extend({ id: uuid() });

export const orderInsertSchema = z.object({
  id: uuid().optional(),
  userId: uuid(),
  status: z.enum(orderStatusEnum.enumValues as [string, ...string[]]).optional(),
  totalAmount: money(),
  shippingAddressId: uuid(),
  billingAddressId: uuid(),
  createdAt: ts().optional(),
});
export const orderSelectSchema = orderInsertSchema.extend({ id: uuid() });

export const orderItemInsertSchema = z.object({
  id: uuid().optional(),
  orderId: uuid(),
  productVariantId: uuid(),
  quantity: z.number().int().positive(),
  priceAtPurchase: money(),
});
export const orderItemSelectSchema = orderItemInsertSchema.extend({ id: uuid() });

export const paymentInsertSchema = z.object({
  id: uuid().optional(),
  orderId: uuid(),
  method: z.enum(paymentMethodEnum.enumValues as [string, ...string[]]),
  status: z.enum(paymentStatusEnum.enumValues as [string, ...string[]]),
  paidAt: ts().nullable().optional(),
  transactionId: z.string().nullable().optional(),
});
export const paymentSelectSchema = paymentInsertSchema.extend({ id: uuid() });

export const couponInsertSchema = z.object({
  id: uuid().optional(),
  code: z.string().min(1),
  discountType: z.enum(couponDiscountTypeEnum.enumValues as [string, ...string[]]),
  discountValue: money(),
  expiresAt: ts().nullable().optional(),
  maxUsage: z.number().int().nonnegative().optional(),
  usedCount: z.number().int().nonnegative().optional(),
});
export const couponSelectSchema = couponInsertSchema.extend({ id: uuid() });

export const collectionInsertSchema = z.object({
  id: uuid().optional(),
  name: z.string().min(1),
  slug: z.string().min(1),
  createdAt: ts().optional(),
});
export const collectionSelectSchema = collectionInsertSchema.extend({ id: uuid() });

export const productCollectionInsertSchema = z.object({
  id: uuid().optional(),
  productId: uuid(),
  collectionId: uuid(),
});
export const productCollectionSelectSchema = productCollectionInsertSchema.extend({ id: uuid() });

export const wishlistInsertSchema = z.object({
  id: uuid().optional(),
  userId: uuid(),
  productId: uuid(),
  addedAt: ts().optional(),
});
export const wishlistSelectSchema = wishlistInsertSchema.extend({ id: uuid() });
