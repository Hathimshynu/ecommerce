"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { logoutAction } from "@/app/actions/auth";

/** Reads the non-sensitive display-name cookie set at login (the session itself is httpOnly). */
function readName() {
  const m = document.cookie.match(/(?:^|; )sk_user=([^;]*)/);
  return m ? decodeURIComponent(m[1]) : null;
}

export function UserMenu() {
  const [name, setName] = useState<string | null | undefined>(undefined);
  const pathname = usePathname();
  // Re-read on every navigation: login/logout happen via server-action redirects that keep this layout mounted.
  useEffect(() => setName(readName()), [pathname]);

  if (name === undefined) return <span className="inline-block h-7 w-20" aria-hidden />;
  if (!name)
    return (
      <Link href="/login" className="rounded-sm bg-white px-6 py-1 font-semibold text-brand sm:px-10">
        Login
      </Link>
    );

  return (
    <div className="group relative">
      <button className="flex items-center gap-1 font-semibold text-white">
        {name}
        <svg width="10" height="10" viewBox="0 0 10 6" fill="currentColor" aria-hidden>
          <path d="M0 0h10L5 6z" />
        </svg>
      </button>
      <div className="invisible absolute right-0 top-full z-50 pt-2 opacity-0 transition group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
        <ul className="w-48 rounded-sm bg-white py-1 text-gray-800 shadow-lg">
          <li><Link className="block px-4 py-2 hover:bg-gray-50" href="/account">My Profile</Link></li>
          <li><Link className="block px-4 py-2 hover:bg-gray-50" href="/orders">Orders</Link></li>
          <li><Link className="block px-4 py-2 hover:bg-gray-50" href="/wishlist">Wishlist</Link></li>
          <li>
            <form action={logoutAction}>
              <button className="block w-full px-4 py-2 text-left hover:bg-gray-50">Logout</button>
            </form>
          </li>
        </ul>
      </div>
    </div>
  );
}
