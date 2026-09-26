"use client";

import Link from "next/link";
import { useActionState } from "react";
import { placeOrderAction } from "@/app/actions/shop";
import { useCart } from "@/components/shop/cart-provider";
import { PriceDetails } from "@/components/shop/price-details";

const STATES = ["Andhra Pradesh", "Delhi", "Gujarat", "Karnataka", "Kerala", "Maharashtra", "Punjab", "Rajasthan", "Tamil Nadu", "Telangana", "Uttar Pradesh", "West Bengal", "Other"];

export function CheckoutForm({ userName, email }: { userName: string; email: string }) {
  const { items, ready, subtotal, mrpTotal, count } = useCart();
  const [state, action, pending] = useActionState(placeOrderAction, undefined);

  if (!ready) return <div className="mx-auto max-w-7xl p-3"><div className="card h-64 animate-pulse" /></div>;
  if (!items.length)
    return (
      <div className="mx-auto max-w-7xl p-3">
        <div className="card p-16 text-center">
          <p className="mb-4 font-semibold">Your cart is empty.</p>
          <Link href="/" className="btn-primary">Continue shopping</Link>
        </div>
      </div>
    );

  return (
    <form action={action} className="mx-auto grid max-w-7xl gap-3 p-2 sm:p-3 lg:grid-cols-[1fr_380px]">
      <input type="hidden" name="cart" value={JSON.stringify(items.map((i) => ({ id: i.id, qty: i.qty })))} />
      <div className="space-y-3">
        <section className="card flex items-center gap-4 px-6 py-4">
          <span className="rounded-sm bg-gray-100 px-2 text-sm text-brand">1</span>
          <div>
            <p className="text-sm font-semibold uppercase text-gray-500">Login ✓</p>
            <p className="text-sm"><b>{userName}</b> {email}</p>
          </div>
        </section>

        <section className="card">
          <h2 className="flex items-center gap-4 bg-brand px-6 py-3 text-sm font-semibold uppercase text-white">
            <span className="rounded-sm bg-white px-2 text-brand">2</span> Delivery address
          </h2>
          <div className="grid gap-4 p-6 sm:grid-cols-2">
            <Field name="fullName" label="Full name" defaultValue={userName} autoComplete="name" />
            <Field name="phone" label="10-digit mobile number" type="tel" autoComplete="tel" />
            <Field name="pincode" label="Pincode" inputMode="numeric" autoComplete="postal-code" />
            <Field name="city" label="City / District / Town" autoComplete="address-level2" />
            <div className="sm:col-span-2"><Field name="line1" label="Address (Area and Street)" autoComplete="address-line1" /></div>
            <Field name="line2" label="Landmark (optional)" required={false} autoComplete="address-line2" />
            <div>
              <label className="label" htmlFor="state">State</label>
              <select id="state" name="state" required className="input" defaultValue="">
                <option value="" disabled>Select state</option>
                {STATES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>
        </section>

        <section className="card">
          <h2 className="flex items-center gap-4 bg-brand px-6 py-3 text-sm font-semibold uppercase text-white">
            <span className="rounded-sm bg-white px-2 text-brand">3</span> Payment options
          </h2>
          <div className="divide-y">
            {[
              ["upi", "UPI", "Pay by any UPI app"],
              ["card", "Credit / Debit / ATM Card", "Add and secure cards as per RBI guidelines"],
              ["cod", "Cash on Delivery", "Pay when your order arrives"],
            ].map(([value, label, hint], i) => (
              <label key={value} className="flex cursor-pointer items-start gap-3 px-6 py-4 hover:bg-gray-50">
                <input type="radio" name="paymentMethod" value={value} defaultChecked={i === 2} className="mt-1 accent-brand" />
                <span>
                  <span className="block text-sm font-medium">{label}</span>
                  <span className="text-xs text-gray-500">{hint}</span>
                </span>
              </label>
            ))}
          </div>
          {state?.error && <p role="alert" className="mx-6 mb-4 rounded-sm bg-red-50 p-3 text-sm text-red-700">{state.error}</p>}
          <div className="flex justify-end border-t p-4">
            <button disabled={pending} className="btn-buy px-12 py-3.5">{pending ? "Placing order…" : "Confirm order"}</button>
          </div>
        </section>
      </div>
      <PriceDetails count={count} subtotal={subtotal} mrpTotal={mrpTotal} />
    </form>
  );
}

function Field({ name, label, required = true, ...rest }: { name: string; label: string; required?: boolean } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label className="label" htmlFor={name}>{label}</label>
      <input id={name} name={name} required={required} className="input" {...rest} />
    </div>
  );
}
