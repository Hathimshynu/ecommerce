"use client";

import { useEffect, useState } from "react";
import type { ProductCardData } from "@/lib/search-types";
import { ProductRail } from "./product-card";

const KEY = "sk_recent_v1";
const MAX = 12;

function read(): ProductCardData[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "[]");
  } catch {
    return [];
  }
}

/** Records a product view (rendered on product pages; stays client-side so pages remain static). */
export function TrackView({ product }: { product: ProductCardData }) {
  useEffect(() => {
    try {
      const list = [product, ...read().filter((p) => p.id !== product.id)].slice(0, MAX);
      localStorage.setItem(KEY, JSON.stringify(list));
    } catch {
      /* storage unavailable */
    }
  }, [product]);
  return null;
}

export function RecentlyViewed({ excludeId }: { excludeId?: number }) {
  const [items, setItems] = useState<ProductCardData[]>([]);
  useEffect(() => setItems(read().filter((p) => p.id !== excludeId)), [excludeId]);
  if (items.length < 2) return null;
  return <ProductRail title="Recently Viewed" products={items} />;
}
