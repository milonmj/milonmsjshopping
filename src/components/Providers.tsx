"use client";
import { ReactNode, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { SessionProvider } from "next-auth/react";
import { CartProvider } from "@/lib/cart-context";
import { WishlistProvider } from "@/lib/wishlist-context";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

type NavCategory = { slug: string; nameBn: string; nameEn: string };

function LocaleChrome({ children, categories }: { children: ReactNode; categories: NavCategory[] }) {
  const locale = useSearchParams().get("lang") === "en" ? "en" : "bn";
  return (
    <>
      <Header locale={locale} categories={categories} />
      <main>{children}</main>
      <Footer locale={locale} categories={categories} />
      <WhatsAppButton label={locale === "bn" ? "হোয়াটসঅ্যাপে চ্যাট করুন" : "Chat with us on WhatsApp"} />
    </>
  );
}

export default function Providers({ children, categories }: { children: ReactNode; categories: NavCategory[] }) {
  return (
    <SessionProvider>
      <CartProvider>
        <WishlistProvider>
          <Suspense fallback={null}>
            <LocaleChrome categories={categories}>{children}</LocaleChrome>
          </Suspense>
        </WishlistProvider>
      </CartProvider>
    </SessionProvider>
  );
}
