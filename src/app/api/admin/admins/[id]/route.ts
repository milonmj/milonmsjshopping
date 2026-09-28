import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import { logAdminActivity } from "@/lib/log-admin-activity";

export async function PATCH(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await requireAdmin();
  if (session instanceof NextResponse) return session;

  const myId = (session as any)?.user?.id;
  if (params.id === myId) {
    return NextResponse.json(
      { ok: false, error: "নিজের অ্যাকাউন্টের অ্যাক্সেস নিজে বন্ধ করা যাবে না।" },
      { status: 400 }
    );
  }

  try {
    const target = await prisma.user.findUnique({ where: { id: params.id } });
    if (!target || target.role === "CUSTOMER") {
      return NextResponse.json(
        { ok: false, error: "অ্যাডমিন পাওয়া যায়নি।" },
        { status: 404 }
      );
    }

    await prisma.user.update({
      where: { id: params.id },
      data: { role: "CUSTOMER" },
    });

    await logAdminActivity(session, "REMOVE_ADMIN", "User", target.id, target.phone);
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err?.message || "অ্যাক্সেস বন্ধ করা যায়নি।" },
      { status: 500 }
    );
  }
}
