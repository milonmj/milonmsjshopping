import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { randomInt } from "crypto";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import { logAdminActivity } from "@/lib/log-admin-activity";

function makeTempPassword() {
  const chars = "abcdefghjkmnpqrstuvwxyz23456789";
  let out = "";
  for (let i = 0; i < 8; i++) out += chars[randomInt(chars.length)];
  return out;
}

export async function POST(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await requireAdmin();
  if (session instanceof NextResponse) return session;

  try {
    const customer = await prisma.user.findUnique({ where: { id: params.id } });
    if (!customer || customer.role !== "CUSTOMER") {
      return NextResponse.json(
        { ok: false, error: "কাস্টমার পাওয়া যায়নি।" },
        { status: 404 }
      );
    }

    const tempPassword = makeTempPassword();
    const passwordHash = await bcrypt.hash(tempPassword, 10);
    await prisma.user.update({
      where: { id: customer.id },
      data: { passwordHash },
    });

    await logAdminActivity(
      session,
      "RESET_CUSTOMER_PASSWORD",
      "User",
      customer.id,
      customer.phone
    );
    return NextResponse.json({ ok: true, tempPassword });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err?.message || "পাসওয়ার্ড রিসেট করা যায়নি।" },
      { status: 500 }
    );
  }
                              }
