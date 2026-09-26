import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";

const secret = () => new TextEncoder().encode(process.env.JWT_SECRET ?? "");

async function valid(token: string | undefined, audience: string, role?: string) {
  if (!token) return false;
  try {
    const { payload } = await jwtVerify(token, secret(), { audience });
    return role ? payload.role === role : true;
  } catch {
    return false;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  if (pathname.startsWith("/admin")) {
    const ok = await valid(req.cookies.get("sk_admin")?.value, "admin", "admin");
    if (pathname === "/admin/login") {
      return ok ? NextResponse.redirect(new URL("/admin", req.url)) : NextResponse.next();
    }
    if (!ok) return NextResponse.redirect(new URL("/admin/login", req.url));
    return NextResponse.next();
  }

  // Customer-only areas
  const ok = await valid(req.cookies.get("sk_session")?.value, "shop");
  if (!ok) {
    const url = new URL("/login", req.url);
    url.searchParams.set("next", pathname + search);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/checkout/:path*", "/orders/:path*", "/account/:path*", "/wishlist/:path*"],
};
