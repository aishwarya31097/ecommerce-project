import { cookies } from 'next/headers';

export async function getServerAuthHeaders(): Promise<Record<string, string>> {
  const raw = (await cookies()).get('access_token')?.value;
  if (!raw) return {};
  const token = decodeURIComponent(raw);
  return { Authorization: `Bearer ${token}` };
}