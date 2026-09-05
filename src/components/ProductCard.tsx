"use client";
import Link from "next/link";
import { Heart } from "lucide-react";
import { useWishlist } from "@/lib/wishlist-context";
import ProductImage from "@/components/ProductImage";

type Props = {
  productId?: string;
  slug: string;
  name: string;
  image: string;
  retailPrice: number;
  discountPrice?: number | null;
  wholesalePrice?: number | null;
  stockStatus: "IN_STOCK" | "LOW_STOCK" | "OUT_OF_STOCK";
  locale?: "bn" | "en";
};

export default function ProductCard({ productId, slug, name, image, retailPrice, discountPrice, wholesalePrice, stockStatus, locale = "bn" }: Props) {
  const outOfStock = stockStatus === "OUT_OF_STOCK";
  const { toggle, isWishlisted } = useWishlist();
  const wishlisted = productId ? isWishlisted(productId) : false;

  return (
    <div className="group relative overflow-hidden rounded-xl border border-brand-pinkLight bg-white transition hover:shadow-lg">
      {productId && (
        <button
          onClick={(e) => {
            e.preventDefault();
            toggle({ productId, slug, name, image, price: discountPrice ?? retailPrice });
          }}
          aria-label="Wishlist"
          className={`absolute right-2 top-2 z-10 rounded-full bg-white/90 p-1.5 shadow ${wishlisted ? "text-brand-pink" : "text-brand-ink/40"}`}
        >
          <Heart size={14} fill={wishlisted ? "currentColor" : "none"} />
        </button>
      )}
      <Link href={`/product/${slug}`}>
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-brand-pinkLight/30">
          <ProductImage src={image} alt={name} className="absolute inset-0 h-full w-full object-cover transition duration-300 group-hover:scale-105" />
          {outOfStock && (
            <span className="absolute left-2 top-2 rounded-full bg-brand-ink/80 px-2 py-1 text-[10px] font-semibold text-white">
              {locale === "bn" ? "স্টক নেই" : "Out of Stock"}
            </span>
          )}
          {discountPrice && !outOfStock && (
            <span className="absolute left-2 top-2 rounded-full bg-brand-pink px-2 py-1 text-[10px] font-semibold text-white">
              {locale === "bn" ? "অফার" : "SALE"}
            </span>
          )}
        </div>
        <div className="p-3">
          <p className="line-clamp-2 text-sm font-medium text-brand-ink">{name}</p>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="font-semibold text-brand-pink">৳{discountPrice ?? retailPrice}</span>
            {discountPrice && <span className="text-xs text-brand-ink/40 line-through">৳{retailPrice}</span>}
          </div>
          {wholesalePrice && (
            <p className="mt-0.5 text-[11px] text-brand-ink/50">
              {locale === "bn" ? "পাইকারি" : "Wholesale"}: ৳{wholesalePrice}
            </p>
          )}
        </div>
      </Link>
    </div>
  );
}
