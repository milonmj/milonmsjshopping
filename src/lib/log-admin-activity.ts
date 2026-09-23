import { prisma } from "@/lib/prisma";

export async function logAdminActivity(
  session: any,
  action: string,
  targetType?: string,
  targetId?: string,
  details?: string
) {
  try {
    await prisma.adminActivityLog.create({
      data: {
        adminId: session.user.id,
        adminName: session.user.name || "Unknown",
        action,
        targetType,
        targetId,
        details,
      },
    });
  } catch (err) {
    console.error("Failed to log admin activity:", err);
  }
}
