"use client";

import { useState } from "react";
import { ShoppingBag } from "lucide-react";
import { useVariantStore } from "@/store/variant";
import { useCartStore } from "@/store/cart";

interface ProductActionsProps {
    productId: string;
    productName: string;
    price: number;
    galleryVariants: { color: string; images: string[] }[];
}

export default function ProductActions({ productId, productName, price, galleryVariants }: ProductActionsProps) {
    const [sizeError, setSizeError] = useState(false);

    const colorIndex = useVariantStore((s) => s.getSelected(productId));
    const selectedSize = useVariantStore((s) => s.getSelectedSize(productId));
    const addItem = useCartStore((s) => s.addItem);

    const selectedVariant = galleryVariants[colorIndex];
    const color = selectedVariant?.color ?? "Default";
    const image = selectedVariant?.images[0];

    function handleAddToBag() {
        if (!selectedSize) {
            setSizeError(true);
            return;
        }
        setSizeError(false);
        addItem({
            id: `${productId}-${color}-${selectedSize}`,
            name: `${productName} — ${color} / ${selectedSize}`,
            price,
            image,
        });
    }

    return (
        <div className="flex flex-col gap-1.5">
            <button
                onClick={handleAddToBag}
                className="flex items-center justify-center gap-2 rounded-full bg-dark-900 px-6 py-4 text-body-medium text-light-100 transition hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-[--color-dark-500]"
            >
                <ShoppingBag className="h-5 w-5" />
                Add to Bag
            </button>
            {sizeError && (
                <p className="text-center text-caption text-[--color-red]">Please select a size.</p>
            )}
        </div>
    );
}
