"use client";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { signOut } from "next-auth/react";
import { LayoutDashboard, Package, FolderTree, ClipboardList, Users, LogOut } from "lucide-react";
import { SITE_NAME } from "@/lib/site-config";

const LINKS = [
  { href: "/admin", icon: LayoutDashboard, bn: "ড্যাশবোর্ড", en: "Dashboard" },
  { href: "/admin/products", icon: Package, bn: "পণ্য", en: "Products" },
  { href: "/admin/categories", icon: FolderTree, bn: "ক্যাটেগরি", en: "Categories" },
  { href: "/admin/orders", icon: ClipboardList, bn: "অর্ডার", en: "Orders" },
  { href: "/admin/customers", icon: Users, bn: "কাস্টমার", en: "Customers" },
] as const;

export default function AdminNav() {
  const pathname = usePathname();
  const locale = useSearchParams().get("lang") === "en" ? "en" : "bn";

  return (
    <aside className="sticky top-6 h-fit w-56 shrink-0 rounded-xl border border-brand-pinkLight bg-white p-3">
      <div className="mb-3 px-2 py-1">
        <p className="font-display text-sm font-semibold">{locale === "bn" ? "মিলন এম অ্যান্ড জে" : SITE_NAME}</p>
        <p className="text-xs text-brand-ink/50">{locale === "bn" ? "অ্যাডমিন প্যানেল" : "Admin Panel"}</p>
      </div>

      <nav className="space-y-1">
        {LINKS.map(({ href, icon: Icon, bn, en }) => {
          const active = href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium ${
                active ? "bg-brand-pink text-white" : "text-brand-ink/70 hover:bg-brand-pinkLight/50"
              }`}
            >
              <Icon size={16} />
              {locale === "bn" ? bn : en}
            </Link>
          );
        })}
      </nav>

      <button
        onClick={() => signOut({ callbackUrl: "/admin-login" })}
        className="mt-4 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-brand-ink/60 hover:bg-brand-pinkLight/50"
      >
        <LogOut size={16} />
        {locale === "bn" ? "লগআউট" : "Log Out"}
      </button>
    </aside>
  );
}
