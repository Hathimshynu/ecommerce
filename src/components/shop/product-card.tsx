import Image from "next/image";
import Link from "next/link";
import { discountPercent, formatPrice } from "@/lib/format";
import type { ProductCardData } from "@/lib/search-types";
import { RatingBadge } from "./rating";

export function ProductCard({ product, priority = false }: { product: ProductCardData; priority?: boolean }) {
  const off = discountPercent(product.price, product.mrp);
  return (
    <Link
      href={`/p/${product.slug}`}
      className="group flex h-full flex-col bg-white p-4 transition hover:shadow-[0_3px_16px_rgba(0,0,0,0.11)]"
    >
      <div className="relative mx-auto aspect-square w-full max-w-[220px] overflow-hidden">
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 45vw, (max-width: 1024px) 25vw, 220px"
            className="object-contain transition group-hover:scale-[1.03]"
            priority={priority}
          />
        ) : (
          <div className="h-full w-full bg-gray-100" />
        )}
      </div>
      <div className="mt-3 flex flex-1 flex-col gap-1">
        <p className="text-xs text-gray-500">{product.brand}</p>
        <h3 className="line-clamp-2 text-sm text-gray-900 group-hover:text-brand">{product.name}</h3>
        <div className="flex items-center gap-2">
          <RatingBadge rating={product.rating} />
          <span className="text-xs text-gray-500">({product.ratingCount.toLocaleString("en-IN")})</span>
        </div>
        <div className="mt-auto flex flex-wrap items-baseline gap-x-2 pt-1">
          <span className="text-base font-semibold">{formatPrice(product.price)}</span>
          {off > 0 && (
            <>
              <span className="text-xs text-gray-500 line-through">{formatPrice(product.mrp)}</span>
              <span className="text-xs font-semibold text-success">{off}% off</span>
            </>
          )}
        </div>
        {product.stock <= 0 && <span className="text-xs font-semibold text-red-600">Out of stock</span>}
      </div>
    </Link>
  );
}

export function ProductRail({
  title,
  href,
  products,
}: {
  title: string;
  href?: string;
  products: ProductCardData[];
}) {
  if (!products.length) return null;
  return (
    <section className="card">
      <div className="flex items-center justify-between border-b px-4 py-3">
        <h2 className="text-lg font-semibold sm:text-xl">{title}</h2>
        {href && (
          <Link href={href} className="btn-primary rounded-sm px-4 py-1.5 text-xs">
            View all
          </Link>
        )}
      </div>
      <ul className="scrollbar-none flex snap-x overflow-x-auto">
        {products.map((p) => (
          <li key={p.id} className="w-44 shrink-0 snap-start sm:w-52">
            <ProductCard product={p} />
          </li>
        ))}
      </ul>
    </section>
  );
}

export function ProductRailSkeleton() {
  return (
    <div className="card animate-pulse p-4">
      <div className="mb-4 h-6 w-48 rounded bg-gray-200" />
      <div className="flex gap-4 overflow-hidden">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-60 w-44 shrink-0 rounded bg-gray-100" />
        ))}
      </div>
    </div>
  );
}
