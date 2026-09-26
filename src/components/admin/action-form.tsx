"use client";

import { useActionState } from "react";
import type { AdminState } from "@/app/admin/actions";

/** Generic form wrapper for admin server actions that return { error | message }. */
export function ActionForm({
  action,
  children,
  submitLabel,
  className = "",
  submitClassName = "btn-primary",
  resetOnSuccess = false,
}: {
  action: (state: AdminState, fd: FormData) => Promise<AdminState>;
  children?: React.ReactNode;
  submitLabel: string;
  className?: string;
  submitClassName?: string;
  resetOnSuccess?: boolean;
}) {
  const [state, formAction, pending] = useActionState(action, undefined);
  return (
    <form
      action={formAction}
      className={className}
      key={resetOnSuccess && state?.message ? state.message + Date.now() : undefined}
    >
      {children}
      <div className="flex flex-wrap items-center gap-3">
        <button disabled={pending} className={submitClassName}>{pending ? "Working…" : submitLabel}</button>
        {state?.error && <span role="alert" className="text-sm text-red-600">{state.error}</span>}
        {state?.message && <span className="text-sm text-green-700">{state.message}</span>}
      </div>
    </form>
  );
}
