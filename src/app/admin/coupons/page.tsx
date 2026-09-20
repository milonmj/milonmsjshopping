import { prisma } from "@/lib/prisma";
import Link from "next/link";
import CouponRowActions from "./CouponRowActions";

export default async function AdminCouponsPage() {
  const coupons = await prisma.coupon.findMany({
    orderBy: { validFrom: "desc" },
  });

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">কুপন ব্যবস্থাপনা</h1>
        <Link
          href="/admin/coupons/new"
          className="bg-pink-600 text-white px-4 py-2 rounded-md hover:bg-pink-700"
        >
          + নতুন কুপন
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="p-3">কোড</th>
              <th className="p-3">ছাড়</th>
              <th className="p-3">ন্যূনতম অর্ডার</th>
              <th className="p-3">মেয়াদ</th>
              <th className="p-3">অবস্থা</th>
              <th className="p-3">অ্যাকশন</th>
            </tr>
          </thead>
          <tbody>
            {coupons.length === 0 && (
              <tr>
                <td colSpan={6} className="p-6 text-center text-gray-500">
                  কোনো কুপন পাওয়া যায়নি
                </td>
              </tr>
            )}
            {coupons.map((c) => (
              <tr key={c.id} className="border-t">
                <td className="p-3 font-mono">{c.code}</td>
                <td className="p-3">
                  {c.percentOff
                    ? `${c.percentOff}%`
                    : c.amountOff
                    ? `৳${c.amountOff}`
                    : "-"}
                </td>
                <td className="p-3">
                  {c.minOrderAmt ? `৳${c.minOrderAmt}` : "-"}
                </td>
                <td className="p-3 text-xs">
                  {new Date(c.validFrom).toLocaleDateString("bn-BD")} -{" "}
                  {new Date(c.validTo).toLocaleDateString("bn-BD")}
                </td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      c.isActive
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {c.isActive ? "সক্রিয়" : "নিষ্ক্রিয়"}
                  </span>
                </td>
                <td className="p-3">
                  <CouponRowActions couponId={c.id} isActive={c.isActive} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
