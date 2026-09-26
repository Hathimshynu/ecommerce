"use client";

import Image from "next/image";
import Link from "next/link";
import { MAX_QTY, useCart } from "@/components/shop/cart-provider";
import { PriceDetails } from "@/components/shop/price-details";
import { discountPercent, formatPrice } from "@/lib/format";

export function CartView() {
  const { items, ready, setQty, remove, subtotal, mrpTotal, count } = useCart();

  if (!ready) return <div className="mx-auto max-w-7xl p-3"><div className="card h-64 animate-pulse" /></div>;

  if (!items.length)
    return (
      <div className="mx-auto max-w-7xl p-3">
        <div className="card flex flex-col items-center gap-3 p-16 text-center">
          <p className="text-lg font-semibold">Your cart is empty!</p>
          <p className="text-sm text-gray-500">Add items to it now.</p>
          <Link href="/" className="btn-primary px-16">Shop now</Link>
        </div>
      </div>
    );

  return (
    <div className="mx-auto grid max-w-7xl gap-3 p-2 sm:p-3 lg:grid-cols-[1fr_380px]">
      <section className="card">
        <h1 className="border-b px-6 py-4 text-lg font-semibold">My Cart ({count})</h1>
        <ul className="divide-y">
          {items.map((i) => {
            const off = discountPercent(i.price, i.mrp);
            return (
              <li key={i.id} className="flex gap-4 p-4 sm:p-6">
                <div className="flex w-24 shrink-0 flex-col items-center gap-3">
                  <Link href={`/p/${i.slug}`} className="relative block h-24 w-24">
                    {i.image && <Image src={i.image} alt={i.name} fill sizes="96px" className="object-contain" />}
                  </Link>
                  <div className="flex items-center gap-1">
                    <button aria-label="Decrease quantity" disabled={i.qty <= 1} onClick={() => setQty(i.id, i.qty - 1)} className="h-7 w-7 rounded-full border text-lg leading-none disabled:opacity-40">−</button>
                    <span className="w-9 border py-0.5 text-center text-sm">{i.qty}</span>
                    <button aria-label="Increase quantity" disabled={i.qty >= Math.min(MAX_QTY, i.stock)} onClick={() => setQty(i.id, i.qty + 1)} className="h-7 w-7 rounded-full border text-lg leading-none disabled:opacity-40">+</button>
                  </div>
                </div>
                <div className="min-w-0 flex-1 space-y-2">
                  <Link href={`/p/${i.slug}`} className="line-clamp-2 hover:text-brand">{i.name}</Link>
                  <div className="flex flex-wrap items-baseline gap-2">
                    {off > 0 && <span className="text-sm text-gray-500 line-through">{formatPrice(i.mrp * i.qty)}</span>}
                    <span className="text-lg font-semibold">{formatPrice(i.price * i.qty)}</span>
                    {off > 0 && <span className="text-sm font-semibold text-success">{off}% Off</span>}
                  </div>
                  <button onClick={() => remove(i.id)} className="text-sm font-semibold uppercase hover:text-brand">Remove</button>
                </div>
              </li>
            );
          })}
        </ul>
        <div className="sticky bottom-0 flex justify-end border-t bg-white p-4 shadow-[0_-2px_10px_rgba(0,0,0,0.1)]">
          <Link href="/checkout" className="btn-buy px-12 py-3.5">Place order</Link>
        </div>
      </section>
      <PriceDetails count={count} subtotal={subtotal} mrpTotal={mrpTotal} />
    </div>
  );
}
