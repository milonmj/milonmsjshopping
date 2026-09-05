"use client";
import { useState } from "react";
import { Facebook, Link2, Check } from "lucide-react";

export default function ShareButtons({
  productName,
  price,
  locale = "bn",
}: {
  productName: string;
  price: number;
  locale?: "bn" | "en";
}) {
  const [copied, setCopied] = useState(false);

  const currentUrl = typeof window !== "undefined" ? window.location.href : "";

  const shareText =
    locale === "bn"
      ? `দেখুন: ${productName} — ৳${price}`
      : `Check this out: ${productName} — ৳${price}`;

  function openShare(url: string) {
    window.open(url, "_blank", "noopener,noreferrer,width=600,height=600");
  }

  function shareFacebook() {
    openShare(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`);
  }

  function shareWhatsApp() {
    openShare(`https://wa.me/?text=${encodeURIComponent(`${shareText}\n${currentUrl}`)}`);
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fail silently
    }
  }

  const btnCls = "flex items-center gap-1.5 rounded-full border border-brand-pinkLight px-3 py-1.5 text-xs font-medium text-brand-ink/70 hover:border-brand-pink hover:text-brand-pink";

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs text-brand-ink/50">{locale === "bn" ? "শেয়ার করুন:" : "Share:"}</span>
      <button onClick={shareFacebook} className={btnCls} aria-label="Share on Facebook">
        <Facebook size={14} /> Facebook
      </button>
      <button onClick={shareWhatsApp} className={btnCls} aria-label="Share on WhatsApp">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.46 1.32 4.96L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91C22 6.45 17.5 2 12.04 2Zm5.8 14.06c-.24.68-1.4 1.3-1.93 1.38-.5.08-1.12.11-1.8-.11-.42-.13-.95-.3-1.64-.6-2.88-1.24-4.76-4.14-4.9-4.33-.14-.19-1.17-1.55-1.17-2.96 0-1.4.74-2.09 1-2.38.26-.28.57-.35.76-.35h.55c.18 0 .42-.07.65.5.24.58.83 2 .9 2.15.07.14.12.31.02.5-.1.19-.15.31-.3.48-.14.17-.31.38-.44.51-.14.14-.3.3-.13.58.17.28.75 1.24 1.62 2.01 1.11.99 2.05 1.3 2.33 1.44.28.14.44.12.6-.07.17-.19.72-.84.91-1.13.19-.29.38-.24.63-.14.26.09 1.63.77 1.91.91.28.14.47.21.54.33.07.12.07.71-.17 1.39Z" />
        </svg>
        WhatsApp
      </button>
      <button onClick={copyLink} className={btnCls} aria-label="Copy link">
        {copied ? <Check size={14} /> : <Link2 size={14} />}
        {copied ? (locale === "bn" ? "কপি হয়েছে!" : "Copied!") : (locale === "bn" ? "লিংক কপি" : "Copy Link")}
      </button>
    </div>
  );
}
