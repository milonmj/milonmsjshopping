import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

// TEMPORARY one-time setup route — creates/promotes the demo admin account since the
// seed script can't be run against production without CLI access. Delete this file
// once the admin account has been created successfully.
export async function GET(req: NextRequest) {
  const key = req.nextUrl.searchParams.get("key");
  if (key !== process.env.ADMIN_SETUP_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const passwordHash = await bcrypt.hash("admin1234", 10);

  const admin = await prisma.user.upsert({
    where: { phone: "01900000000" },
    update: { role: "ADMIN", passwordHash },
    create: {
      name: "Admin",
      phone: "01900000000",
      passwordHash,
      role: "ADMIN",
    },
  });

  return NextResponse.json({ success: true, id: admin.id, phone: admin.phone, role: admin.role });
}
