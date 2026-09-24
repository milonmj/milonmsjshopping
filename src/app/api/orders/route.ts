import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

const ORDER_LIMIT = 20;
const ORDER_WINDOW_MS = 10 * 60 * 1000; // 10 minutes

function generateOrderNumber() {
  const now = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `ORD-${now}-${rand}`;
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  const ip = getClientIp(req.headers);
  const rl = checkRateLimit(`order:${ip}`, ORDER_LIMIT, ORDER_WINDOW_MS);
  if (!rl.allowed) {
    return NextResponse.json(
      { ok: false, error: "খুব বেশি অর্ডার করার চেষ্টা হয়েছে। কিছুক্ষণ পর আবার চেষ্টা করুন।" },
      { status: 429 }
    );
  }

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
let discountAmount = 0;
      if (couponId) {
        const coupon = await prisma.coupon.findUnique({ where: { id: couponId } });
        const now = new Date();
        if (
          coupon &&
          coupon.isActive &&
          now >= coupon.validFrom &&
          now <= coupon.validTo &&
          (!coupon.minOrderAmt || subtotal >= Number(coupon.minOrderAmt))
        ) {
          discountAmount = coupon.percentOff
            ? (subtotal * coupon.percentOff) / 100
            : Number(coupon.amountOff || 0);
          if (discountAmount > subtotal) discountAmount = subtotal;
        }
      }
    const charge = deliveryDistrict?.trim().toLowerCase() === "dhaka" ? 70 : 130;
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
