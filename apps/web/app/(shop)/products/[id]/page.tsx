import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ApiError } from '@/lib/api/client';
import { getProductById } from '@/lib/api/products';
import { AddToCartButton } from '@/components/cart/add-to-cart-button';

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;

  try {
    const product = await getProductById(id);
    return {
      title: product.name,
      description: product.description,
      openGraph: {
        title: product.name,
        description: product.description,
        type: 'website',
      },
      twitter: {
        card: 'summary',
        title: product.name,
        description: product.description,
      },
    };
  } catch (error) {
    return { title: 'Product' };
  }
}

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params;

  try {
    const product = await getProductById(id);

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
          €{product.price}
        </p>
        <p className="mt-4 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
          {product.description}
        </p>
        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <AddToCartButton productId={product.id} />
          <Link
            href="/cart"
            className="text-sm font-medium text-violet-700 underline-offset-4 hover:underline dark:text-violet-300"
          >
            View cart
          </Link>
        </div>
      </div>
    );
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      notFound();
    }
    throw error;
  }
}