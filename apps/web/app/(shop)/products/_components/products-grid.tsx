import { ProductCard } from "@/components/product-card";
import { fetchProducts } from "@/lib/products/data";

type Props = {
  searchParams?: Promise<{ fail?: string }>;
};

/** Async Server Component — suspended inside `<Suspense>` on the parent page. */
export async function ProductsGrid({ searchParams }: Props) {
  const sp = searchParams ? await searchParams : {};
  const simulateFail = sp.fail === "1";
  const products = await fetchProducts({ simulateFail });

  return (
    <ul className="mt-10 grid list-none gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((p) => (
        <li key={p.id}>
          <ProductCard product={p} />
        </li>
      ))}
    </ul>
  );
}
