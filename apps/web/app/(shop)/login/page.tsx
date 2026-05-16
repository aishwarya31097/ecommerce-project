import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Sign in",
};

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-16 sm:px-6">
      <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
        Sign in
      </h1>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
        Use the account you created in Postman or register first.
      </p>
      <div className="mt-8">
        <Suspense fallback={<p className="text-sm text-zinc-500">Loading…</p>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}