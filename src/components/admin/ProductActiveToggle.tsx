"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function ProductActiveToggle({ productId, isActive }: { productId: string; isActive: boolean }) {
  const router = useRouter();
  const locale = useSearchParams().get("lang") === "en" ? "en" : "bn";
  const [busy, setBusy] = useState(false);

  async function toggle() {
    setBusy(true);
    if (isActive) {
      await fetch(`/api/admin/products/${productId}`, { method: "DELETE" });
    } else {
      await fetch(`/api/admin/products/${productId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: true }),
      });
    }
    setBusy(false);
    router.refresh();
  }

  return (
    <button
      onClick={toggle}
      disabled={busy}
      className={`rounded-full px-3 py-1 text-xs font-medium disabled:opacity-50 ${
        isActive ? "border border-red-300 text-red-500 hover:bg-red-50" : "border border-green-300 text-green-600 hover:bg-green-50"
      }`}
    >
      {isActive
        ? (locale === "bn" ? "নিষ্ক্রিয় করুন" : "Deactivate")
        : (locale === "bn" ? "পুনরায় সক্রিয়" : "Reactivate")}
    </button>
  );
}
