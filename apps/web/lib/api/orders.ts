import { apiFetch } from './client';

export type OrderStatus = 'PENDING' | 'PAID' | 'SHIPPED' | 'CANCELLED';

export type OrderProductSummary = {
  id: string;
  name: string;
  sku: string;
};

export type OrderItemWithProduct = {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  unitPrice: string;
  productName: string;
  product: OrderProductSummary;
};

export type OrderWithItems = {
  id: string;
  userId: string;
  status: OrderStatus;
  total: string;
  createdAt: string;
  updatedAt: string;
  items: OrderItemWithProduct[];
};



export function checkoutFromCart(): Promise<OrderWithItems> {
  return apiFetch<OrderWithItems>('/orders/checkout', {
    method: 'POST',
  });
}

type OrderFetchOptions = {
  revalidateSeconds?: number;
  headers?: Record<string, string>;
};

export function getOrderById(
  orderId: string,
  options?: OrderFetchOptions,
): Promise<OrderWithItems> {
  return apiFetch<OrderWithItems>(
    `/orders/detail/${encodeURIComponent(orderId)}`,
    {
      ...(options?.revalidateSeconds !== undefined
        ? { revalidateSeconds: options.revalidateSeconds }
        : {}),
      headers: options?.headers,
    },
  );
}

export function getMyOrders(
  options?: OrderFetchOptions,
): Promise<OrderWithItems[]> {
  return apiFetch<OrderWithItems[]>('/orders/me', {
    ...(options?.revalidateSeconds !== undefined
      ? { revalidateSeconds: options.revalidateSeconds }
      : {}),
    headers: options?.headers,
  });
}
