import { NextResponse } from 'next/server';
import { clearSessionCookie } from '@/lib/api/auth/set-session-cookie';

export async function POST() {
  await clearSessionCookie();
  return NextResponse.json({ ok: true });
}
