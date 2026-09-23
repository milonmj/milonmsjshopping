import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import { logAdminActivity } from "@/lib/log-admin-activity";

export async function GET() {
  const session = await requireAdmin();
  if (session instanceof NextResponse) return session;

  const products = await prisma.product.findMany({
    include: { images: true, category: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(products);
}

export async function POST(req: NextRequest) {
  const session = await requireAdmin();
  if (session instanceof NextResponse) return session;

  const body = await req.json();

  try {
    const product = await prisma.product.create({
      data: {
        nameBn: body.nameBn,
        nameEn: body.nameEn,
        slug: body.slug,
        descriptionBn: body.descriptionBn,
        descriptionEn: body.descriptionEn,
        sku: body.sku,
        brand: body.brand || null,
        categoryId: body.categoryId,
        retailPrice: body.retailPrice,
        wholesalePrice: body.wholesalePrice ?? null,
        minWholesaleQty: body.minWholesaleQty ?? null,
        discountPrice: body.discountPrice ?? null,
        quantity: body.quantity,
        lowStockAlertAt: body.lowStockAlertAt ?? 5,
        isFeatured: body.isFeatured ?? false,
        isActive: body.isActive ?? true,
        images: {
          create: (body.images || []).map((img: { url: string }, i: number) => ({
            url: img.url,
            sortOrder: i,
          })),
        },
        variants: {
          create: (body.variants || []).map((v: any) => ({
            size: v.size || null,
            color: v.color || null,
            sku: v.sku,
            quantity: v.quantity ?? 0,
            priceDelta: v.priceDelta ?? 0,
          })),
        },
      },
    });
    
    await logAdminActivity(session, "CREATE_PRODUCT", "Product", product.id, product.nameEn);
    return NextResponse.json({ ok: true, product });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err?.message || "Could not save product." },
      { status: 500 }
    );
  }
      }
