import ProductCard from "./ProductCard";

type Product = {
  id: string;
  slug: string;
  nameBn: string;
  nameEn: string;
  retailPrice: number;
  discountPrice?: number | null;
  wholesalePrice?: number | null;
  stockStatus: "IN_STOCK" | "LOW_STOCK" | "OUT_OF_STOCK";
  images: { url: string }[];
};

export default function ProductGrid({ title, products, locale = "bn" }: { title: string; products: Product[]; locale?: "bn" | "en" }) {
  if (!products.length) return null;
  return (
    <section className="mx-auto max-w-7xl px-4 py-10">
      <h2 className="mb-5 font-display text-xl font-semibold text-brand-ink sm:text-2xl">{title}</h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {products.map((p) => (
          <ProductCard
            key={p.slug}
            productId={p.id}
            slug={p.slug}
            name={locale === "bn" ? p.nameBn : p.nameEn}
            image={p.images[0]?.url ?? "/placeholder.png"}
            retailPrice={Number(p.retailPrice)}
            discountPrice={p.discountPrice ? Number(p.discountPrice) : null}
            wholesalePrice={p.wholesalePrice ? Number(p.wholesalePrice) : null}
            stockStatus={p.stockStatus}
            locale={locale}
          />
        ))}
      </div>
    </section>
  );
}
