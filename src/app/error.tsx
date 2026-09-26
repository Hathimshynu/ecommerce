"use client";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center gap-4 p-6 text-center">
      <h1 className="text-xl font-semibold">Something went wrong</h1>
      <p className="text-sm text-gray-500">Please try again in a moment.</p>
      <button onClick={reset} className="btn-primary">Try again</button>
    </main>
  );
}
