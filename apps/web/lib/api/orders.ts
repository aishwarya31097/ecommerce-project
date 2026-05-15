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

export type CheckoutFromCartBody = {
  userId: string;
};

export function checkoutFromCart(
  body: CheckoutFromCartBody,
): Promise<OrderWithItems> {
  return apiFetch<OrderWithItems>('/orders/checkout', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export function getOrderById(
  orderId: string,
  options?: { revalidateSeconds?: number },
): Promise<OrderWithItems> {
  return apiFetch<OrderWithItems>(
    `/orders/detail/${encodeURIComponent(orderId)}`,
    {
      ...(options?.revalidateSeconds !== undefined
        ? { revalidateSeconds: options.revalidateSeconds }
        : {}),
    },
  );
}

export function getOrders(
  userId: string,
  options?: { revalidateSeconds?: number },
): Promise<OrderWithItems[]> {
  return apiFetch<OrderWithItems[]>(
    `/orders/${encodeURIComponent(userId)}`,
    {
      ...(options?.revalidateSeconds !== undefined
        ? { revalidateSeconds: options.revalidateSeconds }
        : {}),
    },
  );
}
