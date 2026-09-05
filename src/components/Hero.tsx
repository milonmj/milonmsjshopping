import Link from "next/link";
import { SITE_NAME } from "@/lib/site-config";

export default function Hero({ locale = "bn" }: { locale?: "bn" | "en" }) {
  const t = locale === "bn"
    ? { title: "আপনার বিশ্বস্ত অনলাইন শপ", sub: "পোশাক, কসমেটিকস, জুতা ও ইলেকট্রনিক পণ্য — খুচরা ও পাইকারি দামে, সারা বাংলাদেশে ডেলিভারি।", cta: "এখনই কিনুন", wholesale: "পাইকারি মূল্য দেখুন" }
    : { title: "Your Trusted Online Shop", sub: "Clothing, cosmetics, shoes & electric items — at retail and wholesale prices, delivered across Bangladesh.", cta: "Shop Now", wholesale: "See Wholesale Prices" };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-brand-pinkLight via-white to-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-14 md:grid-cols-2 md:py-20">
        <div className="flex flex-col justify-center">
          <span className="mb-3 w-fit rounded-full bg-brand-pink/10 px-3 py-1 text-xs font-semibold text-brand-pink">
            {SITE_NAME}
          </span>
          <h1 className="font-display text-3xl font-bold leading-tight text-brand-ink sm:text-4xl md:text-5xl">
            {t.title}
          </h1>
          <p className="mt-4 max-w-md text-brand-ink/70">{t.sub}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/category/clothing" className="rounded-full bg-brand-pink px-6 py-3 text-sm font-semibold text-white hover:bg-brand-pinkDark">
              {t.cta}
            </Link>
            <Link href="/wholesale" className="rounded-full border border-brand-ink/20 px-6 py-3 text-sm font-semibold text-brand-ink hover:border-brand-pink hover:text-brand-pink">
              {t.wholesale}
            </Link>
          </div>
        </div>
        <div className="relative hidden md:block">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-72 w-72 rounded-full bg-brand-pink/20 blur-2xl" />
          </div>
          <div className="relative mx-auto flex h-80 w-64 items-center justify-center rounded-2xl bg-white shadow-xl">
            <span className="font-display text-6xl font-bold text-brand-pink">M&J</span>
          </div>
        </div>
      </div>
    </section>
  );
}
