"use client";

import Link from "next/link";
import Image from "next/image";
import { Trash2 } from "lucide-react";
import { useCartStore } from "@/store/cart";

export default function CartPage() {
    const { items, total, removeItem, updateQuantity, clearCart } = useCartStore();

    if (items.length === 0) {
        return (
            <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 text-center">
                <h1 className="text-heading-2 text-dark-900 mb-4">Your Bag</h1>
                <p className="text-body text-dark-700 mb-8">There are no items in your bag.</p>
                <Link
                    href="/products"
                    className="inline-block rounded-full bg-dark-900 px-8 py-4 text-body-medium text-light-100 transition hover:opacity-90"
                >
                    Shop Now
                </Link>
            </main>
        );
    }

    return (
        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-heading-2 text-dark-900 mb-8">Your Bag</h1>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">
                <div className="flex flex-col gap-4">
                    {items.map((item) => (
                        <div key={item.id} className="flex gap-4 rounded-xl border border-light-300 p-4">
                            {item.image && (
                                <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-light-200">
                                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                                </div>
                            )}
                            <div className="flex flex-1 flex-col gap-2">
                                <p className="text-body-medium text-dark-900">{item.name}</p>
                                <p className="text-body text-dark-700">${item.price.toFixed(2)}</p>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                        className="flex h-8 w-8 items-center justify-center rounded-full border border-light-300 text-dark-900 hover:border-dark-500"
                                    >
                                        −
                                    </button>
                                    <span className="text-body text-dark-900">{item.quantity}</span>
                                    <button
                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                        className="flex h-8 w-8 items-center justify-center rounded-full border border-light-300 text-dark-900 hover:border-dark-500"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                            <div className="flex flex-col items-end justify-between">
                                <button
                                    onClick={() => removeItem(item.id)}
                                    className="text-dark-700 hover:text-dark-900"
                                    aria-label="Remove item"
                                >
                                    <Trash2 className="h-5 w-5" />
                                </button>
                                <p className="text-body-medium text-dark-900">
                                    ${(item.price * item.quantity).toFixed(2)}
                                </p>
                            </div>
                        </div>
                    ))}

                    <button
                        onClick={clearCart}
                        className="self-start text-caption text-dark-700 underline-offset-2 hover:underline"
                    >
                        Clear bag
                    </button>
                </div>

                <div className="flex flex-col gap-4 rounded-xl border border-light-300 p-6 h-fit">
                    <h2 className="text-heading-3 text-dark-900">Order Summary</h2>
                    <div className="flex justify-between text-body text-dark-700">
                        <span>Subtotal</span>
                        <span>${total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-body text-dark-700">
                        <span>Shipping</span>
                        <span>Free</span>
                    </div>
                    <div className="border-t border-light-300 pt-4 flex justify-between text-body-medium text-dark-900">
                        <span>Total</span>
                        <span>${total.toFixed(2)}</span>
                    </div>
                    <Link
                        href="/checkout"
                        className="rounded-full bg-dark-900 px-6 py-4 text-body-medium text-light-100 transition hover:opacity-90 text-center"
                    >
                        Checkout
                    </Link>
                </div>
            </div>
        </main>
    );
}
