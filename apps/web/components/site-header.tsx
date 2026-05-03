import Link from "next/link";
import { SiteNavLinks } from "@/components/site-nav-links";

export function SiteHeader() {
  return (
    <header className="border-b border-zinc-200 bg-white/80 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/80">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link
          href="/"
          className="rounded-md text-sm font-semibold tracking-tight text-zinc-900 outline-none ring-violet-500/80 ring-offset-2 ring-offset-white transition hover:text-violet-800 focus-visible:ring-2 dark:text-zinc-50 dark:ring-offset-zinc-950 dark:hover:text-violet-200"
        >
          Shop
        </Link>
        <SiteNavLinks />
      </div>
    </header>
  );
}
