import { apiFetch, ApiError } from './client';

export type AuthUser = {
  id: string;
  email: string;
  name: string | null;
};

export type AuthResponse = {
  user: AuthUser;
  accessToken: string;
};

async function authProxy(
  path: '/api/auth/login' | '/api/auth/register',
  body: Record<string, unknown>,
): Promise<AuthResponse> {
  const res = await fetch(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    credentials: 'include',
  });

  const data = (await res.json().catch(() => ({}))) as AuthResponse & {
    message?: string;
  };

  if (!res.ok) {
    throw new ApiError(
      data.message ?? 'Authentication failed',
      res.status,
      data,
    );
  }

  if (!data.accessToken) {
    throw new ApiError(
      'No access token returned. Check API deploy on Railway.',
      502,
      data,
    );
  }

  return { user: data.user, accessToken: data.accessToken };
}

export function register(body: {
  email: string;
  password: string;
  name?: string;
}): Promise<AuthResponse> {
  return authProxy('/api/auth/register', body);
}

export function login(body: {
  email: string;
  password: string;
}): Promise<AuthResponse> {
  return authProxy('/api/auth/login', body);
}

export async function logout(): Promise<{ ok: boolean }> {
  try {
    await apiFetch<{ ok: boolean }>('/auth/logout', { method: 'POST' });
  } catch {
    // still clear local session if API fails
  }
  await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
  return { ok: true };
}

export function getMe(options?: {
  cookieHeader?: string;
}): Promise<{ user: AuthUser }> {
  return apiFetch<{ user: AuthUser }>('/auth/me', options);
}
