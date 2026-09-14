import { prisma } from "@/lib/prisma";
import CategoryForm from "@/components/admin/CategoryForm";

export default async function NewCategoryPage({ searchParams }: { searchParams?: { lang?: string } }) {
  const locale = searchParams?.lang === "en" ? "en" : "bn";
  const parentOptions = await prisma.category.findMany({ where: { isActive: true }, orderBy: { nameEn: "asc" } });

  return (
    <div>
      <h1 className="font-display text-xl font-semibold">{locale === "bn" ? "নতুন ক্যাটেগরি" : "New Category"}</h1>
      <div className="mt-4">
        <CategoryForm parentOptions={parentOptions} />
      </div>
    </div>
  );
}
