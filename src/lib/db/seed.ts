import { db } from './index';
import { products } from './schema';

const sampleNikeProducts = [
  {
    name: 'Air Jordan 1 Retro High OG',
    description: 'The Air Jordan 1 Retro High OG brings back the classic silhouette with premium materials and iconic colorways.',
    price: 17000, // $170.00 in cents
    image_url: 'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/b7d9211c-26e7-431a-ac24-b0540fb3c00f/air-jordan-1-retro-high-og-shoes-Prsm5V.png',
  },
  {
    name: 'Nike Air Max 90',
    description: 'The Nike Air Max 90 stays true to its OG running roots with the iconic Waffle sole, stitched overlays and classic TPU accents.',
    price: 12000, // $120.00 in cents
    image_url: 'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/zwxes8uud05rkuei1mpt/air-max-90-shoes-6n3vKB.png',
  },
  {
    name: 'Nike Dunk Low',
    description: 'Created for the hardwood but taken to the streets, the Nike Dunk Low returns with crisp overlays and original team colors.',
    price: 11000, // $110.00 in cents
    image_url: 'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/b1bcbca4-e853-4df7-b329-5be3c61ee057/dunk-low-shoes-t9dFBz.png',
  },
  {
    name: 'Nike Air Force 1 \'07',
    description: 'The radiance lives on in the Nike Air Force 1 \'07, the basketball original that puts a fresh spin on what you know best.',
    price: 9000, // $90.00 in cents
    image_url: 'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/b7d9211c-26e7-431a-ac24-b0540fb3c00f/air-force-1-07-shoes-WrLlWX.png',
  },
  {
    name: 'Nike React Infinity Run Flyknit 3',
    description: 'A comfortable ride that\'s designed to help keep you running. More foam and improved upper details provide a secure and cushioned feel.',
    price: 16000, // $160.00 in cents
    image_url: 'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/8439f823-86cf-4086-81d2-4f9ff9a66866/react-infinity-run-flyknit-3-road-running-shoes-XJFKqP.png',
  },
  {
    name: 'Nike Blazer Mid \'77 Vintage',
    description: 'In the \'70s, Nike was the new shoe on the block. So new in fact, we were still breaking into the basketball scene.',
    price: 10000, // $100.00 in cents
    image_url: 'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/0a0fcbdb-aed5-44ab-9d5f-c27b5e8dff95/blazer-mid-77-vintage-shoes-nw30B2.png',
  },
  {
    name: 'Nike Air Max 270',
    description: 'Nike\'s first lifestyle Air Max brings you style, comfort and big attitude in the Nike Air Max 270.',
    price: 15000, // $150.00 in cents
    image_url: 'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/awjogtdnqxniqqk0wpgf/air-max-270-shoes-KkLcGR.png',
  },
  {
    name: 'Nike SB Dunk Low Pro',
    description: 'The Nike SB Dunk Low Pro has all the features skaters need to go the distance, with a flexible upper and cushioned midsole.',
    price: 9500, // $95.00 in cents
    image_url: 'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/3cc96f43-47b6-43cb-951d-d8f73bb2f912/sb-dunk-low-pro-skate-shoes-ZLqrWd.png',
  },
];

export async function seedProducts() {
  try {
    console.log('🌱 Seeding Nike products...');
    
    // Insert sample products
    const insertedProducts = await db.insert(products).values(sampleNikeProducts).returning();
    
    console.log(`✅ Successfully seeded ${insertedProducts.length} Nike products!`);
    console.log('Products:', insertedProducts.map(p => p.name).join(', '));
    
    return insertedProducts;
  } catch (error) {
    console.error('❌ Error seeding products:', error);
    throw error;
  }
}

// Run the seed function if this file is executed directly
if (require.main === module) {
  seedProducts()
    .then(() => {
      console.log('🎉 Seeding completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Seeding failed:', error);
      process.exit(1);
    });
}