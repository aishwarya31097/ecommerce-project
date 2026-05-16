const TOKEN_KEY = 'access_token';

/** Browser API calls (add to cart, AuthNav). */
export function setAccessToken(token: string) {
  sessionStorage.setItem(TOKEN_KEY, token);
}

export function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null;
  return sessionStorage.getItem(TOKEN_KEY);
}

export function clearAccessToken() {
  sessionStorage.removeItem(TOKEN_KEY);
}