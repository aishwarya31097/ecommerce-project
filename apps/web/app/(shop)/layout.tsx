export default function ShopLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-[calc(100dvh-3.5rem)] flex-col">
      <div className="flex-1">{children}</div>
      <footer className="mt-auto border-t border-violet-200/60 bg-white/40 px-4 py-6 text-center text-xs text-zinc-500 backdrop-blur-sm dark:border-violet-900/40 dark:bg-zinc-950/40 dark:text-zinc-500">
        Route group{" "}
        <code className="rounded bg-violet-100/90 px-1 py-0.5 font-mono text-[0.7rem] text-violet-900 dark:bg-violet-950/80 dark:text-violet-200">
          (shop)
        </code>
        — shared footer on /, /products, /cart only.
      </footer>
    </div>
  );
}
