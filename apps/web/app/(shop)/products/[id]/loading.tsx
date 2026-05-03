export default function ProductDetailLoading() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      {/* Mirrors detail page: back link → title → price → description → dashed box */}
      <div className="h-4 w-36 animate-pulse rounded-md bg-violet-100/90 dark:bg-violet-950/50" />
      <div className="mt-8 h-9 w-4/5 max-w-md animate-pulse rounded-lg bg-violet-100/80 dark:bg-zinc-800" />
      <div className="mt-4 h-7 w-28 animate-pulse rounded-md bg-violet-50/90 dark:bg-zinc-800/90" />
      <div className="mt-6 space-y-2">
        <div className="h-4 w-full animate-pulse rounded bg-violet-50/80 dark:bg-zinc-800/70" />
        <div className="h-4 w-full animate-pulse rounded bg-violet-50/80 dark:bg-zinc-800/70" />
        <div className="h-4 w-3/4 animate-pulse rounded bg-violet-50/80 dark:bg-zinc-800/70" />
      </div>
      <div className="mt-10 h-24 animate-pulse rounded-xl border border-dashed border-violet-200/40 bg-white/40 dark:border-violet-900/30 dark:bg-zinc-950/30" />
    </div>
  );
}
