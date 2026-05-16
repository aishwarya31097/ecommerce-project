const TOKEN_KEY = 'access_token';
const COOKIE_MAX_AGE = 7 * 24 * 60 * 60;

function cookieFlags() {
  const secure =
    typeof window !== 'undefined' && window.location.protocol === 'https:'
      ? '; Secure'
      : '';
  return `path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax${secure}`;
}

export function setAccessToken(token: string) {
  sessionStorage.setItem(TOKEN_KEY, token);
  // Cookie on the Next.js host so Server Components (/cart, /orders) can auth.
  // Secure is required on https:// (Vercel production).
  document.cookie = `${TOKEN_KEY}=${encodeURIComponent(token)}; ${cookieFlags()}`;
}

export function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null;
  return sessionStorage.getItem(TOKEN_KEY);
}

export function clearAccessToken() {
  sessionStorage.removeItem(TOKEN_KEY);
  document.cookie = `${TOKEN_KEY}=; path=/; max-age=0`;
}