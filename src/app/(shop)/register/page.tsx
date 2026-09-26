import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { AuthForm } from "@/components/shop/auth-form";

export const metadata: Metadata = { title: "Sign Up", robots: { index: false } };

export default async function Page({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams;
  if (await getCurrentUser()) redirect(next?.startsWith("/") && !next.startsWith("//") ? next : "/");
  return <AuthForm mode="register" next={next} />;
}
