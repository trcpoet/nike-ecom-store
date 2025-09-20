'use client';

import { Product } from '@/lib/db/schema/products';
import { useCartStore } from '@/store/cart';
import Image from 'next/image';
import PropTypes from 'prop-types';
import React from "react";

export interface ProductCardProps {
    product: Product;
    title: string; // Ensure title is defined here
    subtitle?: string;
    imageSrc: string;
    price?: string | number;
    href: string;

}

const ProductCard = React.memo(({ product }: ProductCardProps) => {
    const { name, image_url, description, price } = product;
    const addItem = useCartStore((state) => state.addItem);

    const handleAddToCart = () => {
        addItem(product, 1);
        console.log(`Added ${name.value} to cart`); // Accessing name.value
    };


    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="aspect-square relative bg-gray-100">
                {image_url ? (
                    <Image
                        src={image_url}
                        alt={name.value} // Accessing name.value
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
                    {name.value} {/* Accessing name.value */}
                </h4>

                {description && (
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {description}
                    </p>
                )}

                <div className="flex items-center justify-between">
                    <span className="text-xl font-bold">
                        ${(price / 100).toFixed(2)}
                    </span>

                    <button
                        onClick={handleAddToCart}
                        aria-label={`Add ${name.value} to cart`} // Accessing name.value
                        className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                    >
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    );
});



export default ProductCard;
