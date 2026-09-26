"use client";

import { useEffect } from "react";
import { useCart } from "./cart-provider";

/** Rendered on the order confirmation page to empty the local cart once. */
export function ClearCart() {
  const { clear, ready } = useCart();
  useEffect(() => {
    if (ready) clear();
  }, [ready, clear]);
  return null;
}
