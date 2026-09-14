import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ChevronLeft } from "lucide-react";

const STATUS_LABELS: Record<string, { bn: string; en: string }> = {
  PENDING: { bn: "পেন্ডিং", en: "Pending" },
  CONFIRMED: { bn: "নিশ্চিত হয়েছে", en: "Confirmed" },
  PROCESSING: { bn: "প্রসেসিং", en: "Processing" },
  SHIPPED: { bn: "পাঠানো হয়েছে", en: "Shipped" },
  DELIVERED: { bn: "ডেলিভারি হয়েছে", en: "Delivered" },
  CANCELLED: { bn: "বাতিল হয়েছে", en: "Cancelled" },
};

export default async function AdminCustomerDetailPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams?: { lang?: string };
}) {
  const locale = searchParams?.lang === "en" ? "en" : "bn";

  const customer = await prisma.user.findUnique({
    where: { id: params.id },
    include: { orders: { orderBy: { createdAt: "desc" }, include: { items: true } }, addresses: true },
  });
  if (!customer || customer.role !== "CUSTOMER") notFound();

  const totalSpent = customer.orders.filter((o) => o.status !== "CANCELLED").reduce((sum, o) => sum + Number(o.totalAmount), 0);

  return (
    <div>
      <Link href="/admin/customers" className="inline-flex items-center gap-1 text-sm text-brand-ink/60 hover:text-brand-pink">
        <ChevronLeft size={16} /> {locale === "bn" ? "সব কাস্টমার" : "All Customers"}
      </Link>

      <div className="mt-4 grid gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-brand-pinkLight bg-white p-6">
          <h1 className="font-display text-lg font-semibold">{customer.name}</h1>
          <p className="mt-1 text-sm text-brand-ink/60">{customer.phone}</p>
          {customer.email && <p className="text-sm text-brand-ink/60">{customer.email}</p>}
          <p className="mt-2 text-xs text-brand-ink/40">
            {locale === "bn" ? "যোগদান" : "Joined"}: {customer.createdAt.toLocaleDateString(locale === "bn" ? "bn-BD" : "en-US", { year: "numeric", month: "long", day: "numeric" })}
          </p>

          <div className="mt-4 grid grid-cols-2 gap-3 border-t border-brand-pinkLight pt-4 text-sm">
            <div><p className="text-xs text-brand-ink/50">{locale === "bn" ? "মোট অর্ডার" : "Total Orders"}</p><p className="font-bold">{customer.orders.length}</p></div>
            <div><p className="text-xs text-brand-ink/50">{locale === "bn" ? "মোট খরচ" : "Total Spent"}</p><p className="font-bold text-brand-pink">৳{totalSpent.toLocaleString()}</p></div>
          </div>

          {customer.addresses.length > 0 && (
            <div className="mt-4 border-t border-brand-pinkLight pt-4">
              <p className="text-xs font-medium text-brand-ink/50">{locale === "bn" ? "সংরক্ষিত ঠিকানা" : "Saved Addresses"}</p>
              {customer.addresses.map((a) => (
                <p key={a.id} className="mt-1 text-sm text-brand-ink/70">{a.label}: {a.addressLine}, {a.area}, {a.district}</p>
              ))}
            </div>
          )}
        </div>

        <div className="lg:col-span-2 rounded-xl border border-brand-pinkLight bg-white">
          <div className="border-b border-brand-pinkLight p-4">
            <h2 className="font-display text-sm font-semibold">{locale === "bn" ? "অর্ডার হিস্টরি" : "Order History"}</h2>
          </div>
          <div className="divide-y divide-brand-pinkLight">
            {customer.orders.map((order) => {
              const s = STATUS_LABELS[order.status] ?? { bn: order.status, en: order.status };
              const itemCount = order.items.reduce((sum, i) => sum + i.quantity, 0);
              return (
                <Link key={order.id} href={`/admin/orders/${order.orderNumber}`} className="flex items-center justify-between p-4 text-sm hover:bg-brand-pinkLight/10">
                  <div>
                    <p className="font-medium text-brand-pink">{order.orderNumber}</p>
                    <p className="text-xs text-brand-ink/50">
                      {order.createdAt.toLocaleDateString(locale === "bn" ? "bn-BD" : "en-US", { year: "numeric", month: "short", day: "numeric" })} · {itemCount} {locale === "bn" ? "টি পণ্য" : "item(s)"}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="rounded-full bg-brand-pinkLight px-2.5 py-0.5 text-xs font-medium text-brand-pinkDark">
                      {locale === "bn" ? s.bn : s.en}
                    </span>
                    <span className="font-medium">৳{Number(order.totalAmount)}</span>
                  </div>
                </Link>
              );
            })}
            {customer.orders.length === 0 && (
              <p className="p-6 text-center text-sm text-brand-ink/50">{locale === "bn" ? "কোনো অর্ডার নেই।" : "No orders yet."}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
