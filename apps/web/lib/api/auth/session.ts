const TOKEN_KEY = 'access_token';
const COOKIE_MAX_AGE = 7 * 24 * 60 * 60;

function cookieAttributes() {
  const secure =
    typeof window !== 'undefined' && window.location.protocol === 'https:'
      ? '; Secure'
      : '';
  return `path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax${secure}`;
}

/** sessionStorage for client API calls; cookie for Server Components (/cart, /orders). */
export function setAccessToken(token: string) {
  sessionStorage.setItem(TOKEN_KEY, token);
  document.cookie = `${TOKEN_KEY}=${encodeURIComponent(token)}; ${cookieAttributes()}`;
}

export function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null;
  return sessionStorage.getItem(TOKEN_KEY);
}

export function clearAccessToken() {
  sessionStorage.removeItem(TOKEN_KEY);
  document.cookie = `${TOKEN_KEY}=; path=/; max-age=0`;
}

/** Re-write cookie from sessionStorage (e.g. after add to cart, before opening /cart). */
export function syncSessionCookie() {
  const token = getAccessToken();
  if (token) setAccessToken(token);
}
