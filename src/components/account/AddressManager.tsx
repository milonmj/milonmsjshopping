"use client";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Pencil, Trash2, Star, Plus } from "lucide-react";

type Address = {
  id: string;
  label: string;
  fullName: string;
  phone: string;
  district: string;
  area: string;
  addressLine: string;
  isDefault: boolean;
};

const EMPTY_FORM = { label: "Home", fullName: "", phone: "", district: "", area: "", addressLine: "" };

export default function AddressManager({ initialAddresses }: { initialAddresses: Address[] }) {
  const locale = useSearchParams().get("lang") === "en" ? "en" : "bn";
  const [addresses, setAddresses] = useState<Address[]>(initialAddresses);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function startAdd() {
    setForm(EMPTY_FORM);
    setError(null);
    setEditingId("new");
  }

  function startEdit(addr: Address) {
    setForm({ label: addr.label, fullName: addr.fullName, phone: addr.phone, district: addr.district, area: addr.area, addressLine: addr.addressLine });
    setError(null);
    setEditingId(addr.id);
  }

  function cancel() {
    setEditingId(null);
    setError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      if (editingId === "new") {
        const res = await fetch("/api/account/addresses", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Failed");
        setAddresses((prev) => (data.isDefault ? [data, ...prev.map((a) => ({ ...a, isDefault: false }))] : [...prev, data]));
      } else if (editingId) {
        const res = await fetch(`/api/account/addresses/${editingId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Failed");
        setAddresses((prev) => prev.map((a) => (a.id === editingId ? data : a)));
      }
      setEditingId(null);
    } catch (err: any) {
      setError(err.message ?? (locale === "bn" ? "সংরক্ষণ করা যায়নি।" : "Could not save."));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    const ok = window.confirm(locale === "bn" ? "এই ঠিকানাটি মুছে ফেলবেন?" : "Delete this address?");
    if (!ok) return;
    const prev = addresses;
    setAddresses((cur) => cur.filter((a) => a.id !== id));
    const res = await fetch(`/api/account/addresses/${id}`, { method: "DELETE" });
    if (!res.ok) setAddresses(prev);
  }

  async function handleSetDefault(addr: Address) {
    const prev = addresses;
    setAddresses((cur) => cur.map((a) => ({ ...a, isDefault: a.id === addr.id })));
    const res = await fetch(`/api/account/addresses/${addr.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isDefault: true }),
    });
    if (!res.ok) setAddresses(prev);
  }

  return (
    <div className="space-y-4">
      {addresses.length === 0 && editingId === null && (
        <p className="text-sm text-brand-ink/60">{locale === "bn" ? "কোনো সংরক্ষিত ঠিকানা নেই।" : "No saved addresses yet."}</p>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        {addresses.map((addr) => (
          <div key={addr.id} className="rounded-xl border border-brand-pinkLight bg-white p-4">
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-brand-pinkLight px-2.5 py-0.5 text-xs font-semibold text-brand-pinkDark">{addr.label}</span>
              {addr.isDefault && (
                <span className="flex items-center gap-1 text-xs font-medium text-brand-pink">
                  <Star size={12} fill="currentColor" /> {locale === "bn" ? "ডিফল্ট" : "Default"}
                </span>
              )}
            </div>
            <p className="mt-2 text-sm font-medium">{addr.fullName} · {addr.phone}</p>
            <p className="mt-1 text-sm text-brand-ink/60">{addr.addressLine}, {addr.area}, {addr.district}</p>
            <div className="mt-3 flex flex-wrap gap-2 text-xs">
              <button onClick={() => startEdit(addr)} className="flex items-center gap-1 rounded-full border border-brand-pinkLight px-3 py-1.5 text-brand-ink/70 hover:border-brand-pink">
                <Pencil size={12} /> {locale === "bn" ? "সম্পাদনা" : "Edit"}
              </button>
              {!addr.isDefault && (
                <button onClick={() => handleSetDefault(addr)} className="flex items-center gap-1 rounded-full border border-brand-pinkLight px-3 py-1.5 text-brand-ink/70 hover:border-brand-pink">
                  <Star size={12} /> {locale === "bn" ? "ডিফল্ট করুন" : "Set Default"}
                </button>
              )}
              <button onClick={() => handleDelete(addr.id)} className="flex items-center gap-1 rounded-full border border-brand-pinkLight px-3 py-1.5 text-red-500 hover:border-red-400">
                <Trash2 size={12} /> {locale === "bn" ? "মুছুন" : "Delete"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {editingId === null && (
        <button onClick={startAdd} className="flex items-center gap-1.5 rounded-full bg-brand-pink px-5 py-2.5 text-sm font-semibold text-white">
          <Plus size={16} /> {locale === "bn" ? "নতুন ঠিকানা যোগ করুন" : "Add New Address"}
        </button>
      )}

      {editingId !== null && (
        <form onSubmit={handleSubmit} className="max-w-md space-y-3 rounded-xl border border-brand-pinkLight bg-white p-4">
          <h3 className="text-sm font-semibold">
            {editingId === "new" ? (locale === "bn" ? "নতুন ঠিকানা" : "New Address") : (locale === "bn" ? "ঠিকানা সম্পাদনা" : "Edit Address")}
          </h3>

          <select value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })}
            className="w-full rounded-lg border border-brand-pinkLight px-4 py-2.5 text-sm">
            <option value="Home">{locale === "bn" ? "বাড়ি" : "Home"}</option>
            <option value="Office">{locale === "bn" ? "অফিস" : "Office"}</option>
            <option value="Other">{locale === "bn" ? "অন্যান্য" : "Other"}</option>
          </select>

          <input required placeholder={locale === "bn" ? "পুরো নাম" : "Full Name"} value={form.fullName}
            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            className="w-full rounded-lg border border-brand-pinkLight px-4 py-2.5 text-sm" />

          <input required placeholder={locale === "bn" ? "ফোন নম্বর" : "Phone Number"} value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="w-full rounded-lg border border-brand-pinkLight px-4 py-2.5 text-sm" />

          <div className="grid grid-cols-2 gap-3">
            <input required placeholder={locale === "bn" ? "জেলা" : "District"} value={form.district}
              onChange={(e) => setForm({ ...form, district: e.target.value })}
              className="rounded-lg border border-brand-pinkLight px-4 py-2.5 text-sm" />
            <input required placeholder={locale === "bn" ? "এলাকা" : "Area"} value={form.area}
              onChange={(e) => setForm({ ...form, area: e.target.value })}
              className="rounded-lg border border-brand-pinkLight px-4 py-2.5 text-sm" />
          </div>

          <textarea required placeholder={locale === "bn" ? "সম্পূর্ণ ঠিকানা" : "Full Address"} value={form.addressLine}
            onChange={(e) => setForm({ ...form, addressLine: e.target.value })}
            className="w-full rounded-lg border border-brand-pinkLight px-4 py-2.5 text-sm" rows={3} />

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex gap-2">
            <button disabled={submitting} className="rounded-full bg-brand-pink px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60">
              {submitting ? (locale === "bn" ? "সংরক্ষণ হচ্ছে..." : "Saving...") : (locale === "bn" ? "সংরক্ষণ করুন" : "Save Address")}
            </button>
            <button type="button" onClick={cancel} className="rounded-full border border-brand-pinkLight px-5 py-2.5 text-sm font-semibold text-brand-ink/70">
              {locale === "bn" ? "বাতিল" : "Cancel"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
