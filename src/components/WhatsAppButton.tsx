"use client";
import { usePathname } from "next/navigation";
import { SITE_URL } from "@/lib/site-config";

export default function WhatsAppButton({ label }: { label: string }) {
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  const pathname = usePathname();

  if (!number) return null;

  const pageUrl = `${SITE_URL}${pathname}`;
  const message =
    pathname && pathname !== "/"
      ? `Hi, I'd like to know more about this: ${pageUrl}`
      : "Hi, I'd like to know more about your products.";
  const href = `https://wa.me/${number}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-3 text-white shadow-lg hover:brightness-95"
    >
      {label}
    </a>
  );
}
