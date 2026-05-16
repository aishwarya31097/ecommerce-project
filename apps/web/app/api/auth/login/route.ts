import { NextResponse } from 'next/server';
import { API_BASE_URL } from '@/lib/api/config';
import { extractAccessToken } from '@/lib/api/auth/extract-token';
import { setSessionCookie } from '@/lib/api/auth/set-session-cookie';

export async function POST(request: Request) {
  const body = await request.json();

  const apiRes = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const data = (await apiRes.json().catch(() => ({}))) as Record<
    string,
    unknown
  >;

  if (!apiRes.ok) {
    return NextResponse.json(data, { status: apiRes.status });
  }

  const setCookies: string[] =
    typeof apiRes.headers.getSetCookie === 'function'
      ? apiRes.headers.getSetCookie()
      : [];
  const rawSetCookie = apiRes.headers.get('set-cookie');
  if (rawSetCookie && setCookies.length === 0) {
    setCookies.push(rawSetCookie);
  }

  const accessToken = extractAccessToken(data, setCookies);
  if (!accessToken) {
    return NextResponse.json(
      {
        message:
          'Login succeeded on the API but no access token was returned. Redeploy apps/api on Railway.',
      },
      { status: 502 },
    );
  }

  await setSessionCookie(accessToken);

  return NextResponse.json({ user: data.user, accessToken });
}
