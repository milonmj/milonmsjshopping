import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ProductForm from "@/components/admin/ProductForm";

export default async function EditProductPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams?: { lang?: string };
}) {
  const locale = searchParams?.lang === "en" ? "en" : "bn";

  const [product, categories] = await Promise.all([
    prisma.product.findUnique({ where: { id: params.id }, include: { images: true, variants: true } }),
    prisma.category.findMany({ orderBy: { nameEn: "asc" } }), // include inactive categories so an already-assigned one still shows
  ]);
  if (!product) notFound();

  return (
    <div>
      <h1 className="font-display text-xl font-semibold">{locale === "bn" ? "পণ্য সম্পাদনা" : "Edit Product"}</h1>
      <div className="mt-4">
        <ProductForm
          categories={categories}
          initial={{
            id: product.id,
            nameBn: product.nameBn,
            nameEn: product.nameEn,
            slug: product.slug,
            descriptionBn: product.descriptionBn,
            descriptionEn: product.descriptionEn,
            sku: product.sku,
            brand: product.brand,
            categoryId: product.categoryId,
            retailPrice: Number(product.retailPrice),
            wholesalePrice: product.wholesalePrice ? Number(product.wholesalePrice) : null,
            minWholesaleQty: product.minWholesaleQty,
            discountPrice: product.discountPrice ? Number(product.discountPrice) : null,
            quantity: product.quantity,
            lowStockAlertAt: product.lowStockAlertAt,
            isFeatured: product.isFeatured,
            isActive: product.isActive,
            images: product.images.map((i) => ({ url: i.url })),
            variants: product.variants.map((v) => ({
              size: v.size,
              color: v.color,
              sku: v.sku,
              quantity: v.quantity,
              priceDelta: Number(v.priceDelta),
            })),
          }}
        />
      </div>
    </div>
  );
}
