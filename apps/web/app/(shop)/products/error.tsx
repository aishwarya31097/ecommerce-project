"use client";

export default function ProductsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto max-w-lg px-4 py-16 text-center sm:px-6">
      <div className="rounded-3xl border border-rose-100 bg-gradient-to-b from-rose-50 to-white p-8 shadow-sm dark:border-rose-900/40 dark:from-rose-950/40 dark:to-zinc-950">
        <p className="text-sm font-medium text-rose-600 dark:text-rose-300">
          Something went wrong
        </p>
        <h1 className="mt-2 text-xl font-semibold text-zinc-800 dark:text-zinc-100">
          Could not load products
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
          {error.message}
        </p>
        <button
          type="button"
          onClick={() => reset()}
          className="mt-6 inline-flex items-center justify-center rounded-full bg-violet-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-violet-700 dark:bg-violet-500 dark:hover:bg-violet-400"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
