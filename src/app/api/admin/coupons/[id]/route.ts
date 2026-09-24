import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import { logAdminActivity } from "@/lib/log-admin-activity";
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await requireAdmin();
  if (session instanceof NextResponse) return session;

  const body = await req.json();

  try {
    const coupon = await prisma.coupon.update({
      where: { id: params.id },
      data: {
        code: body.code ? body.code.toUpperCase().trim() : undefined,
        percentOff:
          body.percentOff !== undefined ? Number(body.percentOff) || null : undefined,
        amountOff:
          body.amountOff !== undefined ? Number(body.amountOff) || null : undefined,
        minOrderAmt:
          body.minOrderAmt !== undefined ? Number(body.minOrderAmt) || null : undefined,
        validFrom: body.validFrom ? new Date(body.validFrom) : undefined,
        validTo: body.validTo ? new Date(body.validTo) : undefined,
        isActive: body.isActive !== undefined ? body.isActive : undefined,
      },
    });
    return NextResponse.json({ ok: true, coupon });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err?.message || "Could not update coupon." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await requireAdmin();
  if (session instanceof NextResponse) return session;

  try {
    await prisma.coupon.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err?.message || "Could not delete coupon." },
      { status: 500 }
    );
  }
}
