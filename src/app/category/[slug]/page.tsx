import { prisma } from "@/lib/prisma";
import ProductImage from "@/components/ProductImage";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { SITE_NAME } from "@/lib/site-config";

type Props = { params: { slug: string }; searchParams?: { lang?: string; sort?: string; minPrice?: string; maxPrice?: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const category = await prisma.category.findUnique({ where: { slug: params.slug } });
  if (!category) return {};
  return {
    title: `${category.nameEn} — ${SITE_NAME}`,
    description: `Shop ${category.nameEn} at retail and wholesale prices from ${SITE_NAME}, Bangladesh.`,
  };
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const locale = searchParams?.lang === "en" ? "en" : "bn";

  const category = await prisma.category.findUnique({
    where: { slug: params.slug },
    include: { children: true },
  });
  if (!category || !category.isActive) notFound();

  const categoryIds = category.children.length
    ? category.children.map((c) => c.id)
    : [category.id];

  const minPrice = searchParams?.minPrice ? Number(searchParams.minPrice) : undefined;
  const maxPrice = searchParams?.maxPrice ? Number(searchParams.maxPrice) : undefined;
  const sort = searchParams?.sort;

  const products = await prisma.product.findMany({
    where: {
      isActive: true,
      categoryId: { in: categoryIds },
      ...(minPrice || maxPrice
        ? { retailPrice: { gte: minPrice ?? 0, lte: maxPrice ?? 999999 } }
        : {}),
    },
    include: { images: true },
    orderBy:
      sort === "price_asc" ? { retailPrice: "asc" } :
      sort === "price_desc" ? { retailPrice: "desc" } :
      { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="font-display text-2xl font-semibold">{locale === "bn" ? category.nameBn : category.nameEn}</h1>

      {category.children.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {category.children.map((c) => (
            <a key={c.id} href={`/category/${c.slug}`} className="rounded-full border border-brand-pinkLight px-3 py-1 text-xs text-brand-ink/70 hover:border-brand-pink hover:text-brand-pink">
              {locale === "bn" ? c.nameBn : c.nameEn}
            </a>
          ))}
        </div>
      )}

      <form className="mt-5 flex flex-wrap items-center gap-3 text-sm">
        <select name="sort" defaultValue={sort ?? ""} className="rounded-lg border border-brand-pinkLight px-3 py-2">
          <option value="">{locale === "bn" ? "সাজান" : "Sort"}</option>
          <option value="price_asc">{locale === "bn" ? "কম দাম আগে" : "Price: Low to High"}</option>
          <option value="price_desc">{locale === "bn" ? "বেশি দাম আগে" : "Price: High to Low"}</option>
        </select>
        <input name="minPrice" placeholder={locale === "bn" ? "সর্বনিম্ন মূল্য" : "Min price"} defaultValue={searchParams?.minPrice} className="w-28 rounded-lg border border-brand-pinkLight px-3 py-2" />
        <input name="maxPrice" placeholder={locale === "bn" ? "সর্বোচ্চ মূল্য" : "Max price"} defaultValue={searchParams?.maxPrice} className="w-28 rounded-lg border border-brand-pinkLight px-3 py-2" />
        <button className="rounded-lg bg-brand-pink px-4 py-2 font-semibold text-white">{locale === "bn" ? "ফিল্টার" : "Filter"}</button>
      </form>

      {products.length === 0 ? (
        <p className="mt-10 text-brand-ink/60">{locale === "bn" ? "কোনো পণ্য পাওয়া যায়নি।" : "No products found."}</p>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((p) => (
            <a key={p.slug} href={`/product/${p.slug}`} className="group block overflow-hidden rounded-xl border border-brand-pinkLight bg-white hover:shadow-lg">
              <ProductImage src={p.images[0]?.url} alt={locale === "bn" ? p.nameBn : p.nameEn} className="aspect-[4/5] w-full object-cover transition group-hover:scale-105" />
              <div className="p-3">
                <p className="line-clamp-2 text-sm font-medium">{locale === "bn" ? p.nameBn : p.nameEn}</p>
                <p className="mt-1 font-semibold text-brand-pink">৳{Number(p.discountPrice ?? p.retailPrice)}</p>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
