"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AuthNav } from "@/components/auth/auth-nav";
const nav = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/cart", label: "Cart" },
  { href: "/orders", label: "Orders" },

  
] as const;

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteNavLinks() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center gap-1 sm:gap-2" aria-label="Main">
      {nav.map((item) => {
        const active = isActive(pathname, item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={`rounded-md px-3 py-2 text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-950 ${
              active
                ? "bg-zinc-100 font-medium text-zinc-900 dark:bg-zinc-800 dark:text-zinc-50"
                : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
      <AuthNav />
    </nav>
  );
}
