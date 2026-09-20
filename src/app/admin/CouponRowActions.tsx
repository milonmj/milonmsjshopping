"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CouponRowActions({
  couponId,
  isActive,
}: {
  couponId: string;
  isActive: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function toggleActive() {
    setLoading(true);
    try {
      await fetch(`/api/admin/coupons/${couponId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !isActive }),
      });
      router.refresh();
    } catch {
      alert("কিছু ভুল হয়েছে, আবার চেষ্টা করুন");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!confirm("এই কুপনটি মুছে ফেলতে চান?")) return;
    setLoading(true);
    try {
      await fetch(`/api/admin/coupons/${couponId}`, { method: "DELETE" });
      router.refresh();
    } catch {
      alert("কিছু ভুল হয়েছে, আবার চেষ্টা করুন");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex gap-2 text-xs">
      <Link
        href={`/admin/coupons/${couponId}/edit`}
        className="text-blue-600 hover:underline"
      >
        এডিট
      </Link>
      <button
        onClick={toggleActive}
        disabled={loading}
        className="text-amber-600 hover:underline disabled:opacity-50"
      >
        {isActive ? "নিষ্ক্রিয় করুন" : "সক্রিয় করুন"}
      </button>
      <button
        onClick={handleDelete}
        disabled={loading}
        className="text-red-600 hover:underline disabled:opacity-50"
      >
        মুছুন
      </button>
    </div>
  );
}
