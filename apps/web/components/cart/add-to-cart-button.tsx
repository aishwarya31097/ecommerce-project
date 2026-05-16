"use client";

import { useRouter } from "next/navigation";
import { type ReactNode, useState } from "react";
import { syncSessionCookie } from "@/lib/api/auth/session";
import { addCartItem } from "@/lib/api/cart";
import { ApiError } from "@/lib/api/client";

type Props = {
  productId: string;
  /** Units to add per click (default 1). */
  quantity?: number;
  className?: string;
  children?: ReactNode;
};

const baseClass =
  "inline-flex items-center justify-center rounded-full bg-violet-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-violet-500 dark:hover:bg-violet-400";

export function AddToCartButton({
  productId,
  quantity = 1,
  className,
  children,
}: Props) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    setError(null);
    setPending(true);
    try {
      await addCartItem({ productId, quantity });
      syncSessionCookie();
      router.refresh();
    } catch (e) {
      if (e instanceof ApiError && e.status === 401) {
        router.push(`/login?next=/products/${productId}`);
        return;
      }
      const message =
        e instanceof ApiError ? e.message : "Could not add to cart.";
      setError(message);
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        className={className ?? baseClass}
        disabled={pending}
        onClick={() => void handleClick()}
      >
        {pending ? "Adding…" : (children ?? "Add to cart")}
      </button>
      {error ? (
        <p className="text-sm text-red-600 dark:text-red-400" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
