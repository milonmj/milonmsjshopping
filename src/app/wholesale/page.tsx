import Link from "next/link";
import { prisma } from "@/lib/prisma";
import ProductImage from "@/components/ProductImage";

// Wholesale pricing info page — linked from the homepage "পাইকারি মূল্য দেখুন" button
export default async function WholesalePage({
  searchParams,
}: {
  searchParams?: { lang?: string };
}) {
  const locale = searchParams?.lang === "en" ? "en" : "bn";

  const products = await prisma.product.findMany({
    where: {
      isActive: true,
      wholesalePrice: { not: null },
      minWholesaleQty: { not: null },
    },
    orderBy: { createdAt: "desc" },
    include: { images: true },
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="font-display text-2xl font-bold">
        {locale === "bn" ? "পাইকারি মূল্য" : "Wholesale Pricing"}
      </h1>
      <p className="mt-2 text-brand-ink/70">
        {locale === "bn"
          ? "নির্দিষ্ট পরিমাণের বেশি কিনলে নিচের পণ্যগুলোতে পাইকারি (বিশেষ ছাড়ের) মূল্য পাবেন। পণ্য পেজে গিয়ে কোয়ান্টিটি বাড়ালেই স্বয়ংক্রিয়ভাবে পাইকারি মূল্য প্রয়োগ হবে।"
          : "Buy above the minimum quantity to get wholesale pricing on the products below. The discount applies automatically once you reach the minimum quantity on the product page."}
      </p>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {products.map((p) => (
          <Link
            key={p.id}
            href={`/product/${p.slug}`}
            className="rounded-xl border border-brand-pinkLight bg-white p-3 hover:shadow-md"
          >
            <div className="aspect-square overflow-hidden rounded-lg bg-brand-pinkLight/20">
              <ProductImage
                src={p.images[0]?.url ?? "/placeholder.png"}
                alt={locale === "bn" ? p.nameBn : p.nameEn}
                className="h-full w-full object-cover"
              />
            </div>
            <p className="mt-2 line-clamp-2 text-sm font-medium">
              {locale === "bn" ? p.nameBn : p.nameEn}
            </p>
            <p className="mt-1 text-sm text-brand-ink/50 line-through">
              ৳{Number(p.retailPrice)}
            </p>
            <p className="text-sm font-semibold text-brand-pink">
              ৳{Number(p.wholesalePrice)}
              <span className="ml-1 text-xs text-brand-ink/60">
                ({p.minWholesaleQty}+ {locale === "bn" ? "পিস" : "pcs"})
              </span>
            </p>
          </Link>
        ))}

        {products.length === 0 && (
          <p className="col-span-full py-10 text-center text-brand-ink/50">
            {locale === "bn"
              ? "এই মুহূর্তে কোনো পাইকারি মূল্যের পণ্য নেই।"
              : "No wholesale-priced products right now."}
          </p>
        )}
      </div>
    </div>
  );
            }
