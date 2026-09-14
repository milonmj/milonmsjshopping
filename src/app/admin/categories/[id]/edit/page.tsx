import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import CategoryForm from "@/components/admin/CategoryForm";

export default async function EditCategoryPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams?: { lang?: string };
}) {
  const locale = searchParams?.lang === "en" ? "en" : "bn";
  const [category, parentOptions] = await Promise.all([
    prisma.category.findUnique({ where: { id: params.id } }),
    prisma.category.findMany({ orderBy: { nameEn: "asc" } }),
  ]);
  if (!category) notFound();

  return (
    <div>
      <h1 className="font-display text-xl font-semibold">{locale === "bn" ? "ক্যাটেগরি সম্পাদনা" : "Edit Category"}</h1>
      <div className="mt-4">
        <CategoryForm
          parentOptions={parentOptions}
          initial={{ id: category.id, nameBn: category.nameBn, nameEn: category.nameEn, slug: category.slug, parentId: category.parentId, isActive: category.isActive }}
        />
      </div>
    </div>
  );
}
