'use client';

import { Product } from '@/lib/db/schema/products';
import { useCartStore } from '@/store/cart';
import Image from 'next/image';

interface ProductListProps {
  products: Product[];
}

export default function ProductList({ products }: ProductListProps) {
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = (product: Product) => {
    addItem(product, 1);
    // You could add a toast notification here
    console.log(`Added ${product.name} to cart`);
  };

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 mb-4">No products found. Seed the database first!</p>
        <button
          onClick={async () => {
            try {
              const response = await fetch('/api/seed', { method: 'POST' });
              if (response.ok) {
                window.location.reload();
              } else {
                console.error('Failed to seed products');
              }
            } catch (error) {
              console.error('Error seeding products:', error);
            }
          }}
          className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition-colors"
        >
          Seed Products
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {products.map((product) => (
        <div
          key={product.id}
          className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
        >
          <div className="aspect-square relative bg-gray-100">
            {product.image_url ? (
              <Image
                src={product.image_url}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                <div className="text-center">
                  <div className="text-4xl mb-2">👟</div>
                  <div>No Image</div>
                </div>
              </div>
            )}
          </div>

          <div className="p-4">
            <h4 className="font-semibold text-lg mb-2 line-clamp-2">
              {product.name}
            </h4>

            {product.description && (
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                {product.description}
              </p>
            )}

            <div className="flex items-center justify-between">
              <span className="text-xl font-bold">
                ${(product.price / 100).toFixed(2)}
              </span>

              <button
                onClick={() => handleAddToCart(product)}
                className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}