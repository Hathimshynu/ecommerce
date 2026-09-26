import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center">
      <p className="text-6xl font-bold text-brand">404</p>
      <h1 className="text-xl font-semibold">Unfortunately the page you are looking for has been moved or deleted</h1>
      <Link href="/" className="btn-primary">Go to homepage</Link>
    </main>
  );
}
