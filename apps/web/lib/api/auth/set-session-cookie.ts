import { cookies } from 'next/headers';

const TOKEN_KEY = 'access_token';
const COOKIE_MAX_AGE = 7 * 24 * 60 * 60;

export async function setSessionCookie(token: string) {
  const store = await cookies();
  store.set(TOKEN_KEY, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: COOKIE_MAX_AGE,
    path: '/',
  });
}

export async function clearSessionCookie() {
  const store = await cookies();
  store.delete(TOKEN_KEY);
}
