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
      deliveryPhone,
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

      const price =
        item.isWholesale && product.wholesalePrice
          ? Number(product.wholesalePrice)
          : Number(product.discountPrice || product.retailPrice);

      subtotal += price * item.quantity;

      orderItemsData.push({
        productId: item.productId,
        variantInfo: item.variantInfo || null,
        quantity: item.quantity,
        unitPrice: price,
        isWholesale: item.isWholesale || false,
      });
    }

    const totalAmount = subtotal + (deliveryCharge || 0) - (discountAmount || 0);

    const order = await prisma.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        userId: session?.user?.id || null,
        guestName: session?.user?.id ? null : guestName,
        guestPhone: session?.user?.id ? null : guestPhone,
        deliveryDistrict,
        deliveryArea,
        deliveryAddress,
        deliveryPhone,
        paymentMethod,
        deliveryCharge: deliveryCharge || 0,
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
