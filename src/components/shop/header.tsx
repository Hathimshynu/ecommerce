import Link from "next/link";
import { Suspense } from "react";
import { siteName } from "@/lib/format";
import { SearchBox } from "./search-box";
import { CartLink } from "./cart-link";
import { UserMenu } from "./user-menu";

/**
 * Header is fully static (no cookies read on the server) so every storefront page can be
 * statically generated / ISR cached. User-specific bits hydrate on the client.
 */
export function Header() {
  return (
    <header className="sticky top-0 z-40 bg-brand shadow">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-6 gap-y-2 px-3 py-2.5 sm:flex-nowrap sm:px-4">
        <Link href="/" className="flex shrink-0 flex-col leading-none text-white" aria-label={`${siteName()} home`}>
          <span className="text-xl font-bold italic tracking-tight">{siteName()}</span>
          <span className="text-[10px] italic text-accent">
            Explore <span className="font-semibold">Plus</span> ✦
          </span>
        </Link>
        <div className="order-3 w-full sm:order-none sm:max-w-xl sm:flex-1">
          <Suspense fallback={<div className="h-9 rounded-sm bg-white" />}>
            <SearchBox />
          </Suspense>
        </div>
        <nav className="ml-auto flex items-center gap-5 text-sm sm:gap-8">
          <UserMenu />
          <Link href="/admin" className="hidden font-semibold text-white md:inline" prefetch={false}>
            Become a Seller
          </Link>
          <CartLink />
        </nav>
      </div>
    </header>
  );
}
