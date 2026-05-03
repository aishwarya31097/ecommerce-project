import { ProductsGridSkeleton } from "./_components/products-grid-skeleton";

/** Whole-segment fallback on navigation; page also uses `<Suspense>` for grid-only streaming. */
export default function ProductsLoading() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <div className="h-8 w-40 animate-pulse rounded-lg bg-violet-100/80 dark:bg-violet-950/50" />
      <div className="mt-3 h-4 w-full max-w-md animate-pulse rounded bg-violet-100/60 dark:bg-violet-950/40" />
      <ProductsGridSkeleton />
    </div>
  );
}
