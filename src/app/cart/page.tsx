"use client";
import { Suspense } from "react";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { useSearchParams } from "next/navigation";
import { Trash2 } from "lucide-react";
import ProductImage from "@/components/ProductImage";

function CartContent() {
  const { items, updateQuantity, removeItem, subtotal } = useCart();
  const locale = useSearchParams().get("lang") === "en" ? "en" : "bn";

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <p className="text-brand-ink/60">{locale === "bn" ? "আপনার কার্ট খালি।" : "Your cart is empty."}</p>
        <Link href="/" className="mt-4 inline-block rounded-full bg-brand-pink px-6 py-3 text-sm font-semibold text-white">
          {locale === "bn" ? "কেনাকাটা করুন" : "Continue Shopping"}
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="font-display text-2xl font-semibold">{locale === "bn" ? "আপনার কার্ট" : "Your Cart"}</h1>

      <div className="mt-6 divide-y divide-brand-pinkLight">
        {items.map((item) => (
          <div key={item.productId + (item.variantInfo ?? "")} className="flex items-center gap-4 py-4">
            <ProductImage src={item.image} alt={item.name} className="h-20 w-16 rounded-lg object-cover" />
            <div className="flex-1">
              <p className="text-sm font-medium">{item.name}</p>
              {item.variantInfo && <p className="text-xs text-brand-ink/50">{item.variantInfo}</p>}
              <p className="mt-1 text-sm font-semibold text-brand-pink">৳{item.unitPrice}</p>
            </div>
            <div className="flex items-center rounded-full border border-brand-pinkLight">
              <button onClick={() => updateQuantity(item.productId, item.quantity - 1, item.variantInfo)} className="px-3 py-1 text-sm">-</button>
              <span className="w-8 text-center text-sm">{item.quantity}</span>
              <button onClick={() => updateQuantity(item.productId, item.quantity + 1, item.variantInfo)} className="px-3 py-1 text-sm">+</button>
            </div>
            <button onClick={() => removeItem(item.productId, item.variantInfo)} aria-label="Remove" className="text-brand-ink/40">
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-brand-pinkLight pt-4">
        <span className="text-lg font-semibold">{locale === "bn" ? "সাবটোটাল" : "Subtotal"}</span>
        <span className="text-lg font-bold text-brand-pink">৳{subtotal}</span>
      </div>

      <Link href="/checkout" className="mt-6 block rounded-full bg-brand-pink px-6 py-3 text-center text-sm font-semibold text-white">
        {locale === "bn" ? "চেকআউট করুন" : "Proceed to Checkout"}
      </Link>
    </div>
  );
}

export default function CartPage() {
  return (
    <Suspense fallback={null}>
      <CartContent />
    </Suspense>
  );
}
