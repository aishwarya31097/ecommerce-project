import Link from "next/link";
import type { Product } from "@/lib/products/data";

const accentBar: Record<Product["accent"], string> = {
  rose: "bg-gradient-to-r from-rose-200/90 to-pink-100/80",
  lavender: "bg-gradient-to-r from-violet-200/90 to-purple-100/80",
  mint: "bg-gradient-to-r from-emerald-200/85 to-teal-100/75",
  peach: "bg-gradient-to-r from-amber-200/90 to-orange-100/75",
  beige: "bg-gradient-to-r from-gray-200/90 to-gray-100/80",
};

type Props = {
  product: Product;
};

/** Option A: extract UI here so you can iterate on polish without bloating the page. */
export function ProductCard({ product }: Props) {
  return (
    <article className="group relative overflow-hidden rounded-2xl border border-white/60 bg-white/60 shadow-sm shadow-violet-900/5 backdrop-blur-md transition duration-300 hover:-translate-y-0.5 hover:border-violet-200/90 hover:shadow-md hover:shadow-violet-900/10 dark:border-zinc-800/80 dark:bg-zinc-950/60 dark:hover:border-violet-500/30">
      <div
        className={`relative h-40 w-full shrink-0 ${accentBar[product.accent]}`}
        aria-hidden
      />
      <div className="flex flex-col gap-3 p-5 pt-4">
        <div>
          <h2 className="text-base font-semibold tracking-tight text-zinc-800 dark:text-zinc-100">
            {product.name}
          </h2>
          <p className="mt-1.5 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
            {product.description}
          </p>
        </div>
        <div className="mt-auto flex items-center justify-between gap-3 pt-1">
          <span className="text-sm font-medium tabular-nums text-violet-900/90 dark:text-violet-200/90">
            {product.price}
          </span>
          <span className="text-xs font-medium text-violet-600/80 opacity-0 transition group-hover:opacity-100 group-focus-within:opacity-100 dark:text-violet-300/90">
            View →
          </span>
        </div>
      </div>
      <Link
        href={`/products/${product.id}`}
        className="absolute inset-0 z-10 rounded-2xl outline-none ring-violet-500 ring-offset-2 ring-offset-white focus-visible:ring-2 dark:ring-violet-400 dark:ring-offset-zinc-950"
        aria-label={`Open ${product.name}`}
      />
    </article>
  );
}
