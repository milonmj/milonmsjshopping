"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { SITE_NAME } from "@/lib/site-config";

// Admin login — requirement #1 (RBAC). Deliberately separate from the customer /login page
// (different NextAuth provider, "admin-login") so a customer account can never end up here and
// an admin account can never end up in the customer flow. Lives at /admin-login (not nested
// under /admin/*) so it isn't itself caught by the admin RBAC redirect.
export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const locale = searchParams.get("lang") === "en" ? "en" : "bn";
  const callbackUrl = searchParams.get("callbackUrl") || "/admin";

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const res = await signIn("admin-login", { phone, password, redirect: false, callbackUrl });
    setSubmitting(false);
    if (res?.error) {
      setError(
        locale === "bn"
          ? "ফোন নম্বর বা পাসওয়ার্ড সঠিক নয়, অথবা এই অ্যাকাউন্টে অ্যাডমিন অ্যাক্সেস নেই।"
          : "Incorrect phone number or password, or this account doesn't have admin access."
      );
      return;
    }
    router.push(callbackUrl);
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-ink px-4">
      <div className="w-full max-w-sm rounded-xl bg-white p-8">
        <h1 className="font-display text-xl font-semibold">
          {locale === "bn" ? "মিলন এম অ্যান্ড জে — অ্যাডমিন" : `${SITE_NAME} — Admin`}
        </h1>
        <p className="mt-1 text-sm text-brand-ink/60">
          {locale === "bn" ? "স্টোর পরিচালনা করতে সাইন ইন করুন" : "Sign in to manage the store"}
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input
            required
            type="tel"
            placeholder={locale === "bn" ? "ফোন নম্বর" : "Phone Number"}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full rounded-lg border border-brand-pinkLight px-4 py-2.5 text-sm"
          />
          <input
            required
            type="password"
            placeholder={locale === "bn" ? "পাসওয়ার্ড" : "Password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-brand-pinkLight px-4 py-2.5 text-sm"
          />

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            disabled={submitting}
            className="w-full rounded-full bg-brand-pink px-6 py-3 text-sm font-semibold text-white disabled:opacity-60"
          >
            {submitting ? (locale === "bn" ? "সাইন ইন হচ্ছে..." : "Signing in...") : (locale === "bn" ? "সাইন ইন" : "Sign In")}
          </button>
        </form>
      </div>
    </div>
  );
}
