import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { DollarSign, ShoppingBag, Package, Users } from "lucide-react";

const STATUS_LABELS: Record<string, { bn: string; en: string }> = {
  PENDING: { bn: "পেন্ডিং", en: "Pending" },
  CONFIRMED: { bn: "নিশ্চিত হয়েছে", en: "Confirmed" },
  PROCESSING: { bn: "প্রসেসিং", en: "Processing" },
  SHIPPED: { bn: "পাঠানো হয়েছে", en: "Shipped" },
  DELIVERED: { bn: "ডেলিভারি হয়েছে", en: "Delivered" },
  CANCELLED: { bn: "বাতিল হয়েছে", en: "Cancelled" },
};

// Dashboard overview — requirement #2. Revenue is summed across all orders except CANCELLED
// (a reasonable default; swap for PAID-only if you'd rather count confirmed payments instead
// of placed orders once online payment methods go live).
export default async function AdminDashboardPage({ searchParams }: { searchParams?: { lang?: string } }) {
  const locale = searchParams?.lang === "en" ? "en" : "bn";

  const [revenueAgg, totalOrders, activeProducts, totalCustomers, recentOrders] = await Promise.all([
    prisma.order.aggregate({ _sum: { totalAmount: true }, where: { status: { not: "CANCELLED" } } }),
    prisma.order.count(),
    prisma.product.count({ where: { isActive: true } }),
    prisma.user.count({ where: { role: "CUSTOMER" } }),
    prisma.order.findMany({ orderBy: { createdAt: "desc" }, take: 8, include: { items: true } }),
  ]);

  const cards = [
    { label: locale === "bn" ? "মোট আয়" : "Total Revenue", value: `৳${Number(revenueAgg._sum.totalAmount ?? 0).toLocaleString()}`, icon: DollarSign },
    { label: locale === "bn" ? "মোট অর্ডার" : "Total Orders", value: totalOrders.toLocaleString(), icon: ShoppingBag },
    { label: locale === "bn" ? "সক্রিয় পণ্য" : "Active Products", value: activeProducts.toLocaleString(), icon: Package },
    { label: locale === "bn" ? "মোট কাস্টমার" : "Total Customers", value: totalCustomers.toLocaleString(), icon: Users },
  ];

  return (
    <div>
      <h1 className="font-display text-xl font-semibold">{locale === "bn" ? "ড্যাশবোর্ড" : "Dashboard"}</h1>

      <div className="mt-4 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map(({ label, value, icon: Icon }) => (
          <div key={label} className="rounded-xl border border-brand-pinkLight bg-white p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-brand-ink/50">{label}</span>
              <Icon size={16} className="text-brand-pink" />
            </div>
            <p className="mt-2 text-xl font-bold">{value}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-xl border border-brand-pinkLight bg-white">
        <div className="flex items-center justify-between border-b border-brand-pinkLight p-4">
          <h2 className="font-display text-sm font-semibold">{locale === "bn" ? "সাম্প্রতিক অর্ডার" : "Recent Orders"}</h2>
          <Link href="/admin/orders" className="text-xs font-semibold text-brand-pink">
            {locale === "bn" ? "সব দেখুন" : "View all"}
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-brand-pinkLight text-left text-xs text-brand-ink/50">
                <th className="p-3 font-medium">{locale === "bn" ? "অর্ডার" : "Order"}</th>
                <th className="p-3 font-medium">{locale === "bn" ? "কাস্টমার" : "Customer"}</th>
                <th className="p-3 font-medium">{locale === "bn" ? "স্ট্যাটাস" : "Status"}</th>
                <th className="p-3 font-medium">{locale === "bn" ? "মোট" : "Total"}</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => {
                const status = STATUS_LABELS[order.status] ?? { bn: order.status, en: order.status };
                return (
                  <tr key={order.id} className="border-b border-brand-pinkLight/60 last:border-0 hover:bg-brand-pinkLight/10">
                    <td className="p-3">
                      <Link href={`/admin/orders/${order.orderNumber}`} className="font-medium text-brand-pink">
                        {order.orderNumber}
                      </Link>
                    </td>
                    <td className="p-3">{order.guestName}</td>
                    <td className="p-3">
                      <span className="rounded-full bg-brand-pinkLight px-2.5 py-0.5 text-xs font-medium text-brand-pinkDark">
                        {locale === "bn" ? status.bn : status.en}
                      </span>
                    </td>
                    <td className="p-3 font-medium">৳{Number(order.totalAmount).toLocaleString()}</td>
                  </tr>
                );
              })}
              {recentOrders.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-6 text-center text-brand-ink/50">
                    {locale === "bn" ? "এখনো কোনো অর্ডার নেই।" : "No orders yet."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
