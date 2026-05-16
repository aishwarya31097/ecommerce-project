"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getMe, logout, type AuthUser } from "@/lib/api/auth";
import {
  clearAccessToken,
  getAccessToken,
  syncSessionCookie,
} from "@/lib/api/auth/session";

export function AuthNav() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      setUser(null);
      setReady(true);
      return;
    }
    syncSessionCookie();
    setReady(false);
    getMe()
      .then((res) => setUser(res.user))
      .catch(() => setUser(null))
      .finally(() => setReady(true));
  }, [pathname]);

  async function handleSignOut() {
    try {
      await logout();
    } catch {
      // still clear local session if API fails
    }
    clearAccessToken();
    setUser(null);
    router.push("/");
    router.refresh();
  }

  if (!ready) return null;

  if (!user) {
    return (
      <Link
        href="/login"
        className="rounded-md px-3 py-2 text-sm text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
      >
        Sign in
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span className="hidden max-w-[140px] truncate text-sm text-zinc-500 sm:inline dark:text-zinc-400">
        {user.email}
      </span>
      <button
        type="button"
        onClick={() => void handleSignOut()}
        className="rounded-md px-3 py-2 text-sm text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
      >
        Sign out
      </button>
    </div>
  );
}