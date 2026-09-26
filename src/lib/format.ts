const inr = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });

export const formatPrice = (value: number) => inr.format(value);

export const discountPercent = (price: number, mrp: number) =>
  mrp > price && mrp > 0 ? Math.round(((mrp - price) / mrp) * 100) : 0;

export function slugify(input: string) {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 200);
}

export const formatDate = (d: Date | string) =>
  new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" }).format(new Date(d));

export const siteUrl = () => (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
export const siteName = () => process.env.NEXT_PUBLIC_SITE_NAME ?? "ShopKart";
