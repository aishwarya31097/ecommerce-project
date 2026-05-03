import Link from "next/link";

export default function ProductNotFound() {
  return (
    <div className="mx-auto max-w-lg px-4 py-20 text-center sm:px-6">
      <p className="text-sm font-medium text-violet-600 dark:text-violet-400">
        404
      </p>
      <h1 className="mt-2 text-2xl font-semibold text-zinc-800 dark:text-zinc-100">
        Product not found
      </h1>
      <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
        That ID is not in the mock catalogue yet.
      </p>
      <Link
        href="/products"
        className="mt-8 inline-block text-sm font-medium text-violet-700 underline-offset-4 hover:underline dark:text-violet-300"
      >
        ← Back to products
      </Link>
    </div>
  );
}
