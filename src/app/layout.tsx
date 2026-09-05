import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/Providers";
import { prisma } from "@/lib/prisma";
import { SITE_NAME, SITE_URL } from "@/lib/site-config";

export const metadata: Metadata = {
  title: `${SITE_NAME} — Clothing, Cosmetics, Shoes & Electric Items`,
  description:
    `${SITE_NAME} — retail & wholesale clothing, cosmetics, shoes and electric items, delivered across Bangladesh.`,
  metadataBase: new URL(SITE_URL),
};

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
        <Providers categories={categories}>{children}</Providers>
      </body>
    </html>
  );
}
