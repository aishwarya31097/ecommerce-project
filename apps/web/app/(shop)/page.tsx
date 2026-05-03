import Link from "next/link";

export default function Home() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
        Day 3 — App Router shell
      </p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
        Welcome to your shop
      </h1>
      <p className="mt-4 max-w-xl text-base text-zinc-600 dark:text-zinc-400">
        You now have three routes: home, a product list, and a cart page.
        Layout and nav live in the root layout; each route is its own{" "}
        <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-sm dark:bg-zinc-800">
          page.tsx
        </code>{" "}
        under{" "}
        <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-sm dark:bg-zinc-800">
          app/
        </code>
        .
      </p>
      <div className="mt-10 flex flex-wrap gap-3">
        <Link
          href="/products"
          className="inline-flex items-center justify-center rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          Browse products
        </Link>
        <Link
          href="/cart"
          className="inline-flex items-center justify-center rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm font-medium text-zinc-900 transition hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50 dark:hover:bg-zinc-900"
        >
          View cart
        </Link>
      </div>
    </div>
  );
}
