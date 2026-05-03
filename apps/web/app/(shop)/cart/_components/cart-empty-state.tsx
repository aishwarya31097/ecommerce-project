import Link from "next/link";

export function CartEmptyState() {
  return (
    <div className="rounded-2xl border border-white/70 bg-white/65 p-8 shadow-sm shadow-violet-900/5 backdrop-blur-sm dark:border-zinc-800/80 dark:bg-zinc-950/55">
      <p className="text-xs font-medium uppercase tracking-wider text-violet-600 dark:text-violet-400">
        Bag
      </p>
      <h2 className="mt-2 text-xl font-semibold tracking-tight text-zinc-800 dark:text-zinc-50">
        Your cart is empty
      </h2>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
        Nothing persisted yet — cart APIs land around Day 7 in your roadmap;
        the storefront wiring is Day 9. Until then, this is the real empty
        state users will see.
      </p>
      <Link
        href="/products"
        className="mt-6 inline-flex items-center justify-center rounded-full bg-violet-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-violet-700 dark:bg-violet-500 dark:hover:bg-violet-400"
      >
        Browse products
      </Link>
    </div>
  );
}
