import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ApiError } from "@/lib/api/client";
import { getOrderById } from "@/lib/api/orders";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Order ${id.slice(0, 8)}…`,
    description: "Order confirmation",
  };
}

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

export default async function OrderConfirmationPage({ params }: Props) {
  const { id } = await params;

  try {
    const order = await getOrderById(id, { revalidateSeconds: 0 });

    return (
      <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
        <p className="text-xs font-medium uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
          Confirmed
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-800 dark:text-zinc-50">
          Thank you for your order
        </h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          Your cart was cleared. This order is saved with status{" "}
          <span className="font-medium lowercase text-zinc-800 dark:text-zinc-200">
            {order.status}
          </span>
          .
        </p>

        <div className="mt-8 rounded-2xl border border-white/70 bg-white/65 p-6 shadow-sm shadow-violet-900/5 backdrop-blur-sm dark:border-zinc-800/80 dark:bg-zinc-950/55">
          <dl className="grid gap-3 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-zinc-500 dark:text-zinc-400">Order ID</dt>
              <dd className="mt-0.5 font-mono text-xs text-zinc-800 dark:text-zinc-100">
                {order.id}
              </dd>
            </div>
            <div>
              <dt className="text-zinc-500 dark:text-zinc-400">Placed</dt>
              <dd className="mt-0.5 text-zinc-800 dark:text-zinc-100">
                {formatDate(order.createdAt)}
              </dd>
            </div>
          </dl>

          <ul className="mt-6 list-none divide-y divide-zinc-200/80 dark:divide-zinc-800/80">
            {order.items.map((item) => (
              <li
                key={item.id}
                className="flex flex-wrap items-baseline justify-between gap-2 py-4 first:pt-0 last:pb-0"
              >
                <div>
                  <p className="font-medium text-zinc-800 dark:text-zinc-100">
                    {item.productName}
                  </p>
                  <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                    Qty {item.quantity} × {formatMoney(item.unitPrice)}
                  </p>
                </div>
                <p className="text-sm font-medium tabular-nums text-zinc-800 dark:text-zinc-100">
                  {formatMoney(Number(item.unitPrice) * item.quantity)}
                </p>
              </li>
            ))}
          </ul>

          <div className="mt-6 flex items-baseline justify-between border-t border-zinc-200/80 pt-4 dark:border-zinc-800/80">
            <span className="text-sm text-zinc-600 dark:text-zinc-400">Total</span>
            <span className="text-lg font-semibold tabular-nums text-zinc-900 dark:text-zinc-50">
              {formatMoney(order.total)}
            </span>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-4 text-sm">
          <Link
            href="/orders"
            className="font-medium text-violet-700 underline-offset-4 hover:underline dark:text-violet-300"
          >
            All orders
          </Link>
          <Link
            href="/products"
            className="font-medium text-violet-700 underline-offset-4 hover:underline dark:text-violet-300"
          >
            Continue shopping
          </Link>
        </div>
      </div>
    );
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      notFound();
    }
    throw error;
  }
}
