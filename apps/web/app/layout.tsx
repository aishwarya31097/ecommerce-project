import type { Metadata } from "next";
import localFont from "next/font/local";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ),
  title: {
    default: "Shop",
    template: "%s · Shop",
  },
  description: "Ecommerce project (Next.js App Router)",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-dvh antialiased`}
      >
        <a
          href="#main-content"
          className="fixed left-4 top-4 z-[100] -translate-y-[200%] rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white shadow-md transition-transform duration-200 focus:translate-y-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 dark:bg-zinc-100 dark:text-zinc-900 dark:focus-visible:ring-offset-zinc-950"
        >
          Skip to main content
        </a>
        <SiteHeader />
        <main
          id="main-content"
          tabIndex={-1}
          className="min-h-[calc(100dvh-3.5rem)] outline-none focus-visible:ring-2 focus-visible:ring-violet-400/60 focus-visible:ring-inset"
        >
          {children}
        </main>
      </body>
    </html>
  );
}
