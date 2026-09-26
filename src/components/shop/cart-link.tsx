"use client";

import Link from "next/link";
import { useCart } from "./cart-provider";

export function CartLink() {
  const { count, ready } = useCart();
  return (
    <Link href="/cart" className="relative flex items-center gap-2 font-semibold text-white" aria-label={`Cart, ${count} items`}>
      <span className="relative">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
          <path d="M7 18a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm10 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4ZM1 2h3.3l.94 2H21a1 1 0 0 1 .96 1.27l-2.5 9A1 1 0 0 1 18.5 15H8.1l-.9 1.6-.03.1c0 .17.13.3.3.3H19v2H7.5a2.3 2.3 0 0 1-2.03-3.4l1.35-2.45L3 4H1V2Z" />
        </svg>
        {ready && count > 0 && (
          <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full border border-white bg-red-500 px-1 text-[10px] leading-none">
            {count}
          </span>
        )}
      </span>
      <span className="hidden sm:inline">Cart</span>
    </Link>
  );
}
