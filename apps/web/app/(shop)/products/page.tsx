import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ProductsGrid } from "./_components/products-grid";
import { ProductsGridSkeleton } from "./_components/products-grid-skeleton";

export const metadata: Metadata = {
  title: "Products",
  description: "Browse products — mock data + loading / error boundaries",
};

type Props = {
  searchParams?: Promise<{ fail?: string }>;
};

export default function ProductsPage({ searchParams }: Props) {
  return (
    <div className="products-shell mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <header className="max-w-2xl">
        <p className="text-xs font-medium uppercase tracking-wider text-violet-600/90 dark:text-violet-300/90">
          Catalogue
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-800 dark:text-zinc-50">
          Soft pastel picks
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
          Header renders immediately; the grid streams after{" "}
          <code className="rounded-md bg-violet-100/80 px-1.5 py-0.5 text-xs text-violet-900 dark:bg-violet-950/80 dark:text-violet-200">
            fetchProducts
          </code>
          . Still try{" "}
          <code className="rounded-md bg-violet-100/80 px-1.5 py-0.5 text-xs text-violet-900 dark:bg-violet-950/80 dark:text-violet-200">
            /products?fail=1
          </code>{" "}
          for the segment error boundary.
        </p>
      </header>

      <Suspense fallback={<ProductsGridSkeleton />}>
        <ProductsGrid searchParams={searchParams} />
      </Suspense>

      <p className="mt-12 text-center text-sm text-zinc-500 dark:text-zinc-500">
        <Link
          href="/cart"
          className="font-medium text-violet-700 underline-offset-4 hover:underline dark:text-violet-300"
        >
          Continue to cart
        </Link>
      </p>
    </div>
  );
}
