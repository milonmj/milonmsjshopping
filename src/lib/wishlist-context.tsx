"use client";
import { createContext, useContext, useEffect, useRef, useState, ReactNode } from "react";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";

export type WishlistItem = { productId: string; slug: string; name: string; image: string; price: number };

type WishlistContextType = {
  items: WishlistItem[];
  toggle: (item: WishlistItem) => void;
  isWishlisted: (productId: string) => boolean;
};

const WishlistContext = createContext<WishlistContextType | null>(null);
const STORAGE_KEY = "milonmj_wishlist";

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { status } = useSession();
  const locale = useSearchParams().get("lang") === "en" ? "en" : "bn";
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const merged = useRef(false);
  const prevStatus = useRef(status);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      // ignore corrupted storage
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated && status !== "authenticated") localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated, status]);

  useEffect(() => {
    if (status !== "authenticated" || merged.current) return;
    merged.current = true;
    (async () => {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        const local: WishlistItem[] = raw ? JSON.parse(raw) : [];
        for (const item of local) {
          await fetch("/api/account/wishlist", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ productId: item.productId }),
          }).catch(() => {});
        }
        localStorage.removeItem(STORAGE_KEY);

        const res = await fetch("/api/account/wishlist");
        if (res.ok) {
          const data = await res.json();
          setItems(
            data.map((p: any) => ({
              productId: p.productId,
              slug: p.slug,
              name: locale === "bn" ? p.nameBn : p.nameEn,
              image: p.image,
              price: p.price,
            }))
          );
        }
      } catch {
        // best-effort sync — keep whatever local state exists if this fails
      }
    })();
  }, [status, locale]);

  useEffect(() => {
    if (prevStatus.current === "authenticated" && status === "unauthenticated") {
      merged.current = false;
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        setItems(raw ? JSON.parse(raw) : []);
      } catch {
        setItems([]);
      }
    }
    prevStatus.current = status;
  }, [status]);

  async function toggle(item: WishlistItem) {
    if (status === "authenticated") {
      const exists = items.some((i) => i.productId === item.productId);
      setItems((prev) => (exists ? prev.filter((i) => i.productId !== item.productId) : [...prev, item]));
      try {
        if (exists) {
          await fetch(`/api/account/wishlist?productId=${item.productId}`, { method: "DELETE" });
        } else {
          await fetch("/api/account/wishlist", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ productId: item.productId }),
          });
        }
      } catch {
        // optimistic UI already updated; a page refresh will resync from the DB if this failed
      }
      return;
    }

    setItems((prev) =>
      prev.some((i) => i.productId === item.productId)
        ? prev.filter((i) => i.productId !== item.productId)
        : [...prev, item]
    );
  }

  function isWishlisted(productId: string) {
    return items.some((i) => i.productId === productId);
  }

  return <WishlistContext.Provider value={{ items, toggle, isWishlisted }}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used inside <WishlistProvider>");
  return ctx;
}
