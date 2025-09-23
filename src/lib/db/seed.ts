import { db } from './index';
import { and, eq } from 'drizzle-orm';
import { products, brands, categories, genders, colors, sizes, productVariants, productImages, collections, productCollections } from './schema';
import fs from 'node:fs';
import path from 'node:path';

function rand<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}
function skuFor(name: string, color: string, size: string, idx: number) {
  return `${name.substring(0,3).toUpperCase()}-${color.substring(0,3).toUpperCase()}-${size.toUpperCase()}-${String(idx).padStart(3,'0')}`;
}

export async function seed() {
  console.log('🌱 Seeding database...');
  try {
    const nike = (await db.insert(brands).values({ name: 'Nike', slug: 'nike' }).onConflictDoNothing().returning()).at(0)
      ?? (await db.query.brands.findFirst({ where: (f, { eq }) => eq(f.slug, 'nike') }))!;

    const catMen = (await db.insert(categories).values({ name: 'Shoes', slug: 'shoes' }).onConflictDoNothing().returning()).at(0)
      ?? (await db.query.categories.findFirst({ where: (f, { eq }) => eq(f.slug, 'shoes') }))!;

    const gMen = (await db.insert(genders).values({ label: 'Men', slug: 'men' }).onConflictDoNothing().returning()).at(0)
      ?? (await db.query.genders.findFirst({ where: (f, { eq }) => eq(f.slug, 'men') }))!;
    const gWomen = (await db.insert(genders).values({ label: 'Women', slug: 'women' }).onConflictDoNothing().returning()).at(0)
      ?? (await db.query.genders.findFirst({ where: (f, { eq }) => eq(f.slug, 'women') }))!;

    const baseColors = [
      { name: 'Red', slug: 'red', hexCode: '#FF0000' },
      { name: 'Blue', slug: 'blue', hexCode: '#0000FF' },
      { name: 'Black', slug: 'black', hexCode: '#000000' },
      { name: 'White', slug: 'white', hexCode: '#FFFFFF' },
      { name: 'Green', slug: 'green', hexCode: '#00FF00' },
    ];
    for (const c of baseColors) await db.insert(colors).values(c).onConflictDoNothing();
    const allColors = await db.query.colors.findMany();

    const baseSizes = [
      { name: 'S', slug: 's', sortOrder: 1 },
      { name: 'M', slug: 'm', sortOrder: 2 },
      { name: 'L', slug: 'l', sortOrder: 3 },
      { name: 'XL', slug: 'xl', sortOrder: 4 },
      { name: 'XXL', slug: 'xxl', sortOrder: 5 },
    ];
    for (const s of baseSizes) await db.insert(sizes).values(s).onConflictDoNothing();
    const allSizes = await db.query.sizes.findMany();

    const summer = (await db.insert(collections).values({ name: "Summer '25", slug: 'summer-25' }).onConflictDoNothing().returning()).at(0)
      ?? (await db.query.collections.findFirst({ where: (f, { eq }) => eq(f.slug, 'summer-25') }))!;

    const models = [
      'Air Jordan 1 Retro High OG','Nike Air Max 90','Nike Dunk Low','Nike Air Force 1 \'07',
      'Nike React Infinity Run Flyknit 3','Nike Blazer Mid \'77 Vintage','Nike Air Max 270',
      'Nike SB Dunk Low Pro','Nike Pegasus 41','Nike ZoomX Vaporfly','Nike Invincible 3',
      'Nike Metcon 9','Nike ACG Mountain Fly','Nike Free RN','Nike Cortez'
    ];

    const publicShoesDir = path.join(process.cwd(), 'public', 'shoes');
    const staticUploadsDir = path.join(process.cwd(), 'public', 'static', 'uploads');
    fs.mkdirSync(staticUploadsDir, { recursive: true });
    const localImages = fs.existsSync(publicShoesDir) ? fs.readdirSync(publicShoesDir).filter(f => /\.(png|jpe?g|webp)$/i.test(f)) : [];
    const imageUrl = (i: number) => {
      if (localImages[i % localImages.length]) {
        const src = path.join(publicShoesDir, localImages[i % localImages.length]);
        const dst = path.join(staticUploadsDir, localImages[i % localImages.length]);
        if (!fs.existsSync(dst)) fs.copyFileSync(src, dst);
        return `/static/uploads/${localImages[i % localImages.length]}`;
      }
      return `https://static.nike.com/a/images/f_auto,q_auto:eco/w_${600 + (i % 5) * 100}/placeholder.png`;
    };

    for (let i = 0; i < models.length; i++) {
      const model = models[i];
      const genderId = i % 2 === 0 ? gMen.id : gWomen.id;

      const p = (await db.insert(products).values({
        name: model,
        description: `${model} by Nike with premium materials and performance comfort.`,
        categoryId: catMen.id,
        genderId,
        brandId: nike.id,
        isPublished: true,
      }).returning()).at(0)!;

      const usedColors = [rand(allColors), rand(allColors), rand(allColors)].filter((v, idx, arr) => arr.findIndex(a => a.id === v.id) === idx);
      const usedSizes = [rand(allSizes), rand(allSizes), rand(allSizes), rand(allSizes)].filter((v, idx, arr) => arr.findIndex(a => a.id === v.id) === idx);

      const variants = [];
      let vIdx = 1;
      for (const c of usedColors) {
        for (const s of usedSizes) {
          const v = (await db.insert(productVariants).values({
            productId: p.id,
            sku: skuFor(model, c.slug, s.slug, vIdx++),
            price: '150.00',
            salePrice: i % 3 === 0 ? '129.99' : null,
            colorId: c.id,
            sizeId: s.id,
            inStock: 25 + (i % 10),
            weight: 0.8,
            dimensions: { length: 30, width: 20, height: 12 },
          }).returning()).at(0)!;
          variants.push(v);

          await db.insert(productImages).values([
            { productId: p.id, variantId: v.id, url: imageUrl(i), sortOrder: 0 as any, isPrimary: true },
            { productId: p.id, variantId: v.id, url: imageUrl(i + 1), sortOrder: 1 as any, isPrimary: false },
          ]);
        }
      }

      if (i % 2 === 0) {
        await db.insert(productCollections).values({ productId: p.id, collectionId: summer.id }).onConflictDoNothing();
      }

      const defaultVariant = variants[0];
      await db.update(products).set({ defaultVariantId: defaultVariant.id }).where(eq(products.id, p.id));
      console.log(`✓ Seeded product ${p.name} with ${variants.length} variants`);
    }

    console.log('✅ Seed complete');
  } catch (e) {
    console.error('❌ Seed failed', e);
    throw e;
  }
}

if (require.main === module) {
  seed().then(() => process.exit(0)).catch(() => process.exit(1));
}
