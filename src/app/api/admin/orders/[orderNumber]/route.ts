import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import { logAdminActivity } from "@/lib/log-admin-activity";
export async function GET(
  req: NextRequest,
  { params }: { params: { orderNumber: string } }
) {
  const session = await requireAdmin();
  if (session instanceof NextResponse) return session;

  const order = await prisma.order.findUnique({
    where: { orderNumber: params.orderNumber },
    include: { items: true, user: true },
  });

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }
  return NextResponse.json(order);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { orderNumber: string } }
) {
  const session = await requireAdmin();
  if (session instanceof NextResponse) return session;

  const body = await req.json();

  try {
    const data: any = {};
    if (body.status !== undefined) data.status = body.status;
    if (body.courier !== undefined) data.courier = body.courier || null;
    if (body.trackingNumber !== undefined) data.trackingNumber = body.trackingNumber || null;
    if (body.paymentStatus !== undefined) data.paymentStatus = body.paymentStatus;

    const order = await prisma.order.update({
      where: { orderNumber: params.orderNumber },
      data,
    });

    await logAdminActivity(session, "UPDATE_ORDER", "Order", order.id, order.orderNumber);
    return NextResponse.json({ ok: true, order });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err?.message || "Could not update order." },
      { status: 500 }
    );
  }
}
