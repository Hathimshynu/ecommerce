import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { db } from "@/db";
import { categories, products } from "@/db/schema";
import { PageHeader } from "@/components/admin/ui";
import { ProductForm } from "@/components/admin/product-form";

export const metadata = { title: "Edit product" };

export default async function EditProduct({ params }: { params: Promise<{ id: string }> }) {
  const id = Number((await params).id);
  if (!Number.isInteger(id)) notFound();
  const [[product], cats] = await Promise.all([
    db.select().from(products).where(eq(products.id, id)),
    db.select().from(categories).orderBy(categories.name),
  ]);
  if (!product) notFound();
  return (
    <>
      <PageHeader title={`Edit product #${product.id}`} />
      <ProductForm product={product} categories={cats} />
    </>
  );
}
