"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

type Banner = { id: number; title: string; subtitle: string | null; image: string; link: string };

export function BannerCarousel({ banners }: { banners: Banner[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const n = banners.length;

  useEffect(() => {
    if (n < 2 || paused) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % n), 5000);
    return () => clearInterval(t);
  }, [n, paused]);

  if (!n) return null;
  return (
    <section
      aria-roledescription="carousel"
      aria-label="Offers"
      className="relative overflow-hidden bg-white"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="flex transition-transform duration-500" style={{ transform: `translateX(-${index * 100}%)` }}>
        {banners.map((b, i) => (
          <Link
            key={b.id}
            href={b.link}
            className="relative block aspect-[4/1] w-full shrink-0 min-h-36"
            aria-hidden={i !== index}
            tabIndex={i === index ? 0 : -1}
          >
            <Image
              src={b.image}
              alt={b.title}
              fill
              sizes="100vw"
              priority={i === 0}
              fetchPriority={i === 0 ? "high" : "auto"}
              className="object-cover"
            />
            <div className="absolute inset-0 flex flex-col justify-center bg-gradient-to-r from-black/60 via-black/20 to-transparent px-8 text-white sm:px-16">
              <p className="text-2xl font-bold sm:text-4xl">{b.title}</p>
              {b.subtitle && <p className="mt-2 text-sm sm:text-lg">{b.subtitle}</p>}
              <span className="mt-4 w-fit rounded-sm bg-white px-4 py-1.5 text-xs font-semibold uppercase text-brand">Shop now</span>
            </div>
          </Link>
        ))}
      </div>
      {n > 1 && (
        <>
          <button
            aria-label="Previous slide"
            onClick={() => setIndex((i) => (i - 1 + n) % n)}
            className="absolute left-0 top-1/2 -translate-y-1/2 rounded-r bg-white/90 px-2 py-6 shadow"
          >
            ‹
          </button>
          <button
            aria-label="Next slide"
            onClick={() => setIndex((i) => (i + 1) % n)}
            className="absolute right-0 top-1/2 -translate-y-1/2 rounded-l bg-white/90 px-2 py-6 shadow"
          >
            ›
          </button>
          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
            {banners.map((b, i) => (
              <button
                key={b.id}
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => setIndex(i)}
                className={`h-1.5 rounded-full transition-all ${i === index ? "w-5 bg-white" : "w-1.5 bg-white/60"}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
