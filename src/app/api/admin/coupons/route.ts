import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import { logAdminActivity } from "@/lib/log-admin-activity";
export async function GET() {
  const session = await requireAdmin();
  if (session instanceof NextResponse) return session;

  const coupons = await prisma.coupon.findMany({
    orderBy: { validFrom: "desc" },
  });
  return NextResponse.json(coupons);
}

export async function POST(req: NextRequest) {
  const session = await requireAdmin();
  if (session instanceof NextResponse) return session;

  const body = await req.json();

  try {
    const coupon = await prisma.coupon.create({
      data: {
        code: body.code.toUpperCase().trim(),
        percentOff: body.percentOff ? Number(body.percentOff) : null,
        amountOff: body.amountOff ? Number(body.amountOff) : null,
        minOrderAmt: body.minOrderAmt ? Number(body.minOrderAmt) : null,
        validFrom: new Date(body.validFrom),
        validTo: new Date(body.validTo),
        isActive: body.isActive ?? true,
      },
    });
    await logAdminActivity(session, "CREATE_COUPON", "Coupon", coupon.id, coupon.code);
    return NextResponse.json({ ok: true, coupon });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err?.message || "Could not save coupon." },
      { status: 500 }
    );
  }
}
