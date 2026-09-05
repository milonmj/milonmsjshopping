"use client";
import Link from "next/link";
import { useState } from "react";
import { Search, Heart, ShoppingBag, User, Menu, X } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { useWishlist } from "@/lib/wishlist-context";
import { SITE_NAME } from "@/lib/site-config";

type NavCategory = { slug: string; nameBn: string; nameEn: string };

export default function Header({ locale = "bn", categories = [] }: { locale?: "bn" | "en"; categories?: NavCategory[] }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const otherLocale = locale === "bn" ? "en" : "bn";
  const { itemCount } = useCart();
  const { items: wishlistItems } = useWishlist();

  return (
    <header className="sticky top-0 z-40 border-b border-brand-pinkLight bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3">
        <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-pink font-display text-lg font-bold text-white">
            M&J
          </span>
          <span className="hidden font-display text-lg font-semibold text-brand-ink sm:inline">
            {locale === "bn" ? "মিলন এম অ্যান্ড জে" : SITE_NAME}
          </span>
        </Link>

        <nav className="hidden flex-1 items-center gap-6 md:flex">
          {categories.map((c) => (
            <Link key={c.slug} href={`/category/${c.slug}`} className="text-sm font-medium text-brand-ink/80 hover:text-brand-pink">
              {locale === "bn" ? c.nameBn : c.nameEn}
            </Link>
          ))}
        </nav>

        <div className="relative hidden flex-1 max-w-md md:block">
          <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-brand-ink/40" />
          <input
            type="search"
            placeholder={locale === "bn" ? "পণ্য খুঁজুন..." : "Search products..."}
            className="w-full rounded-full border border-brand-pinkLight bg-brand-pinkLight/40 py-2 pl-9 pr-4 text-sm outline-none focus:border-brand-pink"
          />
        </div>

        <div className="ml-auto flex items-center gap-4">
          <Link href={`?lang=${otherLocale}`} className="text-xs font-semibold uppercase text-brand-ink/60 hover:text-brand-pink">
            {otherLocale === "bn" ? "বাংলা" : "EN"}
          </Link>
          <Link href="/wishlist" aria-label="Wishlist" className="relative">
            <Heart size={20} />
            {wishlistItems.length > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-brand-pink text-[10px] text-white">
                {wishlistItems.length}
              </span>
            )}
          </Link>
          <Link href="/cart" aria-label="Cart" className="relative">
            <ShoppingBag size={20} />
            {itemCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-brand-pink text-[10px] text-white">
                {itemCount}
              </span>
            )}
          </Link>
          <Link href="/account" aria-label="Account"><User size={20} /></Link>
        </div>
      </div>

      {menuOpen && (
        <nav className="flex flex-col gap-1 border-t border-brand-pinkLight bg-white px-4 py-3 md:hidden">
          {categories.map((c) => (
            <Link key={c.slug} href={`/category/${c.slug}`} className="py-2 text-sm font-medium">
              {locale === "bn" ? c.nameBn : c.nameEn}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
