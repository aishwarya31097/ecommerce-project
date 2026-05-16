import { apiFetch } from './client';

export type AuthUser = {
  id: string;
  email: string;
  name: string | null;
};

export type AuthResponse = {
  user: AuthUser;
  accessToken: string;
};

export function register(body: {
  email: string;
  password: string;
  name?: string;
}): Promise<AuthResponse> {
  return apiFetch<AuthResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export function login(body: {
  email: string;
  password: string;
}): Promise<AuthResponse> {
  return apiFetch<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export function logout(): Promise<{ ok: boolean }> {
  return apiFetch<{ ok: boolean }>('/auth/logout', {
    method: 'POST',
  });
}

export function getMe(options?: { cookieHeader?: string }): Promise<AuthResponse> {
  return apiFetch<AuthResponse>('/auth/me', options);
}