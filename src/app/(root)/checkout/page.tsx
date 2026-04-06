"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cart";

export default function CheckoutPage() {
    const router = useRouter();
    const { items, total, clearCart } = useCartStore();
    const [placing, setPlacing] = useState(false);
    const [form, setForm] = useState({
        email: "",
        firstName: "",
        lastName: "",
        address: "",
        city: "",
        state: "",
        zip: "",
        country: "US",
        cardNumber: "",
        expiry: "",
        cvv: "",
    });

    if (items.length === 0) {
        return (
            <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 text-center">
                <h1 className="text-heading-2 text-dark-900 mb-4">Checkout</h1>
                <p className="text-body text-dark-700 mb-8">Your bag is empty.</p>
                <Link href="/products" className="inline-block rounded-full bg-dark-900 px-8 py-4 text-body-medium text-light-100 transition hover:opacity-90">
                    Shop Now
                </Link>
            </main>
        );
    }

    const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
        setForm((f) => ({ ...f, [key]: e.target.value }));

    function handlePlaceOrder(e: React.FormEvent) {
        e.preventDefault();
        setPlacing(true);
        setTimeout(() => {
            clearCart();
            router.push("/checkout/confirmation");
        }, 1200);
    }

    const inputClass = "w-full rounded-lg border border-light-300 px-4 py-3 text-body text-dark-900 outline-none focus:border-dark-900 transition";

    return (
        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
            <nav className="mb-6 text-caption text-dark-700">
                <Link href="/cart" className="hover:underline">Bag</Link>
                {" / "}
                <span className="text-dark-900">Checkout</span>
            </nav>

            <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_380px]">
                <form onSubmit={handlePlaceOrder} className="flex flex-col gap-8">

                    {/* Contact */}
                    <section className="flex flex-col gap-4">
                        <h2 className="text-heading-3 text-dark-900">Contact</h2>
                        <input required type="email" placeholder="Email" value={form.email} onChange={set("email")} className={inputClass} />
                    </section>

                    {/* Shipping */}
                    <section className="flex flex-col gap-4">
                        <h2 className="text-heading-3 text-dark-900">Shipping Address</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <input required placeholder="First name" value={form.firstName} onChange={set("firstName")} className={inputClass} />
                            <input required placeholder="Last name" value={form.lastName} onChange={set("lastName")} className={inputClass} />
                        </div>
                        <input required placeholder="Address" value={form.address} onChange={set("address")} className={inputClass} />
                        <div className="grid grid-cols-2 gap-4">
                            <input required placeholder="City" value={form.city} onChange={set("city")} className={inputClass} />
                            <input required placeholder="State / Province" value={form.state} onChange={set("state")} className={inputClass} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <input required placeholder="ZIP / Postal code" value={form.zip} onChange={set("zip")} className={inputClass} />
                            <select required value={form.country} onChange={set("country")} className={inputClass}>
                                <option value="US">United States</option>
                                <option value="CA">Canada</option>
                                <option value="GB">United Kingdom</option>
                                <option value="AU">Australia</option>
                            </select>
                        </div>
                    </section>

                    {/* Payment */}
                    <section className="flex flex-col gap-4">
                        <h2 className="text-heading-3 text-dark-900">Payment</h2>
                        <input
                            required
                            placeholder="Card number"
                            value={form.cardNumber}
                            onChange={set("cardNumber")}
                            maxLength={19}
                            className={inputClass}
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <input required placeholder="MM / YY" value={form.expiry} onChange={set("expiry")} maxLength={7} className={inputClass} />
                            <input required placeholder="CVV" value={form.cvv} onChange={set("cvv")} maxLength={4} className={inputClass} />
                        </div>
                    </section>

                    <button
                        type="submit"
                        disabled={placing}
                        className="rounded-full bg-dark-900 px-6 py-4 text-body-medium text-light-100 transition hover:opacity-90 disabled:opacity-60"
                    >
                        {placing ? "Placing order…" : `Place Order · $${total.toFixed(2)}`}
                    </button>
                </form>

                {/* Order summary */}
                <aside className="flex flex-col gap-4 rounded-xl border border-light-300 p-6 h-fit lg:sticky lg:top-6">
                    <h2 className="text-heading-3 text-dark-900">Order Summary</h2>

                    <ul className="flex flex-col gap-4">
                        {items.map((item) => (
                            <li key={item.id} className="flex gap-3">
                                {item.image && (
                                    <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-light-200">
                                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                                    </div>
                                )}
                                <div className="flex flex-1 flex-col gap-0.5">
                                    <p className="text-body-medium text-dark-900 leading-snug">{item.name}</p>
                                    <p className="text-caption text-dark-700">Qty: {item.quantity}</p>
                                </div>
                                <p className="text-body-medium text-dark-900 whitespace-nowrap">
                                    ${(item.price * item.quantity).toFixed(2)}
                                </p>
                            </li>
                        ))}
                    </ul>

                    <div className="border-t border-light-300 pt-4 flex flex-col gap-2">
                        <div className="flex justify-between text-body text-dark-700">
                            <span>Subtotal</span>
                            <span>${total.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-body text-dark-700">
                            <span>Shipping</span>
                            <span>Free</span>
                        </div>
                        <div className="flex justify-between text-body-medium text-dark-900 pt-2 border-t border-light-300">
                            <span>Total</span>
                            <span>${total.toFixed(2)}</span>
                        </div>
                    </div>
                </aside>
            </div>
        </main>
    );
}
