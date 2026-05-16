const TOKEN_KEY = 'access_token';
const COOKIE_MAX_AGE = 7 * 24 * 60 * 60;

export function setAccessToken(token: string) {
  sessionStorage.setItem(TOKEN_KEY, token);
  // Same-site cookie so Server Components can read it on localhost:3000
  document.cookie = `${TOKEN_KEY}=${encodeURIComponent(token)}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
}

export function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null;
  return sessionStorage.getItem(TOKEN_KEY);
}

export function clearAccessToken() {
  sessionStorage.removeItem(TOKEN_KEY);
  document.cookie = `${TOKEN_KEY}=; path=/; max-age=0`;
}