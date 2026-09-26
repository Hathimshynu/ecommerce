import type { Metadata } from "next";
import Link from "next/link";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { products, wishlist } from "@/db/schema";
import { requireUser } from "@/lib/auth";
import { ProductCard } from "@/components/shop/product-card";

export const metadata: Metadata = { title: "My Wishlist", robots: { index: false } };

export default async function WishlistPage() {
  const user = await requireUser("/wishlist");
  const rows = await db
    .select({
      id: products.id,
      name: products.name,
      slug: products.slug,
      brand: products.brand,
      price: products.price,
      mrp: products.mrp,
      rating: products.rating,
      ratingCount: products.ratingCount,
      stock: products.stock,
      images: products.images,
    })
    .from(wishlist)
    .innerJoin(products, eq(wishlist.productId, products.id))
    .where(eq(wishlist.userId, user.id))
    .orderBy(desc(wishlist.createdAt));

  return (
    <div className="mx-auto max-w-7xl p-2 sm:p-3">
      <section className="card">
        <h1 className="border-b px-6 py-4 text-lg font-semibold">My Wishlist ({rows.length})</h1>
        {rows.length ? (
          <ul className="grid grid-cols-2 gap-px bg-gray-100 sm:grid-cols-3 lg:grid-cols-5">
            {rows.map(({ images, ...p }) => (
              <li key={p.id}><ProductCard product={{ ...p, image: images[0] ?? null }} /></li>
            ))}
          </ul>
        ) : (
          <div className="p-12 text-center">
            <p className="mb-4">Your wishlist is empty.</p>
            <Link href="/" className="btn-primary">Explore products</Link>
          </div>
        )}
      </section>
    </div>
  );
}
