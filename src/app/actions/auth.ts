"use server";

import { eq } from "drizzle-orm";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/db";
import { users } from "@/db/schema";
import { clearSessionCookie, getCurrentUser, hashPassword, setSessionCookie, verifyPassword } from "@/lib/auth";
import { rateLimit } from "@/lib/redis";

export type FormState = { error?: string; ok?: boolean; message?: string } | undefined;

const loginSchema = z.object({
  email: z.email("Enter a valid email").transform((v) => v.toLowerCase().trim()),
  password: z.string().min(1, "Password is required"),
});

const registerSchema = z.object({
  name: z.string().trim().min(2, "Name is too short").max(120),
  email: z.email("Enter a valid email").transform((v) => v.toLowerCase().trim()),
  phone: z
    .string()
    .trim()
    .regex(/^[0-9+\- ]{7,20}$/, "Enter a valid phone number")
    .optional()
    .or(z.literal("")),
  password: z.string().min(8, "Password must be at least 8 characters").max(128),
});

/** Only allow same-site relative redirects. */
const safeNext = (next: FormDataEntryValue | null) => {
  const v = typeof next === "string" ? next : "";
  return v.startsWith("/") && !v.startsWith("//") && !v.startsWith("/admin") ? v : "/";
};

async function clientIp() {
  const h = await headers();
  return h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "local";
}

async function setDisplayCookie(name: string) {
  (await cookies()).set("sk_user", name.split(" ")[0].slice(0, 30), {
    httpOnly: false,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

async function authenticate(formData: FormData, bucket: string) {
  const parsed = loginSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0].message } as const;
  const { email, password } = parsed.data;

  const rl = await rateLimit(`${bucket}:${await clientIp()}:${email}`, 8, 15 * 60);
  if (!rl.ok) return { error: "Too many login attempts. Please try again in 15 minutes." } as const;

  const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    return { error: "Invalid email or password" } as const;
  }
  return { user } as const;
}

export async function loginAction(_: FormState, formData: FormData): Promise<FormState> {
  const res = await authenticate(formData, "login");
  if ("error" in res) return { error: res.error };
  const { user } = res;
  await setSessionCookie({ id: user.id, name: user.name, email: user.email, role: user.role }, "shop");
  await setDisplayCookie(user.name);
  redirect(safeNext(formData.get("next")));
}

export async function registerAction(_: FormState, formData: FormData): Promise<FormState> {
  const parsed = registerSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const { name, email, phone, password } = parsed.data;

  const rl = await rateLimit(`register:${await clientIp()}`, 10, 60 * 60);
  if (!rl.ok) return { error: "Too many sign-ups from this network. Try again later." };

  const [existing] = await db.select({ id: users.id }).from(users).where(eq(users.email, email)).limit(1);
  if (existing) return { error: "An account with this email already exists" };

  const [user] = await db
    .insert(users)
    .values({ name, email, phone: phone || null, passwordHash: await hashPassword(password) })
    .returning();
  await setSessionCookie({ id: user.id, name: user.name, email: user.email, role: user.role }, "shop");
  await setDisplayCookie(user.name);
  redirect(safeNext(formData.get("next")));
}

export async function logoutAction() {
  await clearSessionCookie("shop");
  (await cookies()).delete("sk_user");
  redirect("/");
}

export async function adminLoginAction(_: FormState, formData: FormData): Promise<FormState> {
  const res = await authenticate(formData, "admin-login");
  if ("error" in res) return { error: res.error };
  const { user } = res;
  if (user.role !== "admin") return { error: "This account does not have admin access" };
  await setSessionCookie({ id: user.id, name: user.name, email: user.email, role: user.role }, "admin");
  redirect("/admin");
}

export async function adminLogoutAction() {
  await clearSessionCookie("admin");
  redirect("/admin/login");
}

const profileSchema = z.object({
  name: registerSchema.shape.name,
  phone: registerSchema.shape.phone,
});

export async function updateProfileAction(_: FormState, formData: FormData): Promise<FormState> {
  const session = await getCurrentUser();
  if (!session) redirect("/login?next=/account");
  const parsed = profileSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const { name, phone } = parsed.data;
  await db.update(users).set({ name, phone: phone || null }).where(eq(users.id, session.id));
  // Re-issue the session so the new name shows everywhere immediately.
  await setSessionCookie({ ...session, name }, "shop");
  await setDisplayCookie(name);
  revalidatePath("/account");
  return { ok: true, message: "Profile updated" };
}

const passwordSchema = z
  .object({
    current: z.string().min(1, "Enter your current password"),
    password: registerSchema.shape.password,
    confirm: z.string(),
  })
  .refine((d) => d.password === d.confirm, { message: "New passwords do not match", path: ["confirm"] });

export async function changePasswordAction(_: FormState, formData: FormData): Promise<FormState> {
  const session = await getCurrentUser();
  if (!session) redirect("/login?next=/account");
  const parsed = passwordSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const rl = await rateLimit(`pwchange:${session.id}`, 5, 15 * 60);
  if (!rl.ok) return { error: "Too many attempts. Try again later." };

  const [user] = await db.select().from(users).where(eq(users.id, session.id));
  if (!user || !(await verifyPassword(parsed.data.current, user.passwordHash))) {
    return { error: "Current password is incorrect" };
  }
  await db.update(users).set({ passwordHash: await hashPassword(parsed.data.password) }).where(eq(users.id, user.id));
  return { ok: true, message: "Password changed" };
}
