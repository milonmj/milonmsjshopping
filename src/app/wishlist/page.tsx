"use client";
import Link from "next/link";
import { useWishlist } from "@/lib/wishlist-context";
import { useCart } from "@/lib/cart-context";
import { useSearchParams } from "next/navigation";
import { Heart } from "lucide-react";
import ProductImage from "@/components/ProductImage";

export default function WishlistPage() {
  const { items, toggle } = useWishlist();
  const { addItem } = useCart();
  const locale = useSearchParams().get("lang") === "en" ? "en" : "bn";

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <p className="text-brand-ink/60">{locale === "bn" ? "আপনার উইশলিস্ট খালি।" : "Your wishlist is empty."}</p>
        <Link href="/" className="mt-4 inline-block rounded-full bg-brand-pink px-6 py-3 text-sm font-semibold text-white">
          {locale === "bn" ? "কেনাকাটা করুন" : "Continue Shopping"}
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="font-display text-2xl font-semibold">{locale === "bn" ? "উইশলিস্ট" : "Wishlist"}</h1>
      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
        {items.map((item) => (
          <div key={item.productId} className="overflow-hidden rounded-xl border border-brand-pinkLight bg-white">
            <Link href={`/product/${item.slug}`}>
              <ProductImage src={item.image} alt={item.name} className="aspect-[4/5] w-full object-cover" />
            </Link>
            <div className="p-3">
              <p className="line-clamp-2 text-sm font-medium">{item.name}</p>
              <p className="mt-1 font-semibold text-brand-pink">৳{item.price}</p>
              <div className="mt-2 flex gap-2">
                <button
                  onClick={() => addItem({ productId: item.productId, slug: item.slug, name: item.name, image: item.image, unitPrice: item.price, quantity: 1, maxQuantity: 99 })}
                  className="flex-1 rounded-full bg-brand-pink px-3 py-1.5 text-xs font-semibold text-white"
                >
                  {locale === "bn" ? "কার্টে যোগ করুন" : "Add to Cart"}
                </button>
                <button onClick={() => toggle(item)} aria-label="Remove from wishlist" className="rounded-full border border-brand-pinkLight px-2 text-brand-ink/50">
                  <Heart size={14} fill="currentColor" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
