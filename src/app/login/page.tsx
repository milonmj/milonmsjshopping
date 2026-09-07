"use client";
import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const locale = searchParams.get("lang") === "en" ? "en" : "bn";
  const callbackUrl = searchParams.get("callbackUrl") || "/account";

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const res = await signIn("credentials", { phone, password, redirect: false, callbackUrl });
    setSubmitting(false);
    if (res?.error) {
      setError(locale === "bn" ? "ফোন নম্বর বা পাসওয়ার্ড সঠিক নয়" : "Incorrect phone number or password.");
      return;
    }
    router.push(callbackUrl);
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="font-display text-2xl font-semibold">{locale === "bn" ? "লগইন করুন" : "Log In"}</h1>
      <p className="mt-1 text-sm text-brand-ink/60">
        {locale === "bn" ? "আপনার অ্যাকাউন্টে প্রবেশ করুন" : "Sign in to your account"}
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
          {submitting ? (locale === "bn" ? "লগইন হচ্ছে..." : "Logging in...") : (locale === "bn" ? "লগইন" : "Log In")}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-brand-ink/60">
        {locale === "bn" ? "নতুন এখানে?" : "New here?"}{" "}
        <Link href={`/register?callbackUrl=${encodeURIComponent(callbackUrl)}`} className="font-semibold text-brand-pink">
          {locale === "bn" ? "অ্যাকাউন্ট তৈরি করুন" : "Create an account"}
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
