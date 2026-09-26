"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";

export type CartItem = {
  id: number;
  slug: string;
  name: string;
  image: string | null;
  price: number;
  mrp: number;
  stock: number;
  qty: number;
};

type CartCtx = {
  items: CartItem[];
  count: number;
  subtotal: number;
  mrpTotal: number;
  ready: boolean;
  add: (item: Omit<CartItem, "qty">, qty?: number) => void;
  setQty: (id: number, qty: number) => void;
  remove: (id: number) => void;
  clear: () => void;
  /** Refresh prices/stock from the server; returns human-readable change notes. */
  sync: () => Promise<string[]>;
  hasUnavailable: boolean;
};

const Ctx = createContext<CartCtx | null>(null);
const KEY = "sk_cart_v1";
export const MAX_QTY = 10;

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      /* ignore */
    }
    setReady(true);
    const onStorage = (e: StorageEvent) => {
      if (e.key === KEY) setItems(e.newValue ? JSON.parse(e.newValue) : []);
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(items));
    } catch {
      /* ignore */
    }
  }, [items, ready]);

  const add = useCallback<CartCtx["add"]>((item, qty = 1) => {
    setItems((prev) => {
      const limit = Math.min(MAX_QTY, item.stock);
      const existing = prev.find((i) => i.id === item.id);
      if (existing) return prev.map((i) => (i.id === item.id ? { ...i, ...item, qty: Math.min(limit, i.qty + qty) } : i));
      return [...prev, { ...item, qty: Math.min(limit, qty) }];
    });
  }, []);

  const setQty = useCallback((id: number, qty: number) => {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, qty: Math.max(1, Math.min(qty, MAX_QTY, i.stock)) } : i)),
    );
  }, []);

  const remove = useCallback((id: number) => setItems((prev) => prev.filter((i) => i.id !== id)), []);
  const clear = useCallback(() => setItems([]), []);

  const itemsRef = useRef(items);
  itemsRef.current = items;

  const sync = useCallback(async () => {
    const current = itemsRef.current;
    if (!current.length) return [];
    try {
      const res = await fetch(`/api/cart?ids=${current.map((i) => i.id).join(",")}`, { cache: "no-store" });
      if (!res.ok) return [];
      const fresh = new Map<number, Omit<CartItem, "qty">>(
        ((await res.json()).items as Omit<CartItem, "qty">[]).map((p) => [p.id, p]),
      );
      const notes: string[] = [];
      const next = current.flatMap((i) => {
        const p = fresh.get(i.id);
        if (!p) {
          notes.push(`"${i.name}" is no longer available and was removed.`);
          return [];
        }
        if (p.price !== i.price) notes.push(`Price of "${p.name}" changed from ₹${i.price} to ₹${p.price}.`);
        if (p.stock > 0 && i.qty > p.stock) notes.push(`Only ${p.stock} of "${p.name}" left; quantity updated.`);
        if (p.stock <= 0 && i.stock > 0) notes.push(`"${p.name}" just went out of stock.`);
        return [{ ...p, qty: p.stock > 0 ? Math.min(i.qty, p.stock, MAX_QTY) : i.qty }];
      });
      setItems(next);
      return notes;
    } catch {
      return [];
    }
  }, []);

  const value = useMemo<CartCtx>(() => {
    const count = items.reduce((n, i) => n + i.qty, 0);
    const subtotal = items.reduce((n, i) => n + i.qty * i.price, 0);
    const mrpTotal = items.reduce((n, i) => n + i.qty * i.mrp, 0);
    const hasUnavailable = items.some((i) => i.stock <= 0);
    return { items, count, subtotal, mrpTotal, ready, add, setQty, remove, clear, sync, hasUnavailable };
  }, [items, ready, add, setQty, remove, clear, sync]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
