import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import { logAdminActivity } from "@/lib/log-admin-activity";

export async function GET() {
  const session = await requireAdmin();
  if (session instanceof NextResponse) return session;

  const admins = await prisma.user.findMany({
    where: { role: { in: ["ADMIN", "STAFF"] } },
    select: { id: true, name: true, phone: true, role: true, createdAt: true },
    orderBy: { createdAt: "asc" },
  });
  return NextResponse.json(admins);
}

export async function POST(req: NextRequest) {
  const session = await requireAdmin();
  if (session instanceof NextResponse) return session;

  try {
    const body = await req.json();
    const name = String(body.name || "").trim();
    const phone = String(body.phone || "").trim();
    const password = String(body.password || "");

    if (!name || !phone || password.length < 8) {
      return NextResponse.json(
        { ok: false, error: "নাম, ফোন নম্বর এবং কমপক্ষে ৮ অক্ষরের পাসওয়ার্ড দিন।" },
        { status: 400 }
      );
    }

    const existing = await prisma.user.findUnique({ where: { phone } });
    if (existing) {
      return NextResponse.json(
        { ok: false, error: "এই ফোন নম্বরে আগে থেকেই অ্যাকাউন্ট আছে। অন্য নম্বর দিন।" },
        { status: 400 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const admin = await prisma.user.create({
      data: { name, phone, passwordHash, role: "ADMIN" },
    });

    await logAdminActivity(session, "CREATE_ADMIN", "User", admin.id, admin.phone);
    return NextResponse.json({ ok: true, id: admin.id });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err?.message || "অ্যাডমিন তৈরি করা যায়নি।" },
      { status: 500 }
    );
  }
    }
