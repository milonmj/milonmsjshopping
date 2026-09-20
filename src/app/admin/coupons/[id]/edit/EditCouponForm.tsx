"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type InitialData = {
  code: string;
  percentOff: string;
  amountOff: string;
  minOrderAmt: string;
  validFrom: string;
  validTo: string;
  isActive: boolean;
};

export default function EditCouponForm({
  couponId,
  initial,
}: {
  couponId: string;
  initial: InitialData;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [discountType, setDiscountType] = useState<"percent" | "amount">(
    initial.amountOff ? "amount" : "percent"
  );
  const [form, setForm] = useState(initial);

  function update(field: keyof InitialData, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`/api/admin/coupons/${couponId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: form.code.toUpperCase().trim(),
          percentOff:
            discountType === "percent" ? Number(form.percentOff) : null,
          amountOff:
            discountType === "amount" ? Number(form.amountOff) : null,
          minOrderAmt: form.minOrderAmt ? Number(form.minOrderAmt) : null,
          validFrom: new Date(form.validFrom).toISOString(),
          validTo: new Date(form.validTo).toISOString(),
          isActive: form.isActive,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "আপডেট করা যায়নি");
        setLoading(false);
        return;
      }

      router.push("/admin/coupons");
      router.refresh();
    } catch {
      setError("কিছু ভুল হয়েছে, আবার চেষ্টা করুন");
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 bg-white p-6 rounded-lg shadow"
    >
      {error && (
        <div className="bg-red-50 text-red-700 text-sm p-3 rounded-md">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium mb-1">কুপন কোড</label>
        <input
          type="text"
          value={form.code}
          onChange={(e) => update("code", e.target.value)}
          className="w-full border rounded-md px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">ছাড়ের ধরন</label>
        <div className="flex gap-3">
          <label className="flex items-center gap-1 text-sm">
            <input
              type="radio"
              checked={discountType === "percent"}
              onChange={() => setDiscountType("percent")}
            />
            শতাংশ (%)
          </label>
          <label className="flex items-center gap-1 text-sm">
            <input
              type="radio"
              checked={discountType === "amount"}
              onChange={() => setDiscountType("amount")}
            />
            নির্দিষ্ট টাকা (৳)
          </label>
        </div>
      </div>

      {discountType === "percent" ? (
        <div>
          <label className="block text-sm font-medium mb-1">
            শতাংশ ছাড় (%)
          </label>
          <input
            type="number"
            value={form.percentOff}
            onChange={(e) => update("percentOff", e.target.value)}
            className="w-full border rounded-md px-3 py-2"
          />
        </div>
      ) : (
        <div>
          <label className="block text-sm font-medium mb-1">
            ছাড়ের পরিমাণ (৳)
          </label>
          <input
            type="number"
            value={form.amountOff}
            onChange={(e) => update("amountOff", e.target.value)}
            className="w-full border rounded-md px-3 py-2"
          />
        </div>
      )}

      <div>
        <label className="block text-sm font-medium mb-1">
          ন্যূনতম অর্ডার পরিমাণ (৳) — ঐচ্ছিক
        </label>
        <input
          type="number"
          value={form.minOrderAmt}
          onChange={(e) => update("minOrderAmt", e.target.value)}
          className="w-full border rounded-md px-3 py-2"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium mb-1">শুরুর তারিখ</label>
          <input
            type="date"
            value={form.validFrom}
            onChange={(e) => update("validFrom", e.target.value)}
            className="w-full border rounded-md px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">শেষ তারিখ</label>
          <input
            type="date"
            value={form.validTo}
            onChange={(e) => update("validTo", e.target.value)}
            className="w-full border rounded-md px-3 py-2"
          />
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={form.isActive}
          onChange={(e) =>
            setForm((f) => ({ ...f, isActive: e.target.checked }))
          }
        />
        কুপন সক্রিয় রাখুন
      </label>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-pink-600 text-white py-2 rounded-md hover:bg-pink-700 disabled:opacity-50"
      >
        {loading ? "আপডেট হচ্ছে..." : "আপডেট করুন"}
      </button>
    </form>
  );
}
