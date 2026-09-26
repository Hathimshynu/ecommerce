import type { Metadata } from "next";
import { AdminLoginForm } from "./form";

export const metadata: Metadata = { title: "Admin Login", robots: { index: false, follow: false } };

export default function AdminLoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-900 p-4">
      <AdminLoginForm />
    </main>
  );
}
