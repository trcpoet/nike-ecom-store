"use client";

import { useVariantStore } from "@/store/variant";

export type SizeOption = { name: string; available: boolean };

const DEFAULT_SIZES: SizeOption[] = ["5", "5.5", "6", "6.5", "7", "7.5", "8", "8.5", "9", "9.5", "10", "10.5", "11", "11.5", "12"].map((n) => ({ name: n, available: true }));

export interface SizePickerProps {
    productId: string;
    sizes?: SizeOption[];
    className?: string;
}

export default function SizePicker({ productId, sizes = DEFAULT_SIZES, className = "" }: SizePickerProps) {
    const setSelectedSize = useVariantStore((s) => s.setSelectedSize);
    const selected = useVariantStore((s) => s.getSelectedSize(productId));

    return (
        <div className={`flex flex-col gap-3 ${className}`}>
            <div className="flex items-center justify-between">
                <p className="text-body-medium text-dark-900">Select Size</p>
                <button className="text-caption text-dark-700 underline-offset-2 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[--color-dark-500]">
                    Size Guide
                </button>
            </div>

            <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
                {sizes.map(({ name, available }) => {
                    const isActive = selected === name;
                    return (
                        <button
                            key={name}
                            onClick={() => available && setSelectedSize(productId, isActive ? null : name)}
                            disabled={!available}
                            className={`relative rounded-lg border px-3 py-3 text-center text-body transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[--color-dark-500] ${
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
    );
}