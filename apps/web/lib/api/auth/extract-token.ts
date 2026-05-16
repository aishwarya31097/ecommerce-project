/** Read JWT from API JSON body or Set-Cookie (production may only send the cookie). */
export function extractAccessToken(
  data: Record<string, unknown>,
  setCookieHeaders: string[],
): string | null {
  const fromBody = data.accessToken ?? data.access_token;
  if (typeof fromBody === 'string' && fromBody.length > 0) {
    return fromBody;
  }

  for (const header of setCookieHeaders) {
    const match = header.match(/^access_token=([^;]+)/);
    if (match?.[1]) {
      return decodeURIComponent(match[1]);
    }
  }

  return null;
}
