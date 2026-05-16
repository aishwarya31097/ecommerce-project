import type { Metadata } from "next";
import Link from "next/link";
import { PlaceOrderButton } from "@/components/cart/place-order-button";
import { CartLineItem } from "./_components/cart-line-item";
import { CartEmptyState } from "./_components/cart-empty-state";
import { ApiError } from "@/lib/api/client";
import { redirect } from "next/navigation";
import { getMyCart } from "@/lib/api/cart";
import { getServerAuthHeaders } from "@/lib/api/auth/server";
export const metadata: Metadata = {
  title: "Cart",
  description: "Your shopping cart",
  openGraph: {
    title: "Cart · Shop",
    description: "Review items before checkout.",
  },
};

export const dynamic = "force-dynamic";

function formatMoney(n: number) {
  return `€${n.toFixed(2)}`;
}

export default async function CartPage() {
  const authHeaders = await getServerAuthHeaders();
  if (!authHeaders.Authorization) {
    redirect("/login?next=/cart");
  }
  let cart: Awaited<ReturnType<typeof getMyCart>>;
  try {
    cart = await getMyCart({ revalidateSeconds: 0, headers: authHeaders });
  } catch (e) {
    if (e instanceof ApiError && e.status === 401) {
      redirect("/login?next=/cart");
    }
    const message =
      e instanceof ApiError
        ? e.message
        : e instanceof Error
          ? e.message
          : "Could not load cart.";
    return (
      <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-800 dark:text-zinc-50">
          Cart
        </h1>
        <div
          className="mt-8 rounded-2xl border border-red-200/90 bg-red-50/50 p-6 text-sm text-red-800 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-200"
          role="alert"
        >
          {message}
        </div>
        <p className="mt-8 text-center text-sm text-zinc-500">
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

  const empty = cart.items.length === 0;

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
          Review your bag, then place an order when you are ready.
        </p>
      </header>

      <div className="mt-8">
        {empty ? (
          <CartEmptyState />
        ) : (
          <>
            <ul className="list-none rounded-2xl border border-white/70 bg-white/65 p-4 shadow-sm shadow-violet-900/5 backdrop-blur-sm dark:border-zinc-800/80 dark:bg-zinc-950/55 sm:p-6">
              {cart.items.map((item) => (
                <CartLineItem key={item.id} item={item} />
              ))}
            </ul>
            <div className="mt-8 rounded-2xl border border-violet-200/80 bg-violet-50/40 p-6 dark:border-violet-900/40 dark:bg-violet-950/25">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <span className="text-sm text-zinc-600 dark:text-zinc-400">
                  Subtotal ({cart.summary.itemCount}{" "}
                  {cart.summary.itemCount === 1 ? "item" : "items"})
                </span>
                <span className="text-lg font-semibold tabular-nums text-zinc-900 dark:text-zinc-50">
                  {formatMoney(cart.summary.subtotal)}
                </span>
              </div>
              <PlaceOrderButton />
            </div>
          </>
        )}
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
