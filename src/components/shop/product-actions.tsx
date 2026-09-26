"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { toggleWishlistAction } from "@/app/actions/shop";
import { useCart, type CartItem } from "./cart-provider";

export function ProductActions({ item }: { item: Omit<CartItem, "qty"> }) {
  const { add, items } = useCart();
  const router = useRouter();
  const inCart = items.some((i) => i.id === item.id);
  const out = item.stock <= 0;

  return (
    <div className="grid grid-cols-2 gap-3">
      <button
        type="button"
        disabled={out}
        onClick={() => (inCart ? router.push("/cart") : add(item))}
        className="btn-cart py-4 text-base"
      >
        🛒 {inCart ? "Go to cart" : "Add to cart"}
      </button>
      <button
        type="button"
        disabled={out}
        onClick={() => {
          if (!inCart) add(item);
          router.push("/checkout");
        }}
        className="btn-buy py-4 text-base"
      >
        ⚡ Buy now
      </button>
      {out && <p className="col-span-2 text-sm font-semibold text-red-600">Currently out of stock</p>}
    </div>
  );
}

export function WishlistButton({ productId }: { productId: number }) {
  const [on, setOn] = useState(false);
  const [pending, start] = useTransition();
  const router = useRouter();

  useEffect(() => {
    fetch("/api/me", { cache: "no-store" })
      .then((r) => r.json())
      .then((d: { wishlist?: number[] }) => setOn(!!d.wishlist?.includes(productId)))
      .catch(() => {});
  }, [productId]);

  return (
    <button
      type="button"
      aria-pressed={on}
      aria-label={on ? "Remove from wishlist" : "Add to wishlist"}
      disabled={pending}
      onClick={() =>
        start(async () => {
          const res = await toggleWishlistAction(productId);
          if (res.error === "auth") router.push(`/login?next=${encodeURIComponent(location.pathname)}`);
          else if (res.wishlisted !== undefined) setOn(res.wishlisted);
        })
      }
      className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white shadow"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill={on ? "#ff4343" : "#c2c2c2"} aria-hidden>
        <path d="M12 21.35 10.55 20C5.4 15.36 2 12.27 2 8.5 2 5.41 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09A6.03 6.03 0 0 1 16.5 3C19.58 3 22 5.41 22 8.5c0 3.77-3.4 6.86-8.55 11.54z" />
      </svg>
    </button>
  );
}
