import type { Metadata } from "next";
import "./globals.css";
import Script from "next/script";
import Providers from "@/components/Providers";
import Analytics from "@/components/Analytics";
import { prisma } from "@/lib/prisma";
import { SITE_NAME, SITE_URL } from "@/lib/site-config";

export const metadata: Metadata = {
    title: "Milon M&J Shopping | M&J Shopping Bangladesh",
  description:
    "মিলন এম অ্যান্ড জে শপিং (Milon M&J Shopping) - মেয়েদের পোশাকের অনলাইন শপ। এম এন্ড জে শপিং থেকে অর্ডার করুন, বাংলাদেশের যেকোনো জায়গায় ডেলিভারি।",
  metadataBase: new URL(SITE_URL),
  verification: {
    google: "Vq0JscILAibRCtubOqoEpaIvX1r5NFIZTWOS__gHDas",
  },
};

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  let categories: { slug: string; nameBn: string; nameEn: string }[] = [];
  try {
    categories = await prisma.category.findMany({
      where: { parentId: null, isActive: true },
      select: { slug: true, nameBn: true, nameEn: true },
      orderBy: { nameEn: "asc" },
    });
  } catch (err) {
    console.error("Failed to load categories for header/footer nav:", err);
  }

  return (
    <html lang="bn">
      <body className="font-body text-brand-ink antialiased">
        {GA_MEASUREMENT_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_MEASUREMENT_ID}');
              `}
            </Script>
          </>
        )}
        <Analytics />
        <Providers categories={categories}>{children}</Providers>
      </body>
    </html>
  );
}
