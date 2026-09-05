"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function ProfileForm({ initialName, initialEmail }: { initialName: string; initialEmail: string }) {
  const router = useRouter();
  const locale = useSearchParams().get("lang") === "en" ? "en" : "bn";

  const [name, setName] = useState(initialName);
  const [email, setEmail] = useState(initialEmail);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "error"; text: string } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    setSubmitting(true);
    const res = await fetch("/api/account/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email }),
    });
    const data = await res.json();
    setSubmitting(false);
    if (!res.ok) {
      setMessage({ type: "error", text: data.error ?? (locale === "bn" ? "সংরক্ষণ করা যায়নি।" : "Could not save.") });
      return;
    }
    setMessage({ type: "ok", text: locale === "bn" ? "প্রোফাইল আপডেট হয়েছে।" : "Profile updated." });
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label className="mb-1 block text-xs font-medium text-brand-ink/60">{locale === "bn" ? "পুরো নাম" : "Full Name"}</label>
        <input required value={name} onChange={(e) => setName(e.target.value)}
          className="w-full rounded-lg border border-brand-pinkLight px-4 py-2.5 text-sm" />
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium text-brand-ink/60">{locale === "bn" ? "ইমেইল" : "Email"}</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
          placeholder={locale === "bn" ? "ঐচ্ছিক" : "Optional"}
          className="w-full rounded-lg border border-brand-pinkLight px-4 py-2.5 text-sm" />
      </div>

      {message && <p className={`text-sm ${message.type === "ok" ? "text-green-600" : "text-red-600"}`}>{message.text}</p>}

      <button disabled={submitting} className="rounded-full bg-brand-pink px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-60">
        {submitting ? (locale === "bn" ? "সংরক্ষণ হচ্ছে..." : "Saving...") : (locale === "bn" ? "সংরক্ষণ করুন" : "Save Changes")}
      </button>
    </form>
  );
}
