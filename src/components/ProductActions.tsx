"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Heart } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { useWishlist } from "@/lib/wishlist-context";

type Props = {
  productId: string;
  slug: string;
  name: string;
  image: string;
  unitPrice: number;
  maxQuantity: number;
  outOfStock: boolean;
  locale: "bn" | "en";
};

export default function ProductActions({ productId, slug, name, image, unitPrice, maxQuantity, outOfStock, locale }: Props) {
  const router = useRouter();
  const { addItem } = useCart();
  const { toggle, isWishlisted } = useWishlist();
  const [qty, setQty] = useState(1);
  const wishlisted = isWishlisted(productId);

  function handleAddToCart() {
    addItem({ productId, slug, name, image, unitPrice, quantity: qty, maxQuantity });
  }

  function handleBuyNow() {
    handleAddToCart();
    router.push("/checkout");
  }

  return (
    <div className="mt-6">
      <div className="mb-3 flex items-center gap-3">
        <label className="text-sm text-brand-ink/60">{locale === "bn" ? "পরিমাণ" : "Qty"}</label>
        <div className="flex items-center rounded-full border border-brand-pinkLight">
          <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="px-3 py-1 text-brand-ink/60">−</button>
          <span className="w-8 text-center text-sm">{qty}</span>
          <button onClick={() => setQty((q) => Math.min(maxQuantity, q + 1))} className="px-3 py-1 text-brand-ink/60">+</button>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          disabled={outOfStock}
          onClick={handleAddToCart}
          className="flex-1 rounded-full border border-brand-pink px-6 py-3 text-sm font-semibold text-brand-pink disabled:opacity-40"
        >
          {outOfStock ? (locale === "bn" ? "স্টক নেই" : "Out of Stock") : (locale === "bn" ? "কার্টে যোগ করুন" : "Add to Cart")}
        </button>
        <button
          disabled={outOfStock}
          onClick={handleBuyNow}
          className="flex-1 rounded-full bg-brand-pink px-6 py-3 text-sm font-semibold text-white disabled:opacity-40"
        >
          {locale === "bn" ? "এখনই কিনুন" : "Buy Now"}
        </button>
        <button
          onClick={() => toggle({ productId, slug, name, image, price: unitPrice })}
          aria-label="Wishlist"
          className={`rounded-full border px-4 py-3 ${wishlisted ? "border-brand-pink bg-brand-pinkLight text-brand-pink" : "border-brand-pinkLight text-brand-ink/50"}`}
        >
          <Heart size={18} fill={wishlisted ? "currentColor" : "none"} />
        </button>
      </div>
    </div>
  );
}
