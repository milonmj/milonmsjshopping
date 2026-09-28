"use client";

import { useEffect, useState } from "react";

type Admin = {
  id: string;
  name: string;
  phone: string;
  role: string;
  createdAt: string;
};

export default function AdminsPage() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  async function load() {
    const res = await fetch("/api/admin/admins");
    if (res.ok) setAdmins(await res.json());
  }

  useEffect(() => {
    load();
  }, []);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setMsg("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/admins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, password }),
      });
      const data = await res.json();
      if (data.ok) {
        setMsg("নতুন অ্যাডমিন যোগ হয়েছে।");
        setName("");
        setPhone("");
        setPassword("");
        load();
      } else {
        setMsg(data.error || "কিছু ভুল হয়েছে।");
      }
    } catch {
      setMsg("কিছু ভুল হয়েছে। আবার চেষ্টা করুন।");
    }
    setLoading(false);
  }

  async function handleRemove(id: string, adminName: string) {
    if (!confirm(adminName + " এর অ্যাডমিন অ্যাক্সেস বন্ধ করবেন?")) return;
    setMsg("");
    const res = await fetch("/api/admin/admins/" + id, { method: "PATCH" });
    const data = await res.json();
    if (data.ok) {
      setMsg("অ্যাডমিন অ্যাক্সেস বন্ধ করা হয়েছে।");
      load();
    } else {
      setMsg(data.error || "কিছু ভুল হয়েছে।");
    }
  }

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">অ্যাডমিন ব্যবস্থাপনা</h1>

      {msg && (
        <p className="mb-4 rounded border border-pink-200 bg-pink-50 px-3 py-2 text-sm">
          {msg}
        </p>
      )}

      <div className="mb-6 rounded border bg-white p-4">
        <h2 className="mb-3 font-semibold">নতুন অ্যাডমিন যোগ করুন</h2>
        <form onSubmit={handleAdd} className="space-y-3">
          <input
            className="w-full rounded border px-3 py-2 text-sm"
            placeholder="নাম"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            className="w-full rounded border px-3 py-2 text-sm"
            placeholder="ফোন নম্বর (যেমন 01712345678)"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <input
            className="w-full rounded border px-3 py-2 text-sm"
            type="password"
            placeholder="পাসওয়ার্ড (কমপক্ষে ৮ অক্ষর)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="submit"
            disabled={loading}
            className="rounded bg-pink-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
          >
            {loading ? "অপেক্ষা করুন..." : "অ্যাডমিন যোগ করুন"}
          </button>
        </form>
      </div>

      <div className="rounded border bg-white p-4">
        <h2 className="mb-3 font-semibold">বর্তমান অ্যাডমিন</h2>
        <div className="space-y-3">
          {admins.map((a) => (
            <div
              key={a.id}
              className="flex items-center justify-between border-b pb-2 text-sm"
            >
              <div>
                <p className="font-medium">{a.name}</p>
                <p className="text-gray-500">{a.phone}</p>
              </div>
              <button
                onClick={() => handleRemove(a.id, a.name)}
                className="rounded border border-pink-600 px-3 py-1 text-pink-600"
              >
                অ্যাক্সেস বন্ধ করুন
              </button>
            </div>
          ))}
          {admins.length === 0 && (
            <p className="text-sm text-gray-500">কোনো অ্যাডমিন পাওয়া যায়নি।</p>
          )}
        </div>
      </div>
    </div>
  );
            }
