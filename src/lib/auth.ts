import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";

export type Role = "customer" | "admin";
export type SessionUser = { id: number; name: string; email: string; role: Role };

export const CUSTOMER_COOKIE = "sk_session";
export const ADMIN_COOKIE = "sk_admin";
const MAX_AGE = 60 * 60 * 24 * 7;

function secret() {
  const s = process.env.JWT_SECRET;
  if (!s || s.length < 32) throw new Error("JWT_SECRET must be set to at least 32 characters");
  return new TextEncoder().encode(s);
}

export async function signSession(user: SessionUser, audience: "shop" | "admin") {
  return new SignJWT({ name: user.name, email: user.email, role: user.role })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(String(user.id))
    .setAudience(audience)
    .setIssuedAt()
    .setExpirationTime(audience === "admin" ? "8h" : "7d")
    .sign(secret());
}

export async function verifySession(token: string | undefined, audience: "shop" | "admin"): Promise<SessionUser | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret(), { audience });
    return {
      id: Number(payload.sub),
      name: String(payload.name),
      email: String(payload.email),
      role: payload.role as Role,
    };
  } catch {
    return null;
  }
}

export async function setSessionCookie(user: SessionUser, audience: "shop" | "admin") {
  const token = await signSession(user, audience);
  (await cookies()).set(audience === "admin" ? ADMIN_COOKIE : CUSTOMER_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: audience === "admin" ? 60 * 60 * 8 : MAX_AGE,
  });
}

export async function clearSessionCookie(audience: "shop" | "admin") {
  (await cookies()).delete(audience === "admin" ? ADMIN_COOKIE : CUSTOMER_COOKIE);
}

/** Current storefront customer (memoised per request). */
export const getCurrentUser = cache(async () =>
  verifySession((await cookies()).get(CUSTOMER_COOKIE)?.value, "shop"),
);

export const getCurrentAdmin = cache(async () => {
  const user = await verifySession((await cookies()).get(ADMIN_COOKIE)?.value, "admin");
  return user?.role === "admin" ? user : null;
});

export async function requireUser(next = "/") {
  const user = await getCurrentUser();
  if (!user) redirect(`/login?next=${encodeURIComponent(next)}`);
  return user;
}

export async function requireAdmin() {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");
  return admin;
}

export const hashPassword = (password: string) => bcrypt.hash(password, 10);
export const verifyPassword = (password: string, hash: string) => bcrypt.compare(password, hash);
