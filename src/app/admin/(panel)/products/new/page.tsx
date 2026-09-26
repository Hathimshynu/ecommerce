import { db } from "@/db";
import { categories } from "@/db/schema";
import { PageHeader } from "@/components/admin/ui";
import { ProductForm } from "@/components/admin/product-form";

export const metadata = { title: "Add product" };

export default async function NewProduct() {
  const cats = await db.select().from(categories).orderBy(categories.name);
  return (
    <>
      <PageHeader title="Add product" />
      <ProductForm categories={cats} />
    </>
  );
}
