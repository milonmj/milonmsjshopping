"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const locale = searchParams.get("lang") === "en" ? "en" : "bn";
  const callbackUrl = searchParams.get("callbackUrl") || "/account";

  const [form, setForm] = useState({ name: "", phone: "", email: "", password: "", confirmPassword: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (form.password !== form.confirmPassword) {
      setError(locale === "bn" ? "পাসওয়ার্ড মিলছে না।" : "Passwords don't match.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, phone: form.phone, email: form.email, password: form.password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error?.formErrors?.[0] ?? data.error ?? (locale === "bn" ? "অ্যাকাউন্ট তৈরি করা যায়নি।" : "Could not create account."));
        setSubmitting(false);
        return;
      }

      const signInRes = await signIn("credentials", {
        phone: form.phone,
        password: form.password,
        redirect: false,
        callbackUrl,
      });
      setSubmitting(false);
      if (signInRes?.error) {
        router.push(`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`);
        return;
      }
      router.push(callbackUrl);
      router.refresh();
    } catch {
      setError(locale === "bn" ? "কিছু ভুল হয়েছে। আবার চেষ্টা করুন।" : "Something went wrong. Please try again.");
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="font-display text-2xl font-semibold">{locale === "bn" ? "অ্যাকাউন্ট তৈরি করুন" : "Create an Account"}</h1>
      <p className="mt-1 text-sm text-brand-ink/60">
        {locale === "bn" ? "অর্ডার ট্র্যাক করতে ও দ্রুত চেকআউটের জন্য" : "Track orders and check out faster next time"}
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <input required placeholder={locale === "bn" ? "পুরো নাম" : "Full Name"} value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full rounded-lg border border-brand-pinkLight px-4 py-2.5 text-sm" />

        <input required type="tel" placeholder={locale === "bn" ? "ফোন নম্বর" : "Phone Number"} value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          className="w-full rounded-lg border border-brand-pinkLight px-4 py-2.5 text-sm" />

        <input type="email" placeholder={locale === "bn" ? "ইমেইল (ঐচ্ছিক)" : "Email (optional)"} value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full rounded-lg border border-brand-pinkLight px-4 py-2.5 text-sm" />

        <input required type="password" placeholder={locale === "bn" ? "পাসওয়ার্ড (কমপক্ষে ৬ অক্ষর)" : "Password (min 6 characters)"} value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="w-full rounded-lg border border-brand-pinkLight px-4 py-2.5 text-sm" />

        <input required type="password" placeholder={locale === "bn" ? "পাসওয়ার্ড নিশ্চিত করুন" : "Confirm Password"} value={form.confirmPassword}
          onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
          className="w-full rounded-lg border border-brand-pinkLight px-4 py-2.5 text-sm" />

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          disabled={submitting}
          className="w-full rounded-full bg-brand-pink px-6 py-3 text-sm font-semibold text-white disabled:opacity-60"
        >
          {submitting ? (locale === "bn" ? "তৈরি হচ্ছে..." : "Creating...") : (locale === "bn" ? "অ্যাকাউন্ট তৈরি করুন" : "Create Account")}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-brand-ink/60">
        {locale === "bn" ? "ইতিমধ্যে অ্যাকাউন্ট আছে?" : "Already have an account?"}{" "}
        <Link href={`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`} className="font-semibold text-brand-pink">
          {locale === "bn" ? "লগইন করুন" : "Log In"}
        </Link>
      </p>
    </div>
  );
}
