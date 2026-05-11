import { apiFetch } from './client';

export type ApiCategorySummary = {
  id: string;
  name: string;
  slug: string;
};

export type ApiProduct = {
  id: string;
  name: string;
  description: string;
  sku: string;
  price: string;
  imageUrl: string | null;
  categoryId: string;
  category?: ApiCategorySummary;
  createdAt: string;
  updatedAt: string;
};

export type ListProductsResponse = {
  items: ApiProduct[];
  meta: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  };
};

export type ListProductsQuery = {
  page?: number;
  pageSize?: number;
  search?: string;
  categoryId?: string;
  sortBy?: 'createdAt' | 'name' | 'price';
  sortOrder?: 'asc' | 'desc';
};

function toQueryString(query: ListProductsQuery): string {
  const params = new URLSearchParams();

  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.set(key, String(value));
    }
  });

  const qs = params.toString();
  return qs ? `?${qs}` : '';
}

export function getProducts(query: ListProductsQuery = {}) {
  return apiFetch<ListProductsResponse>(`/products${toQueryString(query)}`, {
    revalidateSeconds: 10,
  });
}

export function getProductById(id: string) {
  return apiFetch<ApiProduct>(`/products/${id}`, {
    revalidateSeconds: 10,
  });
}