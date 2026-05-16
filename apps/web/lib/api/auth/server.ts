import { cookies } from 'next/headers';

export async function getServerAuthHeaders(): Promise<Record<string, string>> {
  const token = (await cookies()).get('access_token')?.value;
  if (!token) return {};
  return { Authorization: `Bearer ${decodeURIComponent(token)}` };
}