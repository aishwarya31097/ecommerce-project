import { ProductCard } from '@/components/product-card';
import { getProducts } from '@/lib/api/products';
import { toProductCardUi } from '@/lib/api/product-ui';
type Props = {
  searchParams?: Promise<{ fail?: string; search?: string; page?: string }>;
};

/** Async Server Component — suspended inside `<Suspense>` on the parent page. */
export async function ProductsGrid({ searchParams }: Props) {
  const sp = searchParams ? await searchParams : {};

  // keep your existing fail flag for boundary demo
  if (sp.fail === '1') {
    throw new Error('Could not load products (demo failure).');
  }

  const page = sp.page ? Number(sp.page) : 1;
  const search = sp.search;

  const data = await getProducts({
    page,
    pageSize: 12,
    search,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });
  if (data.items.length === 0) {
    return (
      <div className="mt-10 rounded-2xl border border-dashed border-violet-200/80 bg-white/50 p-8 text-center text-sm text-zinc-600 dark:border-violet-900/50 dark:bg-zinc-950/40 dark:text-zinc-400">
        No products found for this filter.
      </div>
    );
  }
  return (
    <ul className="mt-10 grid list-none gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {data.items.map((p) => (
        <li key={p.id}>
          <ProductCard product={toProductCardUi(p)} />
                    </li>
      ))}
    </ul>
  );
}