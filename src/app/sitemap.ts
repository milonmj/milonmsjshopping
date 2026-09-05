import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { SITE_URL } from "@/lib/site-config";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let categories: { slug: string }[] = [];
  let products: { slug: string; updatedAt: Date }[] = [];

  try {
    [categories, products] = await Promise.all([
      prisma.category.findMany({ where: { isActive: true }, select: { slug: true } }),
      prisma.product.findMany({ where: { isActive: true }, select: { slug: true, updatedAt: true } }),
    ]);
  } catch (err) {
    console.error("Failed to load categories/products for sitemap:", err);
  }

  return [
    { url: SITE_URL, changeFrequency: "daily", priority: 1 },
    ...categories.map((c) => ({
      url: `${SITE_URL}/category/${c.slug}`,
      changeFrequency: "daily" as const,
      priority: 0.8,
    })),
    ...products.map((p) => ({
      url: `${SITE_URL}/product/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];
}
