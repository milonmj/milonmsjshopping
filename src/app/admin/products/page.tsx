import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Plus } from "lucide-react";
import ProductActiveToggle from "@/components/admin/ProductActiveToggle";
import ProductImage from "@/components/ProductImage";

// Product management — requirement #3. Search + category + status filters via query string
// (matches the storefront's existing filter pattern); soft-delete toggles isActive in place.
export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams?: { lang?: string; q?: string; category?: string; status?: string };
}) {
  const locale = searchParams?.lang === "en" ? "en" : "bn";
  const q = searchParams?.q?.trim() ?? "";
  const categoryId = searchParams?.category ?? "";
  const status = searchParams?.status ?? "all"; // all | active | inactive

  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      where: {
        ...(q ? { OR: [{ nameEn: { contains: q, mode: "insensitive" } }, { nameBn: { contains: q } }, { sku: { contains: q, mode: "insensitive" } }] } : {}),
        ...(categoryId ? { categoryId } : {}),
        ...(status === "active" ? { isActive: true } : status === "inactive" ? { isActive: false } : {}),
      },
      include: { category: true, images: { take: 1 } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.category.findMany({ orderBy: { nameEn: "asc" } }),
  ]);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-xl font-semibold">{locale === "bn" ? "পণ্য ব্যবস্থাপনা" : "Products"}</h1>
        <Link href="/admin/products/new" className="flex items-center gap-1.5 rounded-full bg-brand-pink px-4 py-2 text-sm font-semibold text-white">
          <Plus size={16} /> {locale === "bn" ? "নতুন পণ্য" : "New Product"}
        </Link>
      </div>

      <form className="mt-4 flex flex-wrap gap-2" method="get">
        <input type="hidden" name="lang" value={locale} />
        <input name="q" defaultValue={q} placeholder={locale === "bn" ? "নাম বা SKU খুঁজুন..." : "Search name or SKU..."} className="rounded-lg border border-brand-pinkLight px-3 py-2 text-sm" />
        <select name="category" defaultValue={categoryId} className="rounded-lg border border-brand-pinkLight px-3 py-2 text-sm">
          <option value="">{locale === "bn" ? "সব ক্যাটেগরি" : "All Categories"}</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{locale === "bn" ? c.nameBn : c.nameEn}</option>
          ))}
        </select>
        <select name="status" defaultValue={status} className="rounded-lg border border-brand-pinkLight px-3 py-2 text-sm">
          <option value="all">{locale === "bn" ? "সব স্ট্যাটাস" : "All Status"}</option>
          <option value="active">{locale === "bn" ? "সক্রিয়" : "Active"}</option>
          <option value="inactive">{locale === "bn" ? "নিষ্ক্রিয়" : "Inactive"}</option>
        </select>
        <button className="rounded-lg bg-brand-ink px-4 py-2 text-sm font-medium text-white">{locale === "bn" ? "ফিল্টার" : "Filter"}</button>
      </form>

      <div className="mt-4 overflow-x-auto rounded-xl border border-brand-pinkLight bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-brand-pinkLight text-left text-xs text-brand-ink/50">
              <th className="p-3 font-medium">{locale === "bn" ? "পণ্য" : "Product"}</th>
              <th className="p-3 font-medium">SKU</th>
              <th className="p-3 font-medium">{locale === "bn" ? "ক্যাটেগরি" : "Category"}</th>
              <th className="p-3 font-medium">{locale === "bn" ? "মূল্য" : "Price"}</th>
              <th className="p-3 font-medium">{locale === "bn" ? "স্টক" : "Stock"}</th>
              <th className="p-3 font-medium">{locale === "bn" ? "স্ট্যাটাস" : "Status"}</th>
              <th className="p-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b border-brand-pinkLight/60 last:border-0 hover:bg-brand-pinkLight/10">
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    {p.images[0] && <ProductImage src={p.images[0].url} alt="" className="h-8 w-8 rounded object-cover" />}
                    <span className="font-medium">{locale === "bn" ? p.nameBn : p.nameEn}</span>
                  </div>
                </td>
                <td className="p-3 text-brand-ink/60">{p.sku}</td>
                <td className="p-3 text-brand-ink/60">{locale === "bn" ? p.category.nameBn : p.category.nameEn}</td>
                <td className="p-3">৳{Number(p.discountPrice ?? p.retailPrice)}</td>
                <td className="p-3">{p.quantity}</td>
                <td className="p-3">
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${p.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                    {p.isActive ? (locale === "bn" ? "সক্রিয়" : "Active") : (locale === "bn" ? "নিষ্ক্রিয়" : "Inactive")}
                  </span>
                </td>
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <Link href={`/admin/products/${p.id}/edit`} className="text-xs font-semibold text-brand-pink">
                      {locale === "bn" ? "সম্পাদনা" : "Edit"}
                    </Link>
                    <ProductActiveToggle productId={p.id} isActive={p.isActive} />
                  </div>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr><td colSpan={7} className="p-6 text-center text-brand-ink/50">{locale === "bn" ? "কোনো পণ্য পাওয়া যায়নি।" : "No products found."}</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
