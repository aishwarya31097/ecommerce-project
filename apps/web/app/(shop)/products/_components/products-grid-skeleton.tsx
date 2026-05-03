/** Fallback while `ProductsGrid` suspends — matches grid spacing only (header stays visible). */
export function ProductsGridSkeleton() {
  return (
    <ul className="mt-10 grid list-none gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <li
          key={i}
          className="overflow-hidden rounded-2xl border border-white/50 bg-white/50 shadow-sm dark:border-zinc-800/70 dark:bg-zinc-950/40"
        >
          <div className="h-1.5 animate-pulse bg-gradient-to-r from-violet-200 to-pink-100 dark:from-violet-900 dark:to-purple-900" />
          <div className="space-y-3 p-5">
            <div className="h-5 w-3/4 animate-pulse rounded bg-violet-100/90 dark:bg-zinc-800" />
            <div className="h-3 w-full animate-pulse rounded bg-violet-50/90 dark:bg-zinc-800/80" />
            <div className="h-3 w-5/6 animate-pulse rounded bg-violet-50/90 dark:bg-zinc-800/80" />
          </div>
        </li>
      ))}
    </ul>
  );
}
