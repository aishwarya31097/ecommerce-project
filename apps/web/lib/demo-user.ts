/**
 * Demo shopper until auth (Day 11). Set `NEXT_PUBLIC_DEMO_USER_ID` in `.env.local`
 * to a real `User.id` from your database.
 */
export function getDemoUserId(): string {
  const id = process.env.NEXT_PUBLIC_DEMO_USER_ID;
  if (!id?.trim()) {
    throw new Error(
      'NEXT_PUBLIC_DEMO_USER_ID is missing. Add it to apps/web/.env.local.',
    );
  }
  return id.trim();
}
