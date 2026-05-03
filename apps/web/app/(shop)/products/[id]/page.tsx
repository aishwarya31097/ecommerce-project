import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchProductById } from "@/lib/products/data";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = await fetchProductById(id);
  if (!product) return { title: "Product" };
  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      type: "website",
    },
    twitter: {
      card: "summary",
      title: product.name,
      description: product.description,
    },
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params;
  const product = await fetchProductById(id);

  if (!product) notFound();

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <Link
        href="/products"
        className="text-sm font-medium text-violet-700 underline-offset-4 hover:underline dark:text-violet-300"
      >
        ← Back to products
      </Link>
      <h1 className="mt-6 text-3xl font-semibold tracking-tight text-zinc-800 dark:text-zinc-50">
        {product.name}
      </h1>
      <p className="mt-3 text-lg font-medium tabular-nums text-violet-900 dark:text-violet-200">
        {product.price}
      </p>
      <p className="mt-4 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
        {product.description}
      </p>
      <p className="mt-10 rounded-xl border border-dashed border-violet-200/80 bg-white/50 p-4 text-sm text-zinc-500 dark:border-violet-900/50 dark:bg-zinc-950/40 dark:text-zinc-500">
        Detail shell — swap this body for gallery + “Add to cart” when you wire the API.
      </p>
    </div>
  );
}
