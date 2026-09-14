import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Plus } from "lucide-react";
import CategoryActiveToggle from "@/components/admin/CategoryActiveToggle";

export default async function AdminCategoriesPage({ searchParams }: { searchParams?: { lang?: string } }) {
  const locale = searchParams?.lang === "en" ? "en" : "bn";

  const categories = await prisma.category.findMany({
    include: { parent: true, _count: { select: { products: true } } },
    orderBy: { nameEn: "asc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-xl font-semibold">{locale === "bn" ? "ক্যাটেগরি ব্যবস্থাপনা" : "Categories"}</h1>
        <Link href="/admin/categories/new" className="flex items-center gap-1.5 rounded-full bg-brand-pink px-4 py-2 text-sm font-semibold text-white">
          <Plus size={16} /> {locale === "bn" ? "নতুন ক্যাটেগরি" : "New Category"}
        </Link>
      </div>

      <div className="mt-4 overflow-x-auto rounded-xl border border-brand-pinkLight bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-brand-pinkLight text-left text-xs text-brand-ink/50">
              <th className="p-3 font-medium">{locale === "bn" ? "নাম" : "Name"}</th>
              <th className="p-3 font-medium">Slug</th>
              <th className="p-3 font-medium">{locale === "bn" ? "প্যারেন্ট" : "Parent"}</th>
              <th className="p-3 font-medium">{locale === "bn" ? "পণ্য" : "Products"}</th>
              <th className="p-3 font-medium">{locale === "bn" ? "স্ট্যাটাস" : "Status"}</th>
              <th className="p-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {categories.map((c) => (
              <tr key={c.id} className="border-b border-brand-pinkLight/60 last:border-0 hover:bg-brand-pinkLight/10">
                <td className="p-3 font-medium">{locale === "bn" ? c.nameBn : c.nameEn}</td>
                <td className="p-3 text-brand-ink/60">{c.slug}</td>
                <td className="p-3 text-brand-ink/60">{c.parent ? (locale === "bn" ? c.parent.nameBn : c.parent.nameEn) : "—"}</td>
                <td className="p-3">{c._count.products}</td>
                <td className="p-3">
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${c.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                    {c.isActive ? (locale === "bn" ? "সক্রিয়" : "Active") : (locale === "bn" ? "নিষ্ক্রিয়" : "Inactive")}
                  </span>
                </td>
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <Link href={`/admin/categories/${c.id}/edit`} className="text-xs font-semibold text-brand-pink">
                      {locale === "bn" ? "সম্পাদনা" : "Edit"}
                    </Link>
                    <CategoryActiveToggle categoryId={c.id} isActive={c.isActive} />
                  </div>
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr><td colSpan={6} className="p-6 text-center text-brand-ink/50">{locale === "bn" ? "কোনো ক্যাটেগরি নেই।" : "No categories yet."}</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
