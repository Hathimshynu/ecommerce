"use client";

import Image from "next/image";
import { useState } from "react";

export function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const [active, setActive] = useState(0);
  const list = images.length ? images : [];
  return (
    <div className="flex flex-col-reverse gap-3 sm:flex-row">
      <ul className="scrollbar-none flex gap-2 overflow-x-auto sm:flex-col">
        {list.map((src, i) => (
          <li key={src}>
            <button
              type="button"
              onMouseEnter={() => setActive(i)}
              onClick={() => setActive(i)}
              aria-label={`Show image ${i + 1}`}
              className={`relative block h-16 w-16 border-2 bg-white ${i === active ? "border-brand" : "border-gray-200"}`}
            >
              <Image src={src} alt="" fill sizes="64px" className="object-contain p-1" />
            </button>
          </li>
        ))}
      </ul>
      <div className="relative aspect-square w-full border border-gray-100 bg-white">
        {list[active] && (
          <Image
            src={list[active]}
            alt={name}
            fill
            priority
            fetchPriority="high"
            sizes="(max-width: 768px) 100vw, 40vw"
            className="object-contain"
          />
        )}
      </div>
    </div>
  );
}
