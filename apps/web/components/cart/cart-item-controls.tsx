"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { removeCartItem, updateCartItem } from "@/lib/api/cart";
import { ApiError } from "@/lib/api/client";

const controlBtnClass =
  "rounded-lg border border-violet-200/90 bg-white px-3 py-1.5 text-sm text-zinc-800 transition hover:bg-violet-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-violet-900/60 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800";

type Props = {
  itemId: string;
  quantity: number;
  /** Used for aria-labels (e.g. product name). */
  label?: string;
  className?: string;
  /** After quantity change; item still present. */
  onUpdated?: () => void;
  /** After the line was removed from the cart. */
  onRemoved?: () => void;
};

export function CartItemControls({
  itemId,
  quantity,
  label,
  className,
  onUpdated,
  onRemoved,
}: Props) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const aria = label ? `${label} quantity` : "Quantity";

  async function run(mutate: () => Promise<void>) {
    setError(null);
    setPending(true);
    try {
      await mutate();
      router.refresh();
    } catch (e) {
      const message =
        e instanceof ApiError ? e.message : "Could not update cart.";
      setError(message);
    } finally {
      setPending(false);
    }
  }

  function handleDecrease() {
    if (quantity <= 1) {
      void run(async () => {
        await removeCartItem(itemId);
        onRemoved?.();
      });
      return;
    }
    void run(async () => {
      await updateCartItem(itemId, { quantity: quantity - 1 });
      onUpdated?.();
    });
  }

  function handleIncrease() {
    void run(async () => {
      await updateCartItem(itemId, { quantity: quantity + 1 });
      onUpdated?.();
    });
  }

  function handleRemove() {
    void run(async () => {
      await removeCartItem(itemId);
      onRemoved?.();
    });
  }

  return (
    <div className={className}>
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            className={controlBtnClass}
            disabled={pending}
            onClick={() => handleDecrease()}
            aria-label={quantity <= 1 ? `Remove ${label ?? "item"}` : `Decrease ${aria}`}
          >
            −
          </button>
          <span
            className="min-w-[2ch] text-center text-sm font-medium tabular-nums text-zinc-800 dark:text-zinc-100"
            aria-live="polite"
          >
            {quantity}
          </span>
          <button
            type="button"
            className={controlBtnClass}
            disabled={pending}
            onClick={() => handleIncrease()}
            aria-label={`Increase ${aria}`}
          >
            +
          </button>
        </div>
        <button
          type="button"
          className="text-sm font-medium text-red-600 underline-offset-4 hover:underline disabled:cursor-not-allowed disabled:opacity-50 dark:text-red-400"
          disabled={pending}
          onClick={() => handleRemove()}
        >
          Remove
        </button>
      </div>
      {error ? (
        <p className="mt-2 text-sm text-red-600 dark:text-red-400" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
