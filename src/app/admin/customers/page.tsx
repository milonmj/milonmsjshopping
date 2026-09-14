import Link from "next/link";
import { prisma } from "@/lib/prisma";

// Customer overview — requirement #5: list registered customers with purchase histories and
// contact details. "Registered customers" = accounts with role CUSTOMER; guest checkouts have
// no User row and so aren't listed here (they're visible in Orders as guest orders instead).
export default async function AdminCustomersPage({ searchParams }: { searchParams?: { lang?: string; q?: string } }) {
  const locale = searchParams?.lang === "en" ? "en" : "bn";
  const q = searchParams?.q?.trim() ?? "";

  const customers = await prisma.user.findMany({
    where: {
      role: "CUSTOMER",
      ...(q ? { OR: [{ name: { contains: q, mode: "insensitive" } }, { phone: { contains: q } }, { email: { contains: q, mode: "insensitive" } }] } : {}),
    },
    include: { orders: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="font-display text-xl font-semibold">{locale === "bn" ? "কাস্টমার" : "Customers"}</h1>

      <form className="mt-4 flex gap-2" method="get">
        <input type="hidden" name="lang" value={locale} />
        <input name="q" defaultValue={q} placeholder={locale === "bn" ? "নাম, ফোন বা ইমেইল খুঁজুন..." : "Search name, phone, or email..."} className="rounded-lg border border-brand-pinkLight px-3 py-2 text-sm" />
        <button className="rounded-lg bg-brand-ink px-4 py-2 text-sm font-medium text-white">{locale === "bn" ? "খুঁজুন" : "Search"}</button>
      </form>

      <div className="mt-4 overflow-x-auto rounded-xl border border-brand-pinkLight bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-brand-pinkLight text-left text-xs text-brand-ink/50">
              <th className="p-3 font-medium">{locale === "bn" ? "নাম" : "Name"}</th>
              <th className="p-3 font-medium">{locale === "bn" ? "ফোন" : "Phone"}</th>
              <th className="p-3 font-medium">{locale === "bn" ? "ইমেইল" : "Email"}</th>
              <th className="p-3 font-medium">{locale === "bn" ? "অর্ডার" : "Orders"}</th>
              <th className="p-3 font-medium">{locale === "bn" ? "মোট খরচ" : "Total Spent"}</th>
              <th className="p-3 font-medium">{locale === "bn" ? "যোগদান" : "Joined"}</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => {
              const totalSpent = c.orders.filter((o) => o.status !== "CANCELLED").reduce((sum, o) => sum + Number(o.totalAmount), 0);
              return (
                <tr key={c.id} className="border-b border-brand-pinkLight/60 last:border-0 hover:bg-brand-pinkLight/10">
                  <td className="p-3">
                    <Link href={`/admin/customers/${c.id}`} className="font-medium text-brand-pink">{c.name}</Link>
                  </td>
                  <td className="p-3 text-brand-ink/60">{c.phone}</td>
                  <td className="p-3 text-brand-ink/60">{c.email ?? "—"}</td>
                  <td className="p-3">{c.orders.length}</td>
                  <td className="p-3 font-medium">৳{totalSpent.toLocaleString()}</td>
                  <td className="p-3 text-brand-ink/60">
                    {c.createdAt.toLocaleDateString(locale === "bn" ? "bn-BD" : "en-US", { year: "numeric", month: "short", day: "numeric" })}
                  </td>
                </tr>
              );
            })}
            {customers.length === 0 && (
              <tr><td colSpan={6} className="p-6 text-center text-brand-ink/50">{locale === "bn" ? "কোনো কাস্টমার পাওয়া যায়নি।" : "No customers found."}</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
