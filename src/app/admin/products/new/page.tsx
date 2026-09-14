import { prisma } from "@/lib/prisma";
import ProductForm from "@/components/admin/ProductForm";

export default async function NewProductPage({ searchParams }: { searchParams?: { lang?: string } }) {
  const locale = searchParams?.lang === "en" ? "en" : "bn";
  const categories = await prisma.category.findMany({ where: { isActive: true }, orderBy: { nameEn: "asc" } });

  return (
    <div>
      <h1 className="font-display text-xl font-semibold">{locale === "bn" ? "নতুন পণ্য যোগ করুন" : "Add New Product"}</h1>
      <div className="mt-4">
        <ProductForm categories={categories} />
      </div>
    </div>
  );
}
