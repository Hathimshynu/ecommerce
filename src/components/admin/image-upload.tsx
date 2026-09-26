"use client";

import { useRef, useState } from "react";

/** Uploads selected images to /api/admin/uploads and reports the resulting URLs. */
export function UploadButton({ onUploaded, multiple = true }: { onUploaded: (urls: string[]) => void; multiple?: boolean }) {
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function upload(files: FileList | null) {
    if (!files?.length) return;
    setBusy(true);
    setError(null);
    const fd = new FormData();
    for (const f of Array.from(files)) fd.append("files", f);
    try {
      const res = await fetch("/api/admin/uploads", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Upload failed");
      onUploaded(data.urls);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
      if (input.current) input.current.value = "";
    }
  }

  return (
    <span className="inline-flex items-center gap-2">
      <input
        ref={input}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
        multiple={multiple}
        className="hidden"
        onChange={(e) => upload(e.target.files)}
      />
      <button type="button" disabled={busy} onClick={() => input.current?.click()} className="rounded border px-3 py-1.5 text-xs font-medium hover:bg-slate-50 disabled:opacity-50">
        {busy ? "Uploading…" : "⬆ Upload image" + (multiple ? "s" : "")}
      </button>
      {error && <span className="text-xs text-red-600">{error}</span>}
    </span>
  );
}

/** Text input for a single image reference with an upload shortcut (used in server-rendered admin forms). */
export function ImageField({ name, defaultValue = "", required = false }: { name: string; defaultValue?: string; required?: boolean }) {
  const [value, setValue] = useState(defaultValue);
  return (
    <div className="flex items-center gap-2">
      <input name={name} value={value} onChange={(e) => setValue(e.target.value)} required={required} placeholder="https://… or upload" className="input" />
      <UploadButton multiple={false} onUploaded={([url]) => setValue(url)} />
    </div>
  );
}
