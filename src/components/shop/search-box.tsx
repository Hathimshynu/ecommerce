"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";

export function SearchBox() {
  const router = useRouter();
  const params = useSearchParams();
  const [q, setQ] = useState(params.get("q") ?? "");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const listId = useId();
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => setQ(params.get("q") ?? ""), [params]);

  useEffect(() => {
    const term = q.trim();
    if (term.length < 2) {
      setSuggestions([]);
      return;
    }
    const t = setTimeout(async () => {
      abortRef.current?.abort();
      const ctrl = new AbortController();
      abortRef.current = ctrl;
      try {
        const res = await fetch(`/api/search/suggest?q=${encodeURIComponent(term)}`, { signal: ctrl.signal });
        if (res.ok) setSuggestions((await res.json()).suggestions ?? []);
      } catch {
        /* aborted */
      }
    }, 150);
    return () => clearTimeout(t);
  }, [q]);

  const go = (term: string) => {
    setOpen(false);
    const v = term.trim();
    router.push(v ? `/search?q=${encodeURIComponent(v)}` : "/search");
  };

  return (
    <form
      role="search"
      className="relative w-full"
      onSubmit={(e) => {
        e.preventDefault();
        go(active >= 0 ? suggestions[active] : q);
      }}
    >
      <input
        type="search"
        name="q"
        value={q}
        onChange={(e) => {
          setQ(e.target.value);
          setOpen(true);
          setActive(-1);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown") setActive((a) => Math.min(a + 1, suggestions.length - 1));
          else if (e.key === "ArrowUp") setActive((a) => Math.max(a - 1, -1));
          else if (e.key === "Escape") setOpen(false);
        }}
        placeholder="Search for products, brands and more"
        aria-label="Search products"
        aria-autocomplete="list"
        aria-controls={listId}
        aria-expanded={open && suggestions.length > 0}
        role="combobox"
        autoComplete="off"
        className="w-full rounded-sm bg-white py-2 pl-4 pr-10 text-sm text-gray-900 shadow outline-none placeholder:text-gray-500"
      />
      <button type="submit" aria-label="Search" className="absolute right-0 top-0 h-full px-3 text-brand">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
      </button>
      {open && suggestions.length > 0 && (
        <ul id={listId} role="listbox" className="absolute left-0 right-0 top-full z-50 mt-0.5 overflow-hidden rounded-b-sm bg-white text-sm text-gray-900 shadow-lg">
          {suggestions.map((s, i) => (
            <li key={s} role="option" aria-selected={i === active}>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => go(s)}
                className={`flex w-full items-center gap-3 px-4 py-2 text-left hover:bg-blue-50 ${i === active ? "bg-blue-50" : ""}`}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2.5">
                  <circle cx="11" cy="11" r="7" />
                  <path d="m20 20-3.5-3.5" />
                </svg>
                <span className="truncate">{s}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </form>
  );
}
