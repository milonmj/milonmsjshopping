import Link from "next/link";
import { Facebook, Instagram, Youtube } from "lucide-react";
import { SITE_NAME } from "@/lib/site-config";

type NavCategory = { slug: string; nameBn: string; nameEn: string };

export default function Footer({ locale = "bn", categories = [] }: { locale?: "bn" | "en"; categories?: NavCategory[] }) {
  const t = locale === "bn"
    ? {
        about: "মিলন এম অ্যান্ড জে শপিং — পোশাক, কসমেটিকস, জুতা ও ইলেকট্রনিক পণ্যের বিশ্বস্ত অনলাইন শপ।",
        location: "বারাবালা, বাংলাদেশ",
        delivery: "ডেলিভারি তথ্য",
        deliveryText: "সারা বাংলাদেশে হোম ডেলিভারি। পাঠাও ও স্টেডফাস্ট কুরিয়ারের মাধ্যমে।",
        payment: "পেমেন্ট পদ্ধতি",
        paymentText: "ক্যাশ অন ডেলিভারি, বিকাশ, নগদ, ব্যাংক ও কার্ড পেমেন্ট।",
        links: "কুইক লিংক",
        rights: "সর্বস্বত্ব সংরক্ষিত।",
      }
    : {
        about: `${SITE_NAME} — your trusted online shop for clothing, cosmetics, shoes, and electric items.`,
        location: "Barabala, Bangladesh",
        delivery: "Delivery Info",
        deliveryText: "Nationwide delivery across Bangladesh via Pathao and Steadfast courier.",
        payment: "Payment Methods",
        paymentText: "Cash on Delivery, bKash, Nagad, Bank & Card payment.",
        links: "Quick Links",
        rights: "All rights reserved.",
      };

  return (
    <footer className="mt-16 border-t border-brand-pinkLight bg-brand-ink text-white/80">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="mb-3 flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-pink text-sm font-bold text-white">M&J</span>
            <span className="font-display font-semibold text-white">{SITE_NAME}</span>
          </div>
          <p className="text-sm">{t.about}</p>
          <p className="mt-2 text-sm">{t.location}</p>
          <div className="mt-4 flex gap-3">
            <Facebook size={18} />
            <Instagram size={18} />
            <Youtube size={18} />
          </div>
        </div>

        <div>
          <h4 className="mb-3 font-semibold text-white">{t.delivery}</h4>
          <p className="text-sm">{t.deliveryText}</p>
        </div>

        <div>
          <h4 className="mb-3 font-semibold text-white">{t.payment}</h4>
          <p className="text-sm">{t.paymentText}</p>
        </div>

        <div>
          <h4 className="mb-3 font-semibold text-white">{t.links}</h4>
          <ul className="space-y-2 text-sm">
            {categories.map((c) => (
              <li key={c.slug}><Link href={`/category/${c.slug}`}>{locale === "bn" ? c.nameBn : c.nameEn}</Link></li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs">
        © {new Date().getFullYear()} {SITE_NAME}. {t.rights}
      </div>
    </footer>
  );
}
