import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

function generateOrderNumber() {
  const now = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `ORD-${now}-${rand}`;
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const body = await req.json();

  try {
    const {
      items,
      guestName,
      guestPhone,
      deliveryDistrict,
      deliveryArea,
      deliveryAddress,
      paymentMethod,
      deliveryCharge,
      couponId,
      discountAmount,
    } = body;

    if (!items || items.length === 0) {
      return NextResponse.json(
        { ok: false, error: "No items in order." },
        { status: 400 }
      );
    }

    let subtotal = 0;
    const orderItemsData = [];

    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
      });
      if (!product) continue;

      const isWholesale = !!(
          product.wholesalePrice &&
          product.minWholesaleQty &&
          item.quantity >= product.minWholesaleQty
        );
        const price = isWholesale
          ? Number(product.wholesalePrice)
          : Number(product.discountPrice || product.retailPrice);

        subtotal += price * item.quantity;

        orderItemsData.push({
          productId: item.productId,
          variantInfo: item.variantInfo || null,
          quantity: item.quantity,
          unitPrice: price,
          isWholesale,
        });
    }

    const charge = deliveryCharge ?? 0;
    const totalAmount = subtotal + charge - (discountAmount || 0);

    const order = await prisma.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        userId: session?.user?.id || null,
        guestName: session?.user?.id ? null : guestName,
        guestPhone: session?.user?.id ? null : guestPhone,
        deliveryDistrict,
        deliveryArea,
        deliveryAddress,
        deliveryPhone: guestPhone,
        paymentMethod,
        deliveryCharge: charge,
        couponId: couponId || null,
        discountAmount: discountAmount || 0,
        subtotal,
        totalAmount,
        items: {
          create: orderItemsData,
        },
      },
    });

    return NextResponse.json({ ok: true, order });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err?.message || "Could not place order." },
      { status: 500 }
    );
  }
}
