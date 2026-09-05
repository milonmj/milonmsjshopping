"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type CategoryOption = { id: string; nameBn: string; nameEn: string };
type Initial = { id: string; nameBn: string; nameEn: string; slug: string; parentId: string | null; isActive: boolean };

export default function CategoryForm({ parentOptions, initial }: { parentOptions: CategoryOption[]; initial?: Initial }) {
  const router = useRouter();
  const locale = useSearchParams().get("lang") === "en" ? "en" : "bn";
  const isEdit = !!initial;

  const [form, setForm] = useState({
    nameBn: initial?.nameBn ?? "",
    nameEn: initial?.nameEn ?? "",
    slug: initial?.slug ?? "",
    parentId: initial?.parentId ?? "",
    isActive: initial?.isActive ?? true,
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function slugify(s: string) {
    return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch(isEdit ? `/api/admin/categories/${initial!.id}` : "/api/admin/categories", {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Could not save category.");
        setSubmitting(false);
        return;
      }
      router.push("/admin/categories");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
      setSubmitting(false);
    }
  }

  const inputCls = "w-full rounded-lg border border-brand-pinkLight px-3 py-2 text-sm";
  const labelCls = "mb-1 block text-xs font-medium text-brand-ink/60";

  return (
    <form onSubmit={handleSubmit} className="max-w-md space-y-4">
      <div>
        <label className={labelCls}>{locale === "bn" ? "নাম (বাংলা)" : "Name (Bangla)"}</label>
        <input required value={form.nameBn} onChange={(e) => setForm({ ...form, nameBn: e.target.value })} className={inputCls} />
      </div>
      <div>
        <label className={labelCls}>{locale === "bn" ? "নাম (ইংরেজি)" : "Name (English)"}</label>
        <input
          required
          value={form.nameEn}
          onChange={(e) => {
            const nameEn = e.target.value;
            setForm((f) => ({ ...f, nameEn, slug: isEdit ? f.slug : slugify(nameEn) }));
          }}
          className={inputCls}
        />
      </div>
      <div>
        <label className={labelCls}>Slug</label>
        <input required value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className={inputCls} />
      </div>
      <div>
        <label className={labelCls}>{locale === "bn" ? "প্যারেন্ট ক্যাটেগরি (ঐচ্ছিক)" : "Parent Category (optional)"}</label>
        <select value={form.parentId} onChange={(e) => setForm({ ...form, parentId: e.target.value })} className={inputCls}>
          <option value="">{locale === "bn" ? "কোনোটি নয় (মূল ক্যাটেগরি)" : "None (top-level)"}</option>
          {parentOptions.filter((p) => p.id !== initial?.id).map((p) => (
            <option key={p.id} value={p.id}>{locale === "bn" ? p.nameBn : p.nameEn}</option>
          ))}
        </select>
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} />
        {locale === "bn" ? "সক্রিয়" : "Active"}
      </label>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex gap-2">
        <button disabled={submitting} className="rounded-full bg-brand-pink px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-60">
          {submitting ? (locale === "bn" ? "সংরক্ষণ হচ্ছে..." : "Saving...") : (locale === "bn" ? "সংরক্ষণ করুন" : "Save Category")}
        </button>
        <button type="button" onClick={() => router.push("/admin/categories")} className="rounded-full border border-brand-pinkLight px-6 py-2.5 text-sm font-semibold text-brand-ink/70">
          {locale === "bn" ? "বাতিল" : "Cancel"}
        </button>
      </div>
    </form>
  );
}
