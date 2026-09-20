import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { code, subtotal } = body;

    if (!code || typeof code !== "string") {
      return NextResponse.json(
        { valid: false, message: "কুপন কোড দিন" },
        { status: 400 }
      );
    }

    const coupon = await prisma.coupon.findUnique({
      where: { code: code.trim().toUpperCase() },
    });

    if (!coupon) {
      return NextResponse.json(
        { valid: false, message: "এই কুপন কোডটি সঠিক নয়" },
        { status: 404 }
      );
    }

    if (!coupon.isActive) {
      return NextResponse.json(
        { valid: false, message: "এই কুপনটি আর সক্রিয় নেই" },
        { status: 400 }
      );
    }

    const now = new Date();
    if (now < coupon.validFrom || now > coupon.validTo) {
      return NextResponse.json(
        { valid: false, message: "এই কুপনের মেয়াদ শেষ হয়ে গেছে" },
        { status: 400 }
      );
    }

    const orderSubtotal = typeof subtotal === "number" ? subtotal : 0;

    if (
      coupon.minOrderAmt &&
      orderSubtotal < Number(coupon.minOrderAmt)
    ) {
      return NextResponse.json(
        {
          valid: false,
          message: `এই কুপন ব্যবহার করতে কমপক্ষে ৳${Number(
            coupon.minOrderAmt
          )} কেনাকাটা করতে হবে`,
        },
        { status: 400 }
      );
    }

    // Calculate discount
    let discountAmount = 0;
    if (coupon.percentOff) {
      discountAmount = (orderSubtotal * coupon.percentOff) / 100;
    } else if (coupon.amountOff) {
      discountAmount = Number(coupon.amountOff);
    }

    // Discount can't exceed subtotal
    if (discountAmount > orderSubtotal) {
      discountAmount = orderSubtotal;
    }

    return NextResponse.json({
      valid: true,
      couponId: coupon.id,
      code: coupon.code,
      percentOff: coupon.percentOff,
      amountOff: coupon.amountOff ? Number(coupon.amountOff) : null,
      discountAmount: Math.round(discountAmount),
      message: "কুপন সফলভাবে প্রয়োগ হয়েছে",
    });
  } catch (error) {
    console.error("Coupon validation error:", error);
    return NextResponse.json(
      { valid: false, message: "কুপন যাচাই করতে সমস্যা হয়েছে" },
      { status: 500 }
    );
  }
}
