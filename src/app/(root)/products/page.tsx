import { Card } from "@/components";
import Filters from "@/components/Filters";
import Sort from "@/components/Sort";
import { parseFilterParams } from "@/lib/utils/query";
import { getAllProducts } from "@/lib/actions/product";
import ProductCard from "@/components/ProductCard";
import React from "react";
import { Product } from "@/lib/db/schema/products"; // Ensure you're importing the Product type correctly

type SearchParams = Record<string, string | string[] | undefined>;

export default async function ProductsPage({
                                               searchParams,
                                           }: {
    searchParams: Promise<SearchParams>;
}) {
    const sp = await searchParams;
    const parsed = parseFilterParams(sp);

    // Fetch products
    const { products, totalCount }: { products: Product[]; totalCount: number } = await getAllProducts(parsed);

    return (
        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <header className="flex items-center justify-between py-6">
                <h1 className="text-heading-3 text-dark-900">New ({totalCount})</h1>
                <Sort />
            </header>

            <section className="grid grid-cols-1 gap-6 md:grid-cols-[240px_1fr]">
                <Filters />
                <div>
                    {products.length === 0 ? (
                        <div className="rounded-lg border border-light-300 p-8 text-center">
                            <p className="text-body text-dark-700">No products match your filters.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 pb-6">
                            {products.map((p) => (
                                <ProductCard
                                    key={p.id} // This is fine as it is
                                    product={p}
                                    title={p.name.value}
                                    imageSrc={p.image_url ?? "/shoes/shoe-1.jpg"}
                                    price={p.price}
                                    href={`/products/${p.id}`}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
}
