import Link from "next/link";

export default function ConfirmationPage() {
    return (
        <main className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-24 text-center">
            <div className="flex flex-col items-center gap-6">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-dark-900">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-light-100" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h1 className="text-heading-2 text-dark-900">Order Placed!</h1>
                <p className="text-body text-dark-700 max-w-sm">
                    Thank you for your order. You'll receive a confirmation email shortly.
                </p>
                <Link
                    href="/products"
                    className="rounded-full bg-dark-900 px-8 py-4 text-body-medium text-light-100 transition hover:opacity-90"
                >
                    Continue Shopping
                </Link>
            </div>
        </main>
    );
}
