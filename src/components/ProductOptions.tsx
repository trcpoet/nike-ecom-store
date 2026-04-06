"use client";

import { useState } from "react";
import Image from "next/image";
import { Check, ShoppingBag, Heart } from "lucide-react";
import { useVariantStore } from "@/store/variant";
import { useCartStore } from "@/store/cart";

export type SizeVariant = {
    name: string;
    available: boolean;
    sortOrder: number;
    price: number;
    salePrice: number | null;
};

export type ColorVariant = {
    color: string;
    images: string[];
    available: boolean;
    sizes: SizeVariant[];
};

interface ProductOptionsProps {
    productId: string;
    productName: string;
    colorVariants: ColorVariant[];
}

function formatPrice(price: number | null | undefined) {
    if (price == null) return undefined;
    return `$${price.toFixed(2)}`;
}

function firstValidImage(images: string[]) {
    return images.find((s) => s.trim().length > 0);
}

export default function ProductOptions({ productId, productName, colorVariants }: ProductOptionsProps) {
    const [sizeError, setSizeError] = useState(false);

    const colorIndex = useVariantStore((s) => s.getSelected(productId));
    const setColorIndex = useVariantStore((s) => s.setSelected);
    const selectedSize = useVariantStore((s) => s.getSelectedSize(productId));
    const setSelectedSize = useVariantStore((s) => s.setSelectedSize);
    const addItem = useCartStore((s) => s.addItem);

    const selectedColor = colorVariants[colorIndex] ?? colorVariants[0];
    const sizes = [...(selectedColor?.sizes ?? [])].sort((a, b) => a.sortOrder - b.sortOrder);

    // Price: use selected size's price if chosen, otherwise min available price for this color
    const selectedSizeData = sizes.find((s) => s.name === selectedSize);
    const priceSource = selectedSizeData ?? sizes.find((s) => s.available) ?? sizes[0];
    const basePrice = priceSource?.price ?? null;
    const salePrice = priceSource?.salePrice ?? null;
    const displayPrice = salePrice !== null ? salePrice : basePrice;
    const compareAt = salePrice !== null ? basePrice : null;
    const discount =
        compareAt && displayPrice && compareAt > displayPrice
            ? Math.round(((compareAt - displayPrice) / compareAt) * 100)
            : null;

    function handleColorSelect(index: number) {
        if (!colorVariants[index].available) return;
        setColorIndex(productId, index);
        setSelectedSize(productId, null);
        setSizeError(false);
    }

    function handleAddToBag() {
        if (!selectedSize) {
            setSizeError(true);
            return;
        }
        setSizeError(false);
        addItem({
            id: `${productId}-${selectedColor?.color}-${selectedSize}`,
            name: `${productName} — ${selectedColor?.color} / ${selectedSize}`,
            price: displayPrice ?? 0,
            image: firstValidImage(selectedColor?.images ?? []),
        });
    }

    return (
        <>
            {/* Price */}
            <div className="flex items-center gap-3">
                <p className="text-lead text-dark-900">{formatPrice(displayPrice)}</p>
                {compareAt && (
                    <>
                        <span className="text-body text-dark-700 line-through">{formatPrice(compareAt)}</span>
                        {discount !== null && (
                            <span className="rounded-full border border-light-300 px-2 py-1 text-caption text-[--color-green]">
                                {discount}% off
                            </span>
                        )}
                    </>
                )}
            </div>

            {/* Color swatches */}
            {colorVariants.length > 1 && (
                <div className="flex flex-col gap-3">
                <p className="text-body-medium text-dark-900">
                    Color: <span className="font-normal text-dark-700">{selectedColor?.color}</span>
                </p>
                <div className="flex flex-wrap gap-3" role="listbox" aria-label="Choose color">
                    {colorVariants.map((v, i) => {
                        const src = firstValidImage(v.images);
                        if (!src) return null;
                        const isActive = colorIndex === i;
                        return (
                            <button
                                key={`${v.color}-${i}`}
                                onClick={() => handleColorSelect(i)}
                                disabled={!v.available}
                                aria-label={`Color ${v.color}${!v.available ? " (out of stock)" : ""}`}
                                aria-selected={isActive}
                                role="option"
                                className={`relative h-[72px] w-[120px] overflow-hidden rounded-lg ring-1 ring-light-300 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[--color-dark-500] ${
                                    !v.available
                                        ? "cursor-not-allowed opacity-40"
                                        : isActive
                                        ? "ring-[--color-dark-500]"
                                        : "hover:ring-dark-500"
                                }`}
                            >
                                <Image src={src} alt={v.color} fill sizes="120px" className="object-cover" />
                                {!v.available && (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="h-px w-full rotate-45 bg-dark-900/40" />
                                    </div>
                                )}
                                {isActive && v.available && (
                                    <span className="absolute right-1 top-1 rounded-full bg-light-100 p-1">
                                        <Check className="h-4 w-4 text-dark-900" aria-hidden="true" />
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>
                </div>
            )}

            {/* Size picker */}
            <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                    <p className="text-body-medium text-dark-900">Select Size</p>
                    <button className="text-caption text-dark-700 underline-offset-2 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[--color-dark-500]">
                        Size Guide
                    </button>
                </div>
                <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
                    {sizes.map(({ name, available }) => {
                        const isActive = selectedSize === name;
                        return (
                            <button
                                key={name}
                                onClick={() => available && setSelectedSize(productId, isActive ? null : name)}
                                disabled={!available}
                                className={`rounded-lg border px-3 py-3 text-center text-body transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[--color-dark-500] ${
                                    !available
                                        ? "cursor-not-allowed border-light-300 text-dark-700 opacity-40 line-through"
                                        : isActive
                                        ? "border-dark-900 text-dark-900"
                                        : "border-light-300 text-dark-700 hover:border-dark-500"
                                }`}
                                aria-pressed={isActive}
                                aria-disabled={!available}
                            >
                                {name}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3">
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
                <button className="flex items-center justify-center gap-2 rounded-full border border-light-300 px-6 py-4 text-body-medium text-dark-900 transition hover:border-dark-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-[--color-dark-500]">
                    <Heart className="h-5 w-5" />
                    Favorite
                </button>
            </div>
        </>
    );
}
