import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await requireAdmin();
  if (session instanceof NextResponse) return session;

  const product = await prisma.product.findUnique({
    where: { id: params.id },
    include: { images: true, variants: true, category: true },
  });

  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }
  return NextResponse.json(product);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await requireAdmin();
  if (session instanceof NextResponse) return session;

  const body = await req.json();

  try {
    const data: any = {};

    if (body.nameBn !== undefined) data.nameBn = body.nameBn;
    if (body.nameEn !== undefined) data.nameEn = body.nameEn;
    if (body.slug !== undefined) data.slug = body.slug;
    if (body.descriptionBn !== undefined) data.descriptionBn = body.descriptionBn;
    if (body.descriptionEn !== undefined) data.descriptionEn = body.descriptionEn;
    if (body.sku !== undefined) data.sku = body.sku;
    if (body.brand !== undefined) data.brand = body.brand || null;
    if (body.categoryId !== undefined) data.categoryId = body.categoryId;
    if (body.retailPrice !== undefined) data.retailPrice = body.retailPrice;
    if (body.wholesalePrice !== undefined) data.wholesalePrice = body.wholesalePrice ?? null;
    if (body.minWholesaleQty !== undefined) data.minWholesaleQty = body.minWholesaleQty ?? null;
    if (body.discountPrice !== undefined) data.discountPrice = body.discountPrice ?? null;
    if (body.quantity !== undefined) data.quantity = body.quantity;
    if (body.lowStockAlertAt !== undefined) data.lowStockAlertAt = body.lowStockAlertAt;
    if (body.isFeatured !== undefined) data.isFeatured = body.isFeatured;
    if (body.isActive !== undefined) data.isActive = body.isActive;

    if (body.images !== undefined) {
      await prisma.productImage.deleteMany({ where: { productId: params.id } });
      data.images = {
        create: body.images.map((img: { url: string }, i: number) => ({
          url: img.url,
          sortOrder: i,
        })),
      };
    }

    if (body.variants !== undefined) {
      await prisma.productVariant.deleteMany({ where: { productId: params.id } });
      data.variants = {
        create: body.variants.map((v: any) => ({
          size: v.size || null,
          color: v.color || null,
          sku: v.sku,
          quantity: v.quantity ?? 0,
          priceDelta: v.priceDelta ?? 0,
        })),
      };
    }

    const product = await prisma.product.update({
      where: { id: params.id },
      data,
    });

    return NextResponse.json({ ok: true, product });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err?.message || "Could not update product." },
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
    await prisma.product.update({
      where: { id: params.id },
      data: { isActive: false },
    });
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err?.message || "Could not deactivate product." },
      { status: 500 }
    );
  }
}
