import Image from "next/image";
import Link from "next/link";
import { getCategories } from "@/lib/catalog";

export async function CategoryBar() {
  const categories = await getCategories().catch(() => []);
  if (!categories.length) return null;
  return (
    <nav aria-label="Categories" className="bg-white shadow-sm">
      <ul className="scrollbar-none mx-auto flex max-w-7xl gap-6 overflow-x-auto px-4 py-3 md:justify-between">
        {categories.map((c) => (
          <li key={c.id} className="shrink-0">
            <Link href={`/c/${c.slug}`} className="group flex flex-col items-center gap-1 text-center">
              {c.image && (
                <Image src={c.image} alt="" width={56} height={56} className="h-14 w-14 rounded-full object-cover" />
              )}
              <span className="text-xs font-semibold text-gray-800 group-hover:text-brand sm:text-sm">{c.name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
