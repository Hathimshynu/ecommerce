"use client";

import { useActionState } from "react";
import { changePasswordAction, updateProfileAction, type FormState } from "@/app/actions/auth";

function Status({ state }: { state: FormState }) {
  if (state?.error) return <p role="alert" className="text-sm text-red-600">{state.error}</p>;
  if (state?.message) return <p role="status" className="text-sm text-success">{state.message}</p>;
  return null;
}

export function ProfileForm({ name, phone }: { name: string; phone: string | null }) {
  const [state, action, pending] = useActionState(updateProfileAction, undefined);
  return (
    <form action={action} className="card space-y-3 p-5">
      <h2 className="font-semibold">Personal information</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="name">Full name</label>
          <input id="name" name="name" required defaultValue={name} autoComplete="name" className="input" />
        </div>
        <div>
          <label className="label" htmlFor="phone">Mobile number</label>
          <input id="phone" name="phone" type="tel" defaultValue={phone ?? ""} autoComplete="tel" className="input" />
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button disabled={pending} className="btn-primary">{pending ? "Saving…" : "Save"}</button>
        <Status state={state} />
      </div>
    </form>
  );
}

export function PasswordForm() {
  const [state, action, pending] = useActionState(changePasswordAction, undefined);
  return (
    <form action={action} key={state?.ok ? "done" : "form"} className="card space-y-3 p-5">
      <h2 className="font-semibold">Change password</h2>
      <div className="grid gap-3 sm:grid-cols-3">
        <div>
          <label className="label" htmlFor="current">Current password</label>
          <input id="current" name="current" type="password" required autoComplete="current-password" className="input" />
        </div>
        <div>
          <label className="label" htmlFor="password">New password</label>
          <input id="password" name="password" type="password" required minLength={8} autoComplete="new-password" className="input" />
        </div>
        <div>
          <label className="label" htmlFor="confirm">Confirm new password</label>
          <input id="confirm" name="confirm" type="password" required minLength={8} autoComplete="new-password" className="input" />
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button disabled={pending} className="btn-outline">{pending ? "Updating…" : "Update password"}</button>
        <Status state={state} />
      </div>
    </form>
  );
}
