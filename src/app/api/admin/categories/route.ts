import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";

export async function GET() {
  const session = await requireAdmin();
  if (session instanceof NextResponse) return session;

  const categories = await prisma.category.findMany({
    orderBy: { nameEn: "asc" },
  });
  return NextResponse.json(categories);
}

export async function POST(req: NextRequest) {
  const session = await requireAdmin();
  if (session instanceof NextResponse) return session;

  const body = await req.json();

  try {
    const category = await prisma.category.create({
      data: {
        nameBn: body.nameBn,
        nameEn: body.nameEn,
        slug: body.slug,
        parentId: body.parentId || null,
        isActive: body.isActive ?? true,
      },
    });
    return NextResponse.json({ ok: true, category });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err?.message || "Could not save category." },
      { status: 500 }
    );
  }
}
