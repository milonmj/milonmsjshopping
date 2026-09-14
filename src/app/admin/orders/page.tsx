import Link from "next/link";
import { prisma } from "@/lib/prisma";

const STATUSES = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"] as const;
const STATUS_LABELS: Record<string, { bn: string; en: string }> = {
  PENDING: { bn: "পেন্ডিং", en: "Pending" },
  CONFIRMED: { bn: "নিশ্চিত হয়েছে", en: "Confirmed" },
  PROCESSING: { bn: "প্রসেসিং", en: "Processing" },
  SHIPPED: { bn: "পাঠানো হয়েছে", en: "Shipped" },
  DELIVERED: { bn: "ডেলিভারি হয়েছে", en: "Delivered" },
  CANCELLED: { bn: "বাতিল হয়েছে", en: "Cancelled" },
};

// Order management — requirement #4: master list with status filtering
export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams?: { lang?: string; status?: string };
}) {
  const locale = searchParams?.lang === "en" ? "en" : "bn";
  const status = searchParams?.status ?? "all";

  const orders = await prisma.order.findMany({
    where: status !== "all" ? { status: status as any } : {},
    orderBy: { createdAt: "desc" },
    include: { items: true },
  });

  return (
    <div>
      <h1 className="font-display text-xl font-semibold">{locale === "bn" ? "অর্ডার ব্যবস্থাপনা" : "Orders"}</h1>

      <form className="mt-4 flex flex-wrap gap-2" method="get">
        <input type="hidden" name="lang" value={locale} />
        <select name="status" defaultValue={status} className="rounded-lg border border-brand-pinkLight px-3 py-2 text-sm">
          <option value="all">{locale === "bn" ? "সব স্ট্যাটাস" : "All Status"}</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>{locale === "bn" ? STATUS_LABELS[s].bn : STATUS_LABELS[s].en}</option>
          ))}
        </select>
        <button className="rounded-lg bg-brand-ink px-4 py-2 text-sm font-medium text-white">{locale === "bn" ? "ফিল্টার" : "Filter"}</button>
      </form>

      <div className="mt-4 overflow-x-auto rounded-xl border border-brand-pinkLight bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-brand-pinkLight text-left text-xs text-brand-ink/50">
              <th className="p-3 font-medium">{locale === "bn" ? "অর্ডার" : "Order"}</th>
              <th className="p-3 font-medium">{locale === "bn" ? "কাস্টমার" : "Customer"}</th>
              <th className="p-3 font-medium">{locale === "bn" ? "তারিখ" : "Date"}</th>
              <th className="p-3 font-medium">{locale === "bn" ? "পণ্য" : "Items"}</th>
              <th className="p-3 font-medium">{locale === "bn" ? "স্ট্যাটাস" : "Status"}</th>
              <th className="p-3 font-medium">{locale === "bn" ? "মোট" : "Total"}</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => {
              const s = STATUS_LABELS[order.status] ?? { bn: order.status, en: order.status };
              const itemCount = order.items.reduce((sum, i) => sum + i.quantity, 0);
              return (
                <tr key={order.id} className="border-b border-brand-pinkLight/60 last:border-0 hover:bg-brand-pinkLight/10">
                  <td className="p-3">
                    <Link href={`/admin/orders/${order.orderNumber}`} className="font-medium text-brand-pink">{order.orderNumber}</Link>
                  </td>
                  <td className="p-3">{order.guestName} · {order.guestPhone ?? order.deliveryPhone}</td>
                  <td className="p-3 text-brand-ink/60">
                    {order.createdAt.toLocaleDateString(locale === "bn" ? "bn-BD" : "en-US", { year: "numeric", month: "short", day: "numeric" })}
                  </td>
                  <td className="p-3">{itemCount}</td>
                  <td className="p-3">
                    <span className="rounded-full bg-brand-pinkLight px-2.5 py-0.5 text-xs font-medium text-brand-pinkDark">
                      {locale === "bn" ? s.bn : s.en}
                    </span>
                  </td>
                  <td className="p-3 font-medium">৳{Number(order.totalAmount).toLocaleString()}</td>
                </tr>
              );
            })}
            {orders.length === 0 && (
              <tr><td colSpan={6} className="p-6 text-center text-brand-ink/50">{locale === "bn" ? "কোনো অর্ডার পাওয়া যায়নি।" : "No orders found."}</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
