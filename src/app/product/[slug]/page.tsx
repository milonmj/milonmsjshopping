import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ProductActions from "@/components/ProductActions";
import ProductImage from "@/components/ProductImage";
import ShareButtons from "@/components/ShareButtons";
import { SITE_NAME, SITE_URL } from "@/lib/site-config";

type Props = { params: { slug: string }; searchParams?: { lang?: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await prisma.product.findUnique({ where: { slug: params.slug }, include: { images: true } });
  if (!product) return {};

  const title = product.metaTitle || `${product.nameEn} — ${SITE_NAME}`;
  const description = product.metaDescription || product.descriptionEn.slice(0, 155);
  const url = `${SITE_URL}/product/${product.slug}`;
  const imageUrl = product.images[0]?.url;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      type: "website",
      locale: "en_US",
      ...(imageUrl ? { images: [{ url: imageUrl, alt: product.nameEn }] } : {}),
    },
    twitter: {
      card: imageUrl ? "summary_large_image" : "summary",
      title,
      description,
      ...(imageUrl ? { images: [imageUrl] } : {}),
    },
    other: {
      "product:price:amount": String(Number(product.discountPrice ?? product.retailPrice)),
      "product:price:currency": "BDT",
    },
  };
}

export default async function ProductPage({ params, searchParams }: Props) {
  const locale = searchParams?.lang === "en" ? "en" : "bn";

  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
    include: { images: true, variants: true, category: true, reviews: true },
  });
  if (!product) notFound();

  const outOfStock = product.stockStatus === "OUT_OF_STOCK";
  const avgRating = product.reviews.length
    ? (product.reviews.reduce((s, r) => s + r.rating, 0) / product.reviews.length).toFixed(1)
    : null;
  const productUrl = `${SITE_URL}/product/${product.slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.nameEn,
    sku: product.sku,
    url: productUrl,
    image: product.images.map((i) => i.url),
    description: product.descriptionEn,
    brand: { "@type": "Brand", name: product.brand || SITE_NAME },
    category: product.category.nameEn,
    offers: {
      "@type": "Offer",
      url: productUrl,
      price: Number(product.discountPrice ?? product.retailPrice),
      priceCurrency: "BDT",
      availability: outOfStock ? "https://schema.org/OutOfStock" : "https://schema.org/InStock",
    },
    ...(avgRating
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: avgRating,
            reviewCount: product.reviews.length,
          },
        }
      : {}),
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <div className="aspect-[4/5] overflow-hidden rounded-xl bg-brand-pinkLight/30">
            <ProductImage src={product.images[0]?.url} alt={product.nameEn} className="h-full w-full object-cover" />
          </div>
          {product.images.length > 1 && (
            <div className="mt-3 flex gap-2">
              {product.images.map((img) => (
                <ProductImage key={img.id} src={img.url} alt="" className="h-16 w-16 rounded-lg object-cover" />
              ))}
            </div>
          )}
        </div>

        <div>
          <p className="text-xs uppercase tracking-wide text-brand-pink">{locale === "bn" ? product.category.nameBn : product.category.nameEn}</p>
          <h1 className="mt-1 font-display text-2xl font-semibold">{locale === "bn" ? product.nameBn : product.nameEn}</h1>
          {avgRating && <p className="mt-1 text-sm text-brand-ink/60">★ {avgRating} ({product.reviews.length} {locale === "bn" ? "রিভিউ" : "reviews"})</p>}

          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-2xl font-bold text-brand-pink">৳{Number(product.discountPrice ?? product.retailPrice)}</span>
            {product.discountPrice && <span className="text-brand-ink/40 line-through">৳{Number(product.retailPrice)}</span>}
          </div>

          {product.wholesalePrice && (
            <p className="mt-1 text-sm text-brand-ink/60">
              {locale === "bn" ? "পাইকারি মূল্য" : "Wholesale price"}: ৳{Number(product.wholesalePrice)}
              {product.minWholesaleQty ? ` (min ${product.minWholesaleQty} pcs)` : ""}
            </p>
          )}

          <p className="mt-4 text-sm leading-relaxed text-brand-ink/80">
            {locale === "bn" ? product.descriptionBn : product.descriptionEn}
          </p>

          {product.variants.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {product.variants.map((v) => (
                <span key={v.id} className="rounded-full border border-brand-pinkLight px-3 py-1 text-xs">
                  {[v.size, v.color].filter(Boolean).join(" / ")}
                </span>
              ))}
            </div>
          )}

          <ProductActions
            productId={product.id}
            slug={product.slug}
            name={locale === "bn" ? product.nameBn : product.nameEn}
            image={product.images[0]?.url ?? ""}
            unitPrice={Number(product.discountPrice ?? product.retailPrice)}
            maxQuantity={product.quantity}
            outOfStock={outOfStock}
            locale={locale}
          />
          <p className="mt-2 text-xs text-brand-ink/50">SKU: {product.sku}</p>

          <div className="mt-4 border-t border-brand-pinkLight pt-4">
            <ShareButtons
              productName={locale === "bn" ? product.nameBn : product.nameEn}
              price={Number(product.discountPrice ?? product.retailPrice)}
              locale={locale}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
