import { prisma } from "@/lib/prisma";

// Admin activity log viewer (Stage 16 #1) — lists AdminActivityLog entries, newest first
export default async function AdminActivityLogPage({
  searchParams,
}: {
  searchParams?: { lang?: string };
}) {
  const locale = searchParams?.lang === "en" ? "en" : "bn";

  const logs = await prisma.adminActivityLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <div>
      <h1 className="font-display text-xl font-semibold">
        {locale === "bn" ? "অ্যাক্টিভিটি লগ" : "Activity Log"}
      </h1>

      <div className="mt-4 overflow-x-auto rounded-xl border border-brand-pinkLight bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-brand-pinkLight text-left text-xs text-brand-ink/50">
              <th className="p-3 font-medium">{locale === "bn" ? "সময়" : "Time"}</th>
              <th className="p-3 font-medium">{locale === "bn" ? "অ্যাডমিন" : "Admin"}</th>
              <th className="p-3 font-medium">{locale === "bn" ? "অ্যাকশন" : "Action"}</th>
              <th className="p-3 font-medium">{locale === "bn" ? "টার্গেট" : "Target"}</th>
              <th className="p-3 font-medium">{locale === "bn" ? "বিস্তারিত" : "Det
