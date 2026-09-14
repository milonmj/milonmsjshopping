import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ChevronLeft } from "lucide-react";
import OrderFulfillmentForm from "@/components/admin/OrderFulfillmentForm";

// Order detail — requirement #4: update status and tracking details. Unlike the customer-facing
// /account/orders/[orderNumber] page, this is NOT scoped to a userId — an admin can view (and
// must be able to manage) every order, including guest checkouts with no account at all.
export default async function AdminOrderDetailPage({
  params,
  searchParams,
}: {
  params: { orderNumber: string };
  searchParams?: { lang?: string };
}) {
  const locale = searchParams?.lang === "en" ? "en" : "bn";

  const order = await prisma.order.findUnique({
    where: { orderNumber: params.orderNumber },
    include: { items: { include: { product: true } }, user: true },
  });
  if (!order) notFound();

  return (
    <div>
      <Link href="/admin/orders" className="inline-flex items-center gap-1 text-sm text-brand-ink/60 hover:text-brand-pink">
        <ChevronLeft size={16} /> {locale === "bn" ? "সব অর্ডার" : "All Orders"}
      </Link>

      <div className="mt-4 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-xl border border-brand-pinkLight bg-white p-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h1 className="font-display text-lg font-semibold">{order.orderNumber}</h1>
              <p className="text-xs text-brand-ink/50">
                {order.createdAt.toLocaleDateString(locale === "bn" ? "bn-BD" : "en-US", { year: "numeric", month: "long", day: "numeric" })}
              </p>
            </div>
            {order.user ? (
              <Link href={`/admin/customers/${order.user.id}`} className="text-xs font-semibold text-brand-pink">
                {locale === "bn" ? "কাস্টমার প্রোফাইল দেখুন" : "View customer profile"}
              </Link>
            ) : (
              <span className="text-xs text-brand-ink/40">{locale === "bn" ? "গেস্ট অর্ডার" : "Guest order"}</span>
            )}
          </div>

          <h2 className="mt-6 text-sm font-semibold">{locale === "bn" ? "ডেলিভারি ঠিকানা" : "Delivery Address"}</h2>
          <p className="mt-1 text-sm text-brand-ink/70">
            {order.guestName} · {order.deliveryPhone}
            <br />
            {order.deliveryAddress}, {order.deliveryArea}, {order.deliveryDistrict}
          </p>

          <div className="mt-4 divide-y divide-brand-pinkLight border-t border-brand-pinkLight pt-4">
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between py-2 text-sm">
                <span>
                  {locale === "bn" ? item.product.nameBn : item.product.nameEn} × {item.quantity}
                  {item.variantInfo && <span className="text-brand-ink/50"> ({item.variantInfo})</span>}
                </span>
                <span>৳{Number(item.unitPrice) * item.quantity}</span>
              </div>
            ))}
          </div>

          <div className="mt-4 space-y-1 border-t border-brand-pinkLight pt-4 text-sm">
            <div className="flex justify-between"><span>{locale === "bn" ? "সাবটোটাল" : "Subtotal"}</span><span>৳{Number(order.subtotal)}</span></div>
            <div className="flex justify-between"><span>{locale === "bn" ? "ডেলিভারি চার্জ" : "Delivery"}</span><span>৳{Number(order.deliveryCharge)}</span></div>
            {Number(order.discountAmount) > 0 && (
              <div className="flex justify-between"><span>{locale === "bn" ? "ছাড়" : "Discount"}</span><span>-৳{Number(order.discountAmount)}</span></div>
            )}
            <div className="flex justify-between font-bold text-brand-pink"><span>{locale === "bn" ? "মোট" : "Total"}</span><span>৳{Number(order.totalAmount)}</span></div>
          </div>

          <p className="mt-4 text-xs text-brand-ink/50">
            {locale === "bn" ? "পেমেন্ট পদ্ধতি" : "Payment method"}: {order.paymentMethod}
          </p>
        </div>

        <OrderFulfillmentForm
          orderNumber={order.orderNumber}
          initialStatus={order.status}
          initialCourier={order.courier ?? ""}
          initialTracking={order.trackingNumber ?? ""}
          initialPaymentStatus={order.paymentStatus}
        />
      </div>
    </div>
  );
}
