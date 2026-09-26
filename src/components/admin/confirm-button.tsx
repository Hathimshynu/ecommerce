"use client";

import { useFormStatus } from "react-dom";

export function ConfirmButton({ message, className, children }: { message: string; className?: string; children: React.ReactNode }) {
  const { pending } = useFormStatus();
  return (
    <button
      disabled={pending}
      className={className}
      onClick={(e) => {
        if (!confirm(message)) e.preventDefault();
      }}
    >
      {pending ? "…" : children}
    </button>
  );
}
