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
    const data: any = {};
    if (body.nameBn !== undefined) data.nameBn = body.nameBn;
    if (body.nameEn !== undefined) data.nameEn = body.nameEn;
    if (body.slug !== undefined) data.slug = body.slug;
    if (body.parentId !== undefined) data.parentId = body.parentId || null;
    if (body.isActive !== undefined) data.isActive = body.isActive;

    const category = await prisma.category.update({
      where: { id: params.id },
      data,
    });
    }); যে
    return NextResponse.json({ ok: true, category });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err?.message || "Could not update category." },
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
    await prisma.category.update({
      where: { id: params.id },
      data: { isActive: false },
    });
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err?.message || "Could not deactivate category." },
      { status: 500 }
    );
  }
}
