"use client";

import { create } from "zustand";

type State = {
    selectedByProduct: Record<string, number>;
    setSelected: (productId: string, index: number) => void;
    getSelected: (productId: string, fallback?: number) => number;
    selectedSizeByProduct: Record<string, string | null>;
    setSelectedSize: (productId: string, size: string | null) => void;
    getSelectedSize: (productId: string) => string | null;
};

export const useVariantStore = create<State>((set, get) => ({
    selectedByProduct: {},
    setSelected: (productId, index) =>
        set((s) => ({
            selectedByProduct: { ...s.selectedByProduct, [productId]: index },
        })),
    getSelected: (productId, fallback = 0) => {
        const map = get().selectedByProduct;
        return map[productId] ?? fallback;
    },
    selectedSizeByProduct: {},
    setSelectedSize: (productId, size) =>
        set((s) => ({
            selectedSizeByProduct: { ...s.selectedSizeByProduct, [productId]: size },
        })),
    getSelectedSize: (productId) => {
        return get().selectedSizeByProduct[productId] ?? null;
    },
}));