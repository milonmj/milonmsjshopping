import { prisma } from "@/lib/prisma";
import Hero from "@/components/Hero";
import ProductGrid from "@/components/ProductGrid";

export const revalidate = 60;

export default async function HomePage({ searchParams }: { searchParams?: { lang?: string } }) {
  const locale = searchParams?.lang === "en" ? "en" : "bn";

  const [featured, newArrivals] = await Promise.all([
    prisma.product.findMany({ where: { isActive: true, isFeatured: true }, include: { images: true }, take: 10 }),
    prisma.product.findMany({ where: { isActive: true }, include: { images: true }, orderBy: { createdAt: "desc" }, take: 10 }),
  ]);

  return (
    <>
      <Hero locale={locale} />
      <ProductGrid title={locale === "bn" ? "বিশেষ পণ্য" : "Featured Products"} products={featured} locale={locale} />
      <ProductGrid title={locale === "bn" ? "নতুন সংগ্রহ" : "New Arrivals"} products={newArrivals} locale={locale} />
    </>
  );
}
