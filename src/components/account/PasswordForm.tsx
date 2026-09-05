"use client";
import { useState } from "react";
import { useSearchParams } from "next/navigation";

export default function PasswordForm() {
  const locale = useSearchParams().get("lang") === "en" ? "en" : "bn";
  const [form, setForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "error"; text: string } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);

    if (form.newPassword !== form.confirmPassword) {
      setMessage({ type: "error", text: locale === "bn" ? "নতুন পাসওয়ার্ড মিলছে না।" : "New passwords don't match." });
      return;
    }

    setSubmitting(true);
    const res = await fetch("/api/account/password", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword: form.currentPassword, newPassword: form.newPassword }),
    });
    const data = await res.json();
    setSubmitting(false);
    if (!res.ok) {
      setMessage({ type: "error", text: data.error ?? (locale === "bn" ? "পরিবর্তন করা যায়নি।" : "Could not change password.") });
      return;
    }
    setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    setMessage({ type: "ok", text: locale === "bn" ? "পাসওয়ার্ড পরিবর্তন হয়েছে।" : "Password changed." });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input required type="password" placeholder={locale === "bn" ? "বর্তমান পাসওয়ার্ড" : "Current Password"}
        value={form.currentPassword} onChange={(e) => setForm({ ...form, currentPassword: e.target.value })}
        className="w-full rounded-lg border border-brand-pinkLight px-4 py-2.5 text-sm" />
      <input required type="password" placeholder={locale === "bn" ? "নতুন পাসওয়ার্ড" : "New Password"}
        value={form.newPassword} onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
        className="w-full rounded-lg border border-brand-pinkLight px-4 py-2.5 text-sm" />
      <input required type="password" placeholder={locale === "bn" ? "নতুন পাসওয়ার্ড নিশ্চিত করুন" : "Confirm New Password"}
        value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
        className="w-full rounded-lg border border-brand-pinkLight px-4 py-2.5 text-sm" />

      {message && <p className={`text-sm ${message.type === "ok" ? "text-green-600" : "text-red-600"}`}>{message.text}</p>}

      <button disabled={submitting} className="rounded-full border border-brand-pink px-6 py-2.5 text-sm font-semibold text-brand-pink disabled:opacity-60">
        {submitting ? (locale === "bn" ? "পরিবর্তন হচ্ছে..." : "Changing...") : (locale === "bn" ? "পাসওয়ার্ড পরিবর্তন করুন" : "Change Password")}
      </button>
    </form>
  );
}
