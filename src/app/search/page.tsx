import { prisma } from "@/lib/prisma";
import ProductGrid from "@/components/ProductGrid";

// Search results page — requirement #7
export default async function SearchPage({ searchParams }: { searchParams?: { q?: string; lang?: string } }) {
  const q = searchParams?.q?.trim() ?? "";
  const locale = searchParams?.lang === "en" ? "en" : "bn";

  const products = q
    ? await prisma.product.findMany({
        where: {
          isActive: true,
          OR: [
            { nameEn: { contains: q, mode: "insensitive" } },
            { nameBn: { contains: q } },
            { sku: { contains: q, mode: "insensitive" } },
          ],
        },
        include: { images: true },
      })
    : [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="font-display text-xl font-semibold">
        {locale === "bn" ? `"${q}" এর জন্য ফলাফল` : `Results for "${q}"`}
      </h1>
      <ProductGrid title="" products={products} locale={locale} />
      {q && products.length === 0 && (
        <p className="mt-6 text-brand-ink/60">{locale === "bn" ? "কোনো পণ্য পাওয়া যায়নি।" : "No products matched your search."}</p>
      )}
    </div>
  );
}
