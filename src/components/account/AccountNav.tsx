"use client";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

const TABS = [
  { href: "/account", bn: "প্রোফাইল", en: "Profile" },
  { href: "/account/orders", bn: "অর্ডার", en: "Orders" },
  { href: "/account/addresses", bn: "ঠিকানা", en: "Addresses" },
] as const;

export default function AccountNav() {
  const pathname = usePathname();
  const locale = useSearchParams().get("lang") === "en" ? "en" : "bn";

  return (
    <nav className="flex flex-wrap items-center gap-2 border-b border-brand-pinkLight pb-4">
      {TABS.map((tab) => {
        const active = tab.href === "/account" ? pathname === "/account" : pathname.startsWith(tab.href);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`rounded-full px-4 py-2 text-sm font-medium ${
              active ? "bg-brand-pink text-white" : "border border-brand-pinkLight text-brand-ink/70 hover:border-brand-pink"
            }`}
          >
            {locale === "bn" ? tab.bn : tab.en}
          </Link>
        );
      })}
      <button
        onClick={() => signOut({ callbackUrl: "/" })}
        className="ml-auto flex items-center gap-1.5 rounded-full border border-brand-pinkLight px-4 py-2 text-sm font-medium text-brand-ink/70 hover:border-brand-pink hover:text-brand-pink"
      >
        <LogOut size={14} />
        {locale === "bn" ? "লগআউট" : "Log Out"}
      </button>
    </nav>
  );
}
