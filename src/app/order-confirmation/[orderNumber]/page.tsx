import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

// Order confirmation page — requirement #9, #10
export default async function OrderConfirmationPage({
  params,
  searchParams,
}: {
  params: { orderNumber: string };
  searchParams?: { lang?: string };
}) {
  const locale = searchParams?.lang === "en" ? "en" : "bn";
  const order = await prisma.order.findUnique({
    where: { orderNumber: params.orderNumber },
    include: { items: { include: { product: true } } },
  });
  if (!order) notFound();

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 text-center">
      <CheckCircle2 className="mx-auto text-brand-pink" size={48} />
      <h1 className="mt-4 font-display text-2xl font-semibold">
        {locale === "bn" ? "আপনার অর্ডার সফল হয়েছে!" : "Your order is confirmed!"}
      </h1>
      <p className="mt-2 text-brand-ink/60">
        {locale === "bn" ? "অর্ডার নম্বর" : "Order number"}: <span className="font-semibold text-brand-ink">{order.orderNumber}</span>
      </p>

      <div className="mt-8 rounded-xl border border-brand-pinkLight bg-white p-6 text-left">
        <h2 className="font-semibold">{locale === "bn" ? "ডেলিভারি ঠিকানা" : "Delivery Address"}</h2>
        <p className="mt-1 text-sm text-brand-ink/70">
          {order.guestName} · {order.deliveryPhone}<br />
          {order.deliveryAddress}, {order.deliveryArea}, {order.deliveryDistrict}
        </p>

        <div className="mt-4 divide-y divide-brand-pinkLight border-t border-brand-pinkLight pt-4">
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between py-2 text-sm">
              <span>{item.product.nameEn} × {item.quantity}</span>
              <span>৳{Number(item.unitPrice) * item.quantity}</span>
            </div>
          ))}
        </div>

        <div className="mt-4 space-y-1 border-t border-brand-pinkLight pt-4 text-sm">
          <div className="flex justify-between"><span>{locale === "bn" ? "সাবটোটাল" : "Subtotal"}</span><span>৳{Number(order.subtotal)}</span></div>
          <div className="flex justify-between"><span>{locale === "bn" ? "ডেলিভারি চার্জ" : "Delivery"}</span><span>৳{Number(order.deliveryCharge)}</span></div>
          <div className="flex justify-between font-bold text-brand-pink"><span>{locale === "bn" ? "মোট" : "Total"}</span><span>৳{Number(order.totalAmount)}</span></div>
        </div>

        <p className="mt-4 text-xs text-brand-ink/50">
          {locale === "bn" ? "পেমেন্ট পদ্ধতি" : "Payment method"}: {order.paymentMethod} · {locale === "bn" ? "স্ট্যাটাস" : "Status"}: {order.status}
        </p>
      </div>

      <Link href="/" className="mt-6 inline-block rounded-full bg-brand-pink px-6 py-3 text-sm font-semibold text-white">
        {locale === "bn" ? "কেনাকাটা চালিয়ে যান" : "Continue Shopping"}
      </Link>
    </div>
  );
}
