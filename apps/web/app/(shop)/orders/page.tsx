import type { Metadata } from "next";
import Link from "next/link";
import { getOrders } from "@/lib/api/orders";
import { ApiError } from "@/lib/api/client";
import { getDemoUserId } from "@/lib/demo-user";

export const metadata: Metadata = {
  title: "Orders",
  description: "Your order history",
};

export const dynamic = "force-dynamic";

function formatMoney(value: string | number) {
  const n = typeof value === "string" ? Number(value) : value;
  return `€${n.toFixed(2)}`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default async function OrdersPage() {
  let orders: Awaited<ReturnType<typeof getOrders>>;
  try {
    const userId = getDemoUserId();
    orders = await getOrders(userId, { revalidateSeconds: 0 });
  } catch (e) {
    const message =
      e instanceof ApiError
        ? e.message
        : e instanceof Error
          ? e.message
          : "Could not load orders.";
    return (
      <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-800 dark:text-zinc-50">
          Orders
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

  const sorted = [...orders].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <header className="max-w-xl">
        <p className="text-xs font-medium uppercase tracking-wider text-violet-600 dark:text-violet-400">
          History
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-800 dark:text-zinc-50">
          Orders
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
          Past checkouts for your demo account.
        </p>
      </header>

      <div className="mt-8">
        {sorted.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-zinc-300/90 bg-white/50 p-10 text-center dark:border-zinc-700 dark:bg-zinc-950/40">
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              No orders yet. Add items to your cart and place an order.
            </p>
            <Link
              href="/cart"
              className="mt-6 inline-block text-sm font-medium text-violet-700 underline-offset-4 hover:underline dark:text-violet-300"
            >
              Go to cart
            </Link>
          </div>
        ) : (
          <ul className="list-none space-y-3">
            {sorted.map((order) => (
              <li key={order.id}>
                <Link
                  href={`/orders/${order.id}`}
                  className="block rounded-2xl border border-white/70 bg-white/65 p-5 shadow-sm shadow-violet-900/5 backdrop-blur-sm transition hover:border-violet-200/80 dark:border-zinc-800/80 dark:bg-zinc-950/55 dark:hover:border-violet-900/50"
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <p className="font-mono text-xs text-zinc-500 dark:text-zinc-400">
                      {order.id.slice(0, 8)}…
                    </p>
                    <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium lowercase text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200">
                      {order.status}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                    {formatDate(order.createdAt)} · {order.items.length}{" "}
                    {order.items.length === 1 ? "item" : "items"}
                  </p>
                  <p className="mt-2 text-lg font-semibold tabular-nums text-zinc-900 dark:text-zinc-50">
                    {formatMoney(order.total)}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      <p className="mt-10 text-center text-sm text-zinc-500">
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
