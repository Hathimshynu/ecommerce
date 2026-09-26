"use client";

import Link from "next/link";
import { useActionState } from "react";
import { loginAction, registerAction } from "@/app/actions/auth";

export function AuthForm({ mode, next }: { mode: "login" | "register"; next?: string }) {
  const [state, action, pending] = useActionState(mode === "login" ? loginAction : registerAction, undefined);
  const isLogin = mode === "login";
  const q = next ? `?next=${encodeURIComponent(next)}` : "";

  return (
    <div className="mx-auto my-6 flex max-w-3xl overflow-hidden rounded-sm bg-white shadow">
      <div className="hidden w-2/5 flex-col justify-between bg-brand p-8 text-white sm:flex">
        <div>
          <h1 className="text-3xl font-semibold">{isLogin ? "Login" : "Looks like you're new here!"}</h1>
          <p className="mt-4 text-lg text-blue-100">
            {isLogin ? "Get access to your Orders, Wishlist and Recommendations" : "Sign up with your email to get started"}
          </p>
        </div>
        <div className="text-7xl opacity-80" aria-hidden>🛍️</div>
      </div>
      <form action={action} className="flex flex-1 flex-col gap-4 p-8">
        <h1 className="text-2xl font-semibold sm:hidden">{isLogin ? "Login" : "Create account"}</h1>
        <input type="hidden" name="next" value={next ?? "/"} />
        {!isLogin && (
          <div>
            <label className="label" htmlFor="name">Full name</label>
            <input id="name" name="name" required autoComplete="name" className="input" />
          </div>
        )}
        <div>
          <label className="label" htmlFor="email">Email</label>
          <input id="email" name="email" type="email" required autoComplete="email" className="input" />
        </div>
        {!isLogin && (
          <div>
            <label className="label" htmlFor="phone">Mobile (optional)</label>
            <input id="phone" name="phone" type="tel" autoComplete="tel" className="input" />
          </div>
        )}
        <div>
          <label className="label" htmlFor="password">Password</label>
          <input id="password" name="password" type="password" required minLength={isLogin ? 1 : 8} autoComplete={isLogin ? "current-password" : "new-password"} className="input" />
        </div>
        {state?.error && <p role="alert" className="rounded-sm bg-red-50 p-2 text-sm text-red-700">{state.error}</p>}
        <p className="text-xs text-gray-500">By continuing, you agree to our Terms of Use and Privacy Policy.</p>
        <button disabled={pending} className="btn-buy py-3">{pending ? "Please wait…" : isLogin ? "Login" : "Continue"}</button>
        <p className="mt-auto text-center text-sm">
          {isLogin ? (
            <Link href={`/register${q}`} className="font-semibold text-brand">New to ShopKart? Create an account</Link>
          ) : (
            <Link href={`/login${q}`} className="font-semibold text-brand">Existing user? Log in</Link>
          )}
        </p>
        {isLogin && <p className="text-center text-xs text-gray-400">Demo: customer@shopkart.dev / Customer@123</p>}
      </form>
    </div>
  );
}
