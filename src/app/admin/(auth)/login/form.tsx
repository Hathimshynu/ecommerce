"use client";

import { useActionState } from "react";
import { adminLoginAction } from "@/app/actions/auth";

export function AdminLoginForm() {
  const [state, action, pending] = useActionState(adminLoginAction, undefined);
  return (
    <form action={action} className="w-full max-w-sm space-y-4 rounded-lg bg-white p-8 shadow-xl">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-brand">ShopKart Seller Hub</p>
        <h1 className="mt-1 text-2xl font-semibold">Admin sign in</h1>
      </div>
      <div>
        <label className="label" htmlFor="email">Email</label>
        <input id="email" name="email" type="email" required autoComplete="username" className="input" />
      </div>
      <div>
        <label className="label" htmlFor="password">Password</label>
        <input id="password" name="password" type="password" required autoComplete="current-password" className="input" />
      </div>
      {state?.error && <p role="alert" className="rounded bg-red-50 p-2 text-sm text-red-700">{state.error}</p>}
      <button disabled={pending} className="btn-primary w-full">{pending ? "Signing in…" : "Sign in"}</button>
      <p className="text-center text-xs text-gray-400">Seeded admin: admin@shopkart.dev / Admin@12345</p>
    </form>
  );
}
