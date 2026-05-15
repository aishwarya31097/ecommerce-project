"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { checkoutFromCart } from "@/lib/api/orders";
import { ApiError } from "@/lib/api/client";
import { getDemoUserId } from "@/lib/demo-user";

const buttonClass =
  "w-full rounded-full bg-violet-600 px-5 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-violet-500 dark:hover:bg-violet-400";

export function PlaceOrderButton() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCheckout() {
    setError(null);
    setPending(true);
    try {
      const userId = getDemoUserId();
      const order = await checkoutFromCart({ userId });
      router.push(`/orders/${order.id}`);
    } catch (e) {
      const message =
        e instanceof ApiError ? e.message : "Could not place order.";
      setError(message);
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="mt-6 flex flex-col gap-3">
      <button
        type="button"
        className={buttonClass}
        disabled={pending}
        onClick={() => void handleCheckout()}
      >
        {pending ? "Placing order…" : "Place order"}
      </button>
      {error ? (
        <p className="text-sm text-red-600 dark:text-red-400" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
