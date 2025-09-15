import { db } from '@/lib/db';
import { products } from '@/lib/db/schema';
import { desc } from 'drizzle-orm';
import Link from 'next/link';
import ProductList from '@/components/ProductList';

async function getProducts() {
  try {
    const allProducts = await db
      .select()
      .from(products)
      .orderBy(desc(products.created_at))
      .limit(12);
    return allProducts;
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

export default async function Home() {
  const productList = await getProducts();

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-black text-white py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">NIKE</h1>
            <nav className="hidden md:flex space-x-8">
              <Link href="/" className="hover:text-gray-300">Home</Link>
              <Link href="/products" className="hover:text-gray-300">Products</Link>
              <Link href="/cart" className="hover:text-gray-300">Cart</Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gray-100 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-black mb-4">
            JUST DO IT
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Discover the latest Nike sneakers and athletic wear
          </p>
          <button className="bg-black text-white px-8 py-3 rounded-full hover:bg-gray-800 transition-colors">
            Shop Now
          </button>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-12">Featured Products</h3>
          <ProductList products={productList} />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2024 Nike E-commerce Store. Built with Next.js, Drizzle ORM, and Neon PostgreSQL.</p>
        </div>
      </footer>
    </div>
  );
}
