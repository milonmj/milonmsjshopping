import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "লগইন করা প্রয়োজন" }, { status: 401 });
  }

  const body = await req.json();
  const { productId, rating, comment } = body;

  if (!productId || !rating || rating < 1 || rating > 5) {
    return NextResponse.json({ error: "সঠিক তথ্য দিন" }, { status: 400 });
  }

  const existing = await prisma.review.findFirst({
    where: { productId, userId: session.user.id },
  });

  if (existing) {
    const updated = await prisma.review.update({
      where: { id: existing.id },
      data: { rating, comment },
    });
    return NextResponse.json(updated);
  }

  const review = await prisma.review.create({
    data: {
      productId,
      userId: session.user.id,
      rating,
      comment,
    },
  });

  return NextResponse.json(review, { status: 201 });
}

export async function GET(req: NextRequest) {
  const productId = req.nextUrl.searchParams.get("productId");

  if (!productId) {
    return NextResponse.json({ error: "productId প্রয়োজন" }, { status: 400 });
  }

  const reviews = await prisma.review.findMany({
    where: { productId },
    include: { user: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(reviews);
}
