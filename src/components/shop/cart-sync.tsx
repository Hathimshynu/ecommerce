"use client";

import { useEffect, useRef, useState } from "react";
import { useCart } from "./cart-provider";

/** Re-validates the cart against live prices/stock once it has loaded, and lists what changed. */
export function CartSync() {
  const { ready, sync } = useCart();
  const [notes, setNotes] = useState<string[]>([]);
  const done = useRef(false);
  useEffect(() => {
    if (!ready || done.current) return;
    done.current = true;
    sync().then(setNotes);
  }, [ready, sync]);
  if (!notes.length) return null;
  return (
    <div role="status" className="rounded-sm border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">
      <ul className="list-disc space-y-0.5 pl-5">
        {notes.map((n) => <li key={n}>{n}</li>)}
      </ul>
    </div>
  );
}
