"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const STATUSES = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"] as const;
const STATUS_LABELS: Record<string, { bn: string; en: string }> = {
  PENDING: { bn: "পেন্ডিং", en: "Pending" },
  CONFIRMED: { bn: "নিশ্চিত হয়েছে", en: "Confirmed" },
  PROCESSING: { bn: "প্রসেসিং", en: "Processing" },
  SHIPPED: { bn: "পাঠানো হয়েছে", en: "Shipped" },
  DELIVERED: { bn: "ডেলিভারি হয়েছে", en: "Delivered" },
  CANCELLED: { bn: "বাতিল হয়েছে", en: "Cancelled" },
};
const PAYMENT_STATUSES = ["PENDING", "PAID", "FAILED", "REFUNDED"] as const;

export default function OrderFulfillmentForm({
  orderNumber,
  initialStatus,
  initialCourier,
  initialTracking,
  initialPaymentStatus,
}: {
  orderNumber: string;
  initialStatus: string;
  initialCourier: string;
  initialTracking: string;
  initialPaymentStatus: string;
}) {
  const router = useRouter();
  const locale = useSearchParams().get("lang") === "en" ? "en" : "bn";

  const [status, setStatus] = useState(initialStatus);
  const [courier, setCourier] = useState(initialCourier);
  const [trackingNumber, setTrackingNumber] = useState(initialTracking);
  const [paymentStatus, setPaymentStatus] = useState(initialPaymentStatus);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "error"; text: string } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    setSubmitting(true);
    const res = await fetch(`/api/admin/orders/${orderNumber}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, courier, trackingNumber, paymentStatus }),
    });
    setSubmitting(false);
    if (!res.ok) {
      setMessage({ type: "error", text: locale === "bn" ? "আপডেট করা যায়নি।" : "Could not update." });
      return;
    }
    setMessage({ type: "ok", text: locale === "bn" ? "অর্ডার আপডেট হয়েছে।" : "Order updated." });
    router.refresh();
  }

  const inputCls = "w-full rounded-lg border border-brand-pinkLight px-3 py-2 text-sm";
  const labelCls = "mb-1 block text-xs font-medium text-brand-ink/60";

  return (
    <form onSubmit={handleSubmit} className="space-y-3 rounded-xl border border-brand-pinkLight bg-white p-4">
      <h3 className="text-sm font-semibold">{locale === "bn" ? "অর্ডার আপডেট করুন" : "Update Order"}</h3>

      <div>
        <label className={labelCls}>{locale === "bn" ? "অর্ডার স্ট্যাটাস" : "Order Status"}</label>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className={inputCls}>
          {STATUSES.map((s) => (
            <option key={s} value={s}>{locale === "bn" ? STATUS_LABELS[s].bn : STATUS_LABELS[s].en}</option>
          ))}
        </select>
      </div>

      <div>
        <label className={labelCls}>{locale === "bn" ? "পেমেন্ট স্ট্যাটাস" : "Payment Status"}</label>
        <select value={paymentStatus} onChange={(e) => setPaymentStatus(e.target.value)} className={inputCls}>
          {PAYMENT_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div>
        <label className={labelCls}>{locale === "bn" ? "কুরিয়ার" : "Courier"}</label>
        <input value={courier} onChange={(e) => setCourier(e.target.value)} placeholder="Pathao / Steadfast" className={inputCls} />
      </div>

      <div>
        <label className={labelCls}>{locale === "bn" ? "ট্র্যাকিং নম্বর" : "Tracking Number"}</label>
        <input value={trackingNumber} onChange={(e) => setTrackingNumber(e.target.value)} className={inputCls} />
      </div>

      {message && <p className={`text-sm ${message.type === "ok" ? "text-green-600" : "text-red-600"}`}>{message.text}</p>}

      <button disabled={submitting} className="w-full rounded-full bg-brand-pink px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-60">
        {submitting ? (locale === "bn" ? "আপডেট হচ্ছে..." : "Updating...") : (locale === "bn" ? "আপডেট সংরক্ষণ করুন" : "Save Update")}
      </button>
    </form>
  );
}
