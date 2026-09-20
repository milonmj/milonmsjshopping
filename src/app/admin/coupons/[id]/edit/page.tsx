import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import EditCouponForm from "./EditCouponForm";

export default async function EditCouponPage({
  params,
}: {
  params: { id: string };
}) {
  const coupon = await prisma.coupon.findUnique({
    where: { id: params.id },
  });

  if (!coupon) notFound();

  return (
    <div className="p-6 max-w-lg">
      <h1 className="text-2xl font-bold mb-6">কুপন এডিট করুন</h1>
      <EditCouponForm
        couponId={coupon.id}
        initial={{
          code: coupon.code,
          percentOff: coupon.percentOff?.toString() ?? "",
          amountOff: coupon.amountOff?.toString() ?? "",
          minOrderAmt: coupon.minOrderAmt?.toString() ?? "",
          validFrom: coupon.validFrom.toISOString().split("T")[0],
          validTo: coupon.validTo.toISOString().split("T")[0],
          isActive: coupon.isActive,
        }}
      />
    </div>
  );
}
