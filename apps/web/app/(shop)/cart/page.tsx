import type { Metadata } from "next";
import Link from "next/link";
import { CartQuantityDemo } from "@/components/cart-quantity-demo";
import { CartEmptyState } from "./_components/cart-empty-state";

export const metadata: Metadata = {
  title: "Cart",
  description: "Your shopping cart",
  openGraph: {
    title: "Cart · Shop",
    description: "Review items before checkout.",
  },
};

export default function CartPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <header className="max-w-xl">
        <p className="text-xs font-medium uppercase tracking-wider text-violet-600 dark:text-violet-400">
          Checkout prep
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-800 dark:text-zinc-50">
          Cart
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
          Empty-state UX ships early so Day 9 only plugs data into shells you
          already like.
        </p>
      </header>

      <div className="mt-8 space-y-10">
        <CartEmptyState />

        <section
          aria-labelledby="cart-preview-heading"
          className="rounded-2xl border border-dashed border-violet-200/90 bg-violet-50/40 p-6 dark:border-violet-900/50 dark:bg-violet-950/25"
        >
          <h2
            id="cart-preview-heading"
            className="text-sm font-semibold text-zinc-800 dark:text-zinc-200"
          >
            Interactive preview
          </h2>
          <p className="mt-1 text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
            The row below is a{" "}
            <strong className="font-medium text-zinc-700 dark:text-zinc-300">
              client component
            </strong>{" "}
            (<code className="rounded bg-white/80 px-1 py-0.5 font-mono text-[0.65rem] dark:bg-zinc-900">
              useState
            </code>
            ). Quantity stays in the browser until you persist it with APIs +
            cookies later.
          </p>
          <div className="mt-5">
            <CartQuantityDemo />
          </div>
        </section>
      </div>

      <p className="mt-10 text-center text-sm text-zinc-500 dark:text-zinc-500">
        <Link
          href="/products"
          className="font-medium text-violet-700 underline-offset-4 hover:underline dark:text-violet-300"
        >
          Continue shopping
        </Link>
      </p>
    </div>
  );
}
