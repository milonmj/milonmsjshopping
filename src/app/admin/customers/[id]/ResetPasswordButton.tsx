"use client";

import { useState } from "react";

export default function ResetPasswordButton({
  customerId,
  locale,
}: {
  customerId: string;
  locale: "bn" | "en";
}) {
  const bn = locale === "bn";
  const [loading, setLoading] = useState(false);
  const [tempPassword, setTempPassword] = useState("");
  const [error, setError] = useState("");

  async function handleReset() {
    const ok = window.confirm(
      bn
        ? "এই কাস্টমারের জন্য নতুন অস্থায়ী পাসওয়ার্ড তৈরি করবেন? পুরনো পাসওয়ার্ড আর কাজ করবে না।"
        : "Generate a new temporary password? The old password will stop working."
    );
    if (!ok) return;

    setLoading(true);
    setError("");
    setTempPassword("");
    try {
      const res = await fetch(`/api/admin/customers/${customerId}/reset-password`, {
        method: "POST",
      });
      const data = await res.json();
      if (data.ok) {
        setTempPassword(data.tempPassword);
      } else {
        setError(data.error || (bn ? "রিসেট করা যায়নি।" : "Could not reset."));
      }
    } catch {
      setError(bn ? "রিসেট করা যায়নি।" : "Could not reset.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-4 border-t border-brand-pinkLight pt-4">
      <button
        type="button"
        onClick={handleReset}
        disabled={loading}
        className="rounded-lg bg-brand-pink px-3 py-2 text-sm font-medium text-white disabled:opacity-50"
      >
        {loading
          ? bn ? "অপেক্ষা করুন..." : "Please wait..."
          : bn ? "নতুন পাসওয়ার্ড দিন" : "Reset Password"}
      </button>

      {tempPassword && (
        <div className="mt-3 rounded-lg bg-brand-pinkLight p-3 text-sm">
          <p className="text-xs text-brand-ink/60">
            {bn
              ? "অস্থায়ী পাসওয়ার্ড (এখনই কাস্টমারকে জানান, আর দেখা যাবে না):"
              : "Temporary password (share it now, it won't be shown again):"}
          </p>
          <p className="mt-1 select-all text-lg font-semibold tracking-wider">
            {tempPassword}
          </p>
        </div>
      )}

      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}
