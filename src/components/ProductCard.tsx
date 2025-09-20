'use client';

import { products } from '@/lib/db/schema/products';
import { useCartStore } from '@/store/cart';
import Image from 'next/image';

interface ProductCardProps {
    // @ts-ignore
    product: products.Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = () => {
    addItem(product, 1);
    console.log(`Added ${product.name} to cart`);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
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
            onClick={handleAddToCart}
            className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}