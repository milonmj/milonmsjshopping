import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";

export async function GET() {
  const session = await requireAdmin();
  if (session instanceof NextResponse) return session;

  const customers = await prisma.user.findMany({
    where: { role: "CUSTOMER" },
    include: {
      orders: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(customers);
}
