import { API_BASE_URL } from './config';
import { getAccessToken } from './auth/session';
export class ApiError extends Error {
  status: number;
  details: unknown;

  constructor(message: string, status: number, details: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

type RequestOptions = RequestInit & {
  revalidateSeconds?: number;
  cookieHeader?: string;
};

export async function apiFetch<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const { revalidateSeconds, cookieHeader, headers, ...rest } = options;
  const bearer =
  !cookieHeader && typeof window !== 'undefined'
    ? getAccessToken()
    : null;
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(bearer ? { Authorization: `Bearer ${bearer}` } : {}),
      ...(cookieHeader ? { Cookie: cookieHeader } : {}),  
      ...headers,
    },
    credentials: cookieHeader ? 'omit' : 'include',
    ...(revalidateSeconds !== undefined
      ? { next: { revalidate: revalidateSeconds } }
      : {}),
    ...rest,
  });

  if (!response.ok) {
    let details: unknown = null;
    try {
      details = await response.json();
    } catch {
      // keep null if body isn't JSON
    }

    const message =
      typeof details === 'object' &&
      details !== null &&
      'message' in details
        ? String((details as { message: unknown }).message)
        : `API request failed: ${response.status}`;

    throw new ApiError(message, response.status, details);
  }

  if (response.status === 204) {
    return null as T;
  }

  return (await response.json()) as T;
}