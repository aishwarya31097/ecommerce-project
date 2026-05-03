"use client";

import { useState } from "react";

/**
 * Day 3: a tiny client component so you can see the difference from
 * default server pages (hooks + event handlers need "use client").
 */
export function CartQuantityDemo() {
  const [qty, setQty] = useState(1);

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-xl border border-white/70 bg-white/70 p-4 shadow-sm backdrop-blur-sm dark:border-zinc-700 dark:bg-zinc-950/60">
      <span className="text-sm text-zinc-600 dark:text-zinc-400">
        Demo line item (client state)
      </span>
      <div className="flex items-center gap-2">
        <button
          type="button"
          className="rounded-lg border border-violet-200/90 bg-white px-3 py-1.5 text-sm text-zinc-800 transition hover:bg-violet-50 dark:border-violet-900/60 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
          onClick={() => setQty((q) => Math.max(1, q - 1))}
          aria-label="Decrease quantity"
        >
          −
        </button>
        <span className="min-w-[2ch] text-center text-sm font-medium tabular-nums">
          {qty}
        </span>
        <button
          type="button"
          className="rounded-lg border border-violet-200/90 bg-white px-3 py-1.5 text-sm text-zinc-800 transition hover:bg-violet-50 dark:border-violet-900/60 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
          onClick={() => setQty((q) => q + 1)}
          aria-label="Increase quantity"
        >
          +
        </button>
      </div>
    </div>
  );
}
