import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Stage 16 #3 — manual backup export. Admin downloads a full JSON snapshot
// of the core tables (no passwords included) to store outside Neon,
// since the Free plan's built-in point-in-time-restore is only 6 hours.
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const [users, categories, products, orders, coupons, reviews, activityLog] =
    await Promise.all([
      prisma.user.findMany({
        select: {
          id: true,
          name: true,
          phone: true,
          email: true,
          role: true,
          createdAt: true,
        },
      }),
      prisma.category.findMany(),
      prisma.product.findMany(),
      prisma.order.findMany({ include: { items: true } }),
      prisma.coupon.findMany(),
      prisma.review.findMany(),
      prisma.adminActivityLog.findMany(),
    ]);

  const backup = {
    exportedAt: new Date().toISOString(),
    users,
    categories,
    products,
    orders,
    coupons,
    reviews,
    activityLog,
  };

  const filename = `milon-mj-backup-${new Date().toISOString().slice(0, 10)}.json`;

  return new NextResponse(JSON.stringify(backup, null, 2), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
