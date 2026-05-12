import { apiFetch } from './client';

/** Product slice returned with cart line items from the API */
export type CartProductSummary = {
  id: string;
  name: string;
  price: string;
  imageUrl: string | null;
};

export type CartItemWithProduct = {
  id: string;
  userId: string;
  productId: string;
  quantity: number;
  createdAt: string;
  updatedAt: string;
  product: CartProductSummary;
};

export type CartUserSummary = {
  id: string;
  email: string;
  name: string | null;
};

export type CartSummary = {
  itemCount: number;
  subtotal: number;
};

export type GetCartResponse = {
  user: CartUserSummary;
  items: CartItemWithProduct[];
  summary: CartSummary;
};

export type AddCartItemBody = {
  userId: string;
  productId: string;
  quantity: number;
};

export type UpdateCartItemBody = {
  quantity: number;
};

/** Plain cart row returned by DELETE /cart/items/:itemId */
export type RemovedCartItem = {
  id: string;
  userId: string;
  productId: string;
  quantity: number;
  createdAt: string;
  updatedAt: string;
};

export function getCart(
  userId: string,
  options?: { revalidateSeconds?: number },
): Promise<GetCartResponse> {
  return apiFetch<GetCartResponse>(`/cart/${encodeURIComponent(userId)}`, {
    ...(options?.revalidateSeconds !== undefined
      ? { revalidateSeconds: options.revalidateSeconds }
      : {}),
  });
}

export function addCartItem(body: AddCartItemBody): Promise<CartItemWithProduct> {
  return apiFetch<CartItemWithProduct>('/cart/items', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export function updateCartItem(
  itemId: string,
  body: UpdateCartItemBody,
): Promise<CartItemWithProduct> {
  return apiFetch<CartItemWithProduct>(
    `/cart/items/${encodeURIComponent(itemId)}`,
    {
      method: 'PATCH',
      body: JSON.stringify(body),
    },
  );
}

export function removeCartItem(itemId: string): Promise<RemovedCartItem> {
  return apiFetch<RemovedCartItem>(
    `/cart/items/${encodeURIComponent(itemId)}`,
    {
      method: 'DELETE',
    },
  );
}
