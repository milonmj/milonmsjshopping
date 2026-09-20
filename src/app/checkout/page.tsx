"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useCart } from "@/lib/cart-context";

const PAYMENT_METHODS = [
  { value: "COD", labelBn: "ক্যাশ অন ডেলিভারি", labelEn: "Cash on Delivery", ready: true },
  { value: "BKASH", labelBn: "বিকাশ", labelEn: "bKash", ready: false },
  { value: "NAGAD", labelBn: "নগদ", labelEn: "Nagad", ready: false },
  { value: "BANK", labelBn: "ব্যাংক পেমেন্ট", labelEn: "Bank Payment", ready: false },
  { value: "CARD", labelBn: "কার্ড পেমেন্ট", labelEn: "Card Payment", ready: false },
] as const;

type SavedAddress = {
  id: string;
  label: string;
  fullName: string;
  phone: string;
  district: string;
  area: string;
  addressLine: string;
  isDefault: boolean;
};

// Checkout — requirement #9. COD places a real order in the database now. bKash/Nagad/Bank/Card
// are selectable (so the flow and UI are fully built) but marked "coming soon" until real
// merchant credentials are added — no fake transactions are simulated, per your instruction.
//
// Stage 4: guest checkout still works exactly as in Stage 3. When signed in, this page also
// prefills the customer's name/phone, offers their saved addresses in a dropdown, and can save
// a newly-entered address back to their account. The placed order is linked to the account
// server-side (see /api/orders) regardless of what's in this form.
export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const router = useRouter();
  const { data: session, status } = useSession();
  const locale = useSearchParams().get("lang") === "en" ? "en" : "bn";

  const [form, setForm] = useState({ guestName: "", guestPhone: "", deliveryDistrict: "", deliveryArea: "", deliveryAddress: "" });
  const [paymentMethod, setPaymentMethod] = useState<(typeof PAYMENT_METHODS)[number]["value"]>("COD");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
const [couponCode, setCouponCode] = useState("");
const [couponLoading, setCouponLoading] = useState(false);
const [couponError, setCouponError] = useState<string | null>(null);
const [appliedCoupon, setAppliedCoupon] = useState<{
  couponId: string;
  code: string;
  discountAmount: number;
} | null>(null);
  const [addresses, setAddresses] = useState<SavedAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>("new");
  const [saveAddress, setSaveAddress] = useState(false);
  const [prefilled, setPrefilled] = useState(false);

  // Prefill name/phone from the account once, and load saved addresses
  useEffect(() => {
    if (status !== "authenticated" || prefilled) return;
    setPrefilled(true);
    setForm((f) => ({
      ...f,
      guestName: f.guestName || session.user.name || "",
      guestPhone: f.guestPhone || (session.user as any).phone || "",
    }));

    fetch("/api/account/addresses")
      .then((res) => (res.ok ? res.json() : []))
      .then((data: SavedAddress[]) => {
        setAddresses(data);
        const def = data.find((a) => a.isDefault) ?? data[0];
        if (def) {
          setSelectedAddressId(def.id);
          setForm((f) => ({
            ...f,
            guestName: def.fullName,
            guestPhone: def.phone,
            deliveryDistrict: def.district,
            deliveryArea: def.area,
            deliveryAddress: def.addressLine,
          }));
        }
      })
      .catch(() => {});
  }, [status, session, prefilled]);

  function handleSelectAddress(id: string) {
    setSelectedAddressId(id);
    if (id === "new") {
      setForm((f) => ({ ...f, deliveryDistrict: "", deliveryArea: "", deliveryAddress: "" }));
      return;
    }
    const addr = addresses.find((a) => a.id === id);
    if (addr) {
      setForm({
        guestName: addr.fullName,
        guestPhone: addr.phone,
        deliveryDistrict: addr.district,
        deliveryArea: addr.area,
        deliveryAddress: addr.addressLine,
      });
    }
  }

  const deliveryCharge = form.deliveryDistrict.trim().toLowerCase() === "dhaka" ? 70 : 130;
  const total = subtotal + (items.length ? deliveryCharge : 0);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          paymentMethod,
          items: items.map((i) => ({
            productId: i.productId,
            quantity: i.quantity,
            unitPrice: i.unitPrice,
            variantInfo: i.variantInfo,
          })),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong.");
        setSubmitting(false);
        return;
      }

      // Best-effort: save a newly-entered address to the account if the customer opted in.
      // Never blocks the order from completing if this fails.
      if (status === "authenticated" && selectedAddressId === "new" && saveAddress) {
        fetch("/api/account/addresses", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            label: "Home",
            fullName: form.guestName,
            phone: form.guestPhone,
            district: form.deliveryDistrict,
            area: form.deliveryArea,
            addressLine: form.deliveryAddress,
          }),
        }).catch(() => {});
      }

      clearCart();
      router.push(`/order-confirmation/${data.order.orderNumber}`);
    } catch {
      setError(locale === "bn" ? "অর্ডার করা যায়নি। আবার চেষ্টা করুন।" : "Could not place the order. Please try again.");
      setSubmitting(false);
    }
  }

  if (items.length === 0) {
    return <p className="mx-auto max-w-3xl px-4 py-16 text-center text-brand-ink/60">{locale === "bn" ? "আপনার কার্ট খালি।" : "Your cart is empty."}</p>;
  }

  return (
    <div className="mx-auto grid max-w-5xl gap-8 px-4 py-8 md:grid-cols-2">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-xl font-semibold">{locale === "bn" ? "ডেলিভারি তথ্য" : "Delivery Information"}</h1>
          {status === "authenticated" ? (
            <p className="text-xs text-brand-ink/50">
              {locale === "bn" ? "লগইনকৃত" : "Signed in"} · {session.user.name} ·{" "}
              <button type="button" onClick={() => signOut({ callbackUrl: "/checkout" })} className="font-semibold text-brand-pink">
                {locale === "bn" ? "লগআউট" : "Log out"}
              </button>
            </p>
          ) : (
            <p className="text-xs text-brand-ink/50">
              <Link href="/login?callbackUrl=/checkout" className="font-semibold text-brand-pink">
                {locale === "bn" ? "লগইন করুন" : "Log in"}
              </Link>{" "}
              {locale === "bn" ? "দ্রুত চেকআউটের জন্য" : "for faster checkout"}
            </p>
          )}
        </div>

        {status === "authenticated" && addresses.length > 0 && (
          <div>
            <label className="mb-1 block text-xs font-medium text-brand-ink/60">
              {locale === "bn" ? "ঠিকানা বাছাই করুন" : "Deliver to"}
            </label>
            <select
              value={selectedAddressId}
              onChange={(e) => handleSelectAddress(e.target.value)}
              className="w-full rounded-lg border border-brand-pinkLight px-4 py-2.5 text-sm"
            >
              {addresses.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.label} — {a.addressLine}, {a.area}, {a.district}
                </option>
              ))}
              <option value="new">{locale === "bn" ? "+ নতুন ঠিকানা লিখুন" : "+ Enter a new address"}</option>
            </select>
          </div>
        )}

        <input required placeholder={locale === "bn" ? "পুরো নাম" : "Full Name"} value={form.guestName}
          onChange={(e) => setForm({ ...form, guestName: e.target.value })}
          className="w-full rounded-lg border border-brand-pinkLight px-4 py-2.5 text-sm" />

        <input required placeholder={locale === "bn" ? "ফোন নম্বর" : "Phone Number"} value={form.guestPhone}
          onChange={(e) => setForm({ ...form, guestPhone: e.target.value })}
          className="w-full rounded-lg border border-brand-pinkLight px-4 py-2.5 text-sm" />

        <div className="grid grid-cols-2 gap-3">
          <input required placeholder={locale === "bn" ? "জেলা (যেমন Dhaka)" : "District (e.g. Dhaka)"} value={form.deliveryDistrict}
            onChange={(e) => setForm({ ...form, deliveryDistrict: e.target.value })}
            className="rounded-lg border border-brand-pinkLight px-4 py-2.5 text-sm" />
          <input required placeholder={locale === "bn" ? "এলাকা" : "Area"} value={form.deliveryArea}
            onChange={(e) => setForm({ ...form, deliveryArea: e.target.value })}
            className="rounded-lg border border-brand-pinkLight px-4 py-2.5 text-sm" />
        </div>

        <textarea required placeholder={locale === "bn" ? "সম্পূর্ণ ঠিকানা" : "Full Address"} value={form.deliveryAddress}
          onChange={(e) => setForm({ ...form, deliveryAddress: e.target.value })}
          className="w-full rounded-lg border border-brand-pinkLight px-4 py-2.5 text-sm" rows={3} />

        {status === "authenticated" && selectedAddressId === "new" && (
          <label className="flex items-center gap-2 text-sm text-brand-ink/70">
            <input type="checkbox" checked={saveAddress} onChange={(e) => setSaveAddress(e.target.checked)} />
            {locale === "bn" ? "এই ঠিকানাটি আমার অ্যাকাউন্টে সংরক্ষণ করুন" : "Save this address to my account"}
          </label>
        )}

        <h2 className="pt-2 font-display text-lg font-semibold">{locale === "bn" ? "পেমেন্ট পদ্ধতি" : "Payment Method"}</h2>
        <div className="space-y-2">
          {PAYMENT_METHODS.map((m) => (
            <label key={m.value} className={`flex items-center justify-between rounded-lg border px-4 py-3 text-sm ${m.ready ? "border-brand-pinkLight" : "border-brand-pinkLight opacity-60"}`}>
              <span className="flex items-center gap-2">
                <input type="radio" name="payment" checked={paymentMethod === m.value} onChange={() => setPaymentMethod(m.value)} />
                {locale === "bn" ? m.labelBn : m.labelEn}
              </span>
              {!m.ready && <span className="text-xs text-brand-ink/40">{locale === "bn" ? "শীঘ্রই আসছে" : "Coming soon"}</span>}
            </label>
          ))}
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button disabled={submitting} className="w-full rounded-full bg-brand-pink px-6 py-3 text-sm font-semibold text-white disabled:opacity-60">
          {submitting ? (locale === "bn" ? "অর্ডার হচ্ছে..." : "Placing order...") : (locale === "bn" ? "অর্ডার নিশ্চিত করুন" : "Place Order")}
        </button>
      </form>

      <div className="h-fit rounded-xl border border-brand-pinkLight bg-white p-5">
        <h2 className="font-display text-lg font-semibold">{locale === "bn" ? "অর্ডার সামারি" : "Order Summary"}</h2>
        <div className="mt-4 space-y-3">
          {items.map((item) => (
            <div key={item.productId + (item.variantInfo ?? "")} className="flex justify-between text-sm">
              <span className="text-brand-ink/70">{item.name} × {item.quantity}</span>
              <span className="font-medium">৳{item.unitPrice * item.quantity}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 space-y-2 border-t border-brand-pinkLight pt-4 text-sm">
          <div className="flex justify-between"><span>{locale === "bn" ? "সাবটোটাল" : "Subtotal"}</span><span>৳{subtotal}</span></div>
          <div className="flex justify-between"><span>{locale === "bn" ? "ডেলিভারি চার্জ" : "Delivery Charge"}</span><span>৳{deliveryCharge}</span></div>
          <div className="flex justify-between text-base font-bold text-brand-pink"><span>{locale === "bn" ? "মোট" : "Total"}</span><span>৳{total}</span></div>
        </div>
      </div>
    </div>
  );
}
