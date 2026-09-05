"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";

type Category = { id: string; nameBn: string; nameEn: string };

type ProductInitial = {
  id: string;
  nameBn: string;
  nameEn: string;
  slug: string;
  descriptionBn: string;
  descriptionEn: string;
  sku: string;
  brand: string | null;
  categoryId: string;
  retailPrice: number;
  wholesalePrice: number | null;
  minWholesaleQty: number | null;
  discountPrice: number | null;
  quantity: number;
  lowStockAlertAt: number;
  isFeatured: boolean;
  isActive: boolean;
  images: { url: string }[];
  variants: { size: string | null; color: string | null; sku: string; quantity: number; priceDelta: number }[];
};

const EMPTY_VARIANT = { size: "", color: "", sku: "", quantity: 0, priceDelta: 0 };

export default function ProductForm({ categories, initial }: { categories: Category[]; initial?: ProductInitial }) {
  const router = useRouter();
  const locale = useSearchParams().get("lang") === "en" ? "en" : "bn";
  const isEdit = !!initial;

  const [form, setForm] = useState({
    nameBn: initial?.nameBn ?? "",
    nameEn: initial?.nameEn ?? "",
    slug: initial?.slug ?? "",
    descriptionBn: initial?.descriptionBn ?? "",
    descriptionEn: initial?.descriptionEn ?? "",
    sku: initial?.sku ?? "",
    brand: initial?.brand ?? "",
    categoryId: initial?.categoryId ?? categories[0]?.id ?? "",
    retailPrice: initial?.retailPrice ?? 0,
    wholesalePrice: initial?.wholesalePrice ?? undefined,
    minWholesaleQty: initial?.minWholesaleQty ?? undefined,
    discountPrice: initial?.discountPrice ?? undefined,
    quantity: initial?.quantity ?? 0,
    lowStockAlertAt: initial?.lowStockAlertAt ?? 5,
    isFeatured: initial?.isFeatured ?? false,
    isActive: initial?.isActive ?? true,
  });
  const [images, setImages] = useState<string[]>(initial?.images.map((i) => i.url) ?? [""]);
  const [variants, setVariants] = useState(initial?.variants.map((v) => ({ ...v, size: v.size ?? "", color: v.color ?? "" })) ?? [] as typeof EMPTY_VARIANT[]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function slugify(s: string) {
    return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const payload = {
      ...form,
      wholesalePrice: form.wholesalePrice || undefined,
      minWholesaleQty: form.minWholesaleQty || undefined,
      discountPrice: form.discountPrice || undefined,
      images: images.filter((u) => u.trim()).map((url) => ({ url })),
      variants: variants
        .filter((v) => v.sku.trim())
        .map((v) => ({ ...v, size: v.size || undefined, color: v.color || undefined })),
    };

    try {
      const res = await fetch(isEdit ? `/api/admin/products/${initial!.id}` : "/api/admin/products", {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Could not save product.");
        setSubmitting(false);
        return;
      }
      router.push("/admin/products");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
      setSubmitting(false);
    }
  }

  const inputCls = "w-full rounded-lg border border-brand-pinkLight px-3 py-2 text-sm";
  const labelCls = "mb-1 block text-xs font-medium text-brand-ink/60";

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
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
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelCls}>Slug</label>
          <input required value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>SKU</label>
          <input required value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} className={inputCls} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelCls}>{locale === "bn" ? "বিবরণ (বাংলা)" : "Description (Bangla)"}</label>
          <textarea required rows={3} value={form.descriptionBn} onChange={(e) => setForm({ ...form, descriptionBn: e.target.value })} className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>{locale === "bn" ? "বিবরণ (ইংরেজি)" : "Description (English)"}</label>
          <textarea required rows={3} value={form.descriptionEn} onChange={(e) => setForm({ ...form, descriptionEn: e.target.value })} className={inputCls} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelCls}>{locale === "bn" ? "ব্র্যান্ড (ঐচ্ছিক)" : "Brand (optional)"}</label>
          <input value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>{locale === "bn" ? "ক্যাটেগরি" : "Category"}</label>
          <select required value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })} className={inputCls}>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{locale === "bn" ? c.nameBn : c.nameEn}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className={labelCls}>{locale === "bn" ? "রিটেইল মূল্য (৳)" : "Retail Price (৳)"}</label>
          <input required type="number" min={0} step="0.01" value={form.retailPrice} onChange={(e) => setForm({ ...form, retailPrice: Number(e.target.value) })} className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>{locale === "bn" ? "ডিসকাউন্ট মূল্য (ঐচ্ছিক)" : "Discount Price (optional)"}</label>
          <input type="number" min={0} step="0.01" value={form.discountPrice ?? ""} onChange={(e) => setForm({ ...form, discountPrice: e.target.value ? Number(e.target.value) : undefined })} className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>{locale === "bn" ? "পাইকারি মূল্য (ঐচ্ছিক)" : "Wholesale Price (optional)"}</label>
          <input type="number" min={0} step="0.01" value={form.wholesalePrice ?? ""} onChange={(e) => setForm({ ...form, wholesalePrice: e.target.value ? Number(e.target.value) : undefined })} className={inputCls} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className={labelCls}>{locale === "bn" ? "স্টক পরিমাণ" : "Stock Quantity"}</label>
          <input required type="number" min={0} value={form.quantity} onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })} className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>{locale === "bn" ? "লো-স্টক সতর্কতা" : "Low Stock Alert At"}</label>
          <input type="number" min={0} value={form.lowStockAlertAt} onChange={(e) => setForm({ ...form, lowStockAlertAt: Number(e.target.value) })} className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>{locale === "bn" ? "সর্বনিম্ন পাইকারি পরিমাণ" : "Min Wholesale Qty"}</label>
          <input type="number" min={0} value={form.minWholesaleQty ?? ""} onChange={(e) => setForm({ ...form, minWholesaleQty: e.target.value ? Number(e.target.value) : undefined })} className={inputCls} />
        </div>
      </div>

      <div className="flex gap-6">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} />
          {locale === "bn" ? "ফিচারড পণ্য" : "Featured product"}
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} />
          {locale === "bn" ? "সক্রিয় (স্টোরফ্রন্টে দেখাবে)" : "Active (visible on storefront)"}
        </label>
      </div>

      <div>
        <label className={labelCls}>{locale === "bn" ? "ছবির URL" : "Image URLs"}</label>
        <div className="space-y-2">
          {images.map((url, i) => (
            <div key={i} className="flex gap-2">
              <input
                value={url}
                placeholder="https://res.cloudinary.com/..."
                onChange={(e) => setImages((prev) => prev.map((u, idx) => (idx === i ? e.target.value : u)))}
                className={inputCls}
              />
              <button type="button" onClick={() => setImages((prev) => prev.filter((_, idx) => idx !== i))} className="rounded-lg border border-brand-pinkLight px-3 text-red-500">
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
        <button type="button" onClick={() => setImages((prev) => [...prev, ""])} className="mt-2 flex items-center gap-1 text-xs font-semibold text-brand-pink">
          <Plus size={14} /> {locale === "bn" ? "ছবি যোগ করুন" : "Add Image"}
        </button>
      </div>

      <div>
        <label className={labelCls}>{locale === "bn" ? "ভ্যারিয়েন্ট (সাইজ/রঙ, ঐচ্ছিক)" : "Variants (size/color, optional)"}</label>
        <div className="space-y-2">
          {variants.map((v, i) => (
            <div key={i} className="grid grid-cols-5 gap-2">
              <input placeholder={locale === "bn" ? "সাইজ" : "Size"} value={v.size} onChange={(e) => setVariants((prev) => prev.map((row, idx) => (idx === i ? { ...row, size: e.target.value } : row)))} className={inputCls} />
              <input placeholder={locale === "bn" ? "রঙ" : "Color"} value={v.color} onChange={(e) => setVariants((prev) => prev.map((row, idx) => (idx === i ? { ...row, color: e.target.value } : row)))} className={inputCls} />
              <input placeholder="SKU" value={v.sku} onChange={(e) => setVariants((prev) => prev.map((row, idx) => (idx === i ? { ...row, sku: e.target.value } : row)))} className={inputCls} />
              <input type="number" min={0} placeholder={locale === "bn" ? "স্টক" : "Qty"} value={v.quantity} onChange={(e) => setVariants((prev) => prev.map((row, idx) => (idx === i ? { ...row, quantity: Number(e.target.value) } : row)))} className={inputCls} />
              <div className="flex gap-1">
                <input type="number" step="0.01" placeholder="+/- ৳" value={v.priceDelta} onChange={(e) => setVariants((prev) => prev.map((row, idx) => (idx === i ? { ...row, priceDelta: Number(e.target.value) } : row)))} className={inputCls} />
                <button type="button" onClick={() => setVariants((prev) => prev.filter((_, idx) => idx !== i))} className="rounded-lg border border-brand-pinkLight px-2 text-red-500">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
        <button type="button" onClick={() => setVariants((prev) => [...prev, { ...EMPTY_VARIANT }])} className="mt-2 flex items-center gap-1 text-xs font-semibold text-brand-pink">
          <Plus size={14} /> {locale === "bn" ? "ভ্যারিয়েন্ট যোগ করুন" : "Add Variant"}
        </button>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex gap-2">
        <button disabled={submitting} className="rounded-full bg-brand-pink px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-60">
          {submitting ? (locale === "bn" ? "সংরক্ষণ হচ্ছে..." : "Saving...") : (locale === "bn" ? "সংরক্ষণ করুন" : "Save Product")}
        </button>
        <button type="button" onClick={() => router.push("/admin/products")} className="rounded-full border border-brand-pinkLight px-6 py-2.5 text-sm font-semibold text-brand-ink/70">
          {locale === "bn" ? "বাতিল" : "Cancel"}
        </button>
      </div>
    </form>
  );
}
