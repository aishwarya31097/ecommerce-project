import Link from "next/link";
import { CartItemControls } from "@/components/cart/cart-item-controls";
import type { CartItemWithProduct } from "@/lib/api/cart";

type Props = {
  item: CartItemWithProduct;
};

function formatMoney(n: number) {
  return `€${n.toFixed(2)}`;
}

export function CartLineItem({ item }: Props) {
  const { product, quantity } = item;
  const unit = Number(product.price);
  const lineTotal = unit * quantity;

  return (
    <li className="flex flex-col gap-4 border-b border-zinc-200/80 py-6 last:border-b-0 dark:border-zinc-800/80 sm:flex-row sm:items-start sm:justify-between">
      <div className="flex min-w-0 flex-1 gap-4">
        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-900">
          {product.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element -- cart API returns arbitrary URLs
            <img
              src={product.imageUrl}
              alt=""
              className="h-full w-full object-cover"
            />
          ) : (
            <div
              className="flex h-full w-full items-center justify-center text-xs text-zinc-400"
              aria-hidden
            >
              No image
            </div>
          )}
        </div>
        <div className="min-w-0">
          <Link
            href={`/products/${product.id}`}
            className="font-medium text-zinc-800 underline-offset-4 hover:underline dark:text-zinc-100"
          >
            {product.name}
          </Link>
          <p className="mt-1 text-sm tabular-nums text-zinc-500 dark:text-zinc-400">
            {formatMoney(unit)} each
          </p>
          <p className="mt-2 text-sm font-medium tabular-nums text-zinc-800 dark:text-zinc-100">
            Line: {formatMoney(lineTotal)}
          </p>
        </div>
      </div>
      <CartItemControls
        itemId={item.id}
        quantity={quantity}
        label={product.name}
        className="sm:pt-1"
      />
    </li>
  );
}
