import "dotenv/config";
import bcrypt from "bcryptjs";
import { sql } from "drizzle-orm";
import { db, pool } from "../src/db";
import { banners, categories, products, reviews, users, type NewProduct } from "../src/db/schema";
import { slugify } from "../src/lib/format";
import { reindexAllProducts } from "../src/lib/indexing";
import { flushAppCache, getRedis } from "../src/lib/redis";

const img = (seed: string, w = 600, h = 600) => `https://picsum.photos/seed/${seed}/${w}/${h}`;

type Tpl = {
  category: { name: string; description: string };
  brands: string[];
  items: { name: string; price: [number, number]; highlights: string[]; specs: Record<string, string> }[];
};

const catalog: Tpl[] = [
  {
    category: { name: "Mobiles", description: "Latest smartphones with the best offers" },
    brands: ["Samsung", "Apple", "OnePlus", "Xiaomi", "Realme", "Google"],
    items: [
      { name: "5G Smartphone (8GB RAM, 128GB)", price: [15999, 34999], highlights: ["8 GB RAM | 128 GB ROM", "6.7 inch Full HD+ AMOLED Display", "50MP + 8MP | 16MP Front Camera", "5000 mAh Battery"], specs: { RAM: "8 GB", Storage: "128 GB", Display: "6.7 inch AMOLED", Battery: "5000 mAh", Network: "5G" } },
      { name: "Pro Max (12GB RAM, 256GB)", price: [44999, 139999], highlights: ["12 GB RAM | 256 GB ROM", "6.8 inch QHD+ Display", "200MP Triple Camera", "Fast Charging 65W"], specs: { RAM: "12 GB", Storage: "256 GB", Display: "6.8 inch QHD+", Battery: "5000 mAh", Network: "5G" } },
      { name: "Lite 4G (4GB RAM, 64GB)", price: [7999, 11999], highlights: ["4 GB RAM | 64 GB ROM", "6.5 inch HD+ Display", "13MP Dual Camera", "5000 mAh Battery"], specs: { RAM: "4 GB", Storage: "64 GB", Display: "6.5 inch HD+", Battery: "5000 mAh", Network: "4G" } },
    ],
  },
  {
    category: { name: "Laptops", description: "Laptops for work, study and gaming" },
    brands: ["HP", "Dell", "Lenovo", "ASUS", "Acer", "Apple"],
    items: [
      { name: "Thin & Light Laptop Intel Core i5 13th Gen (16GB/512GB SSD)", price: [52990, 74990], highlights: ["Intel Core i5 13th Gen", "16 GB DDR4 RAM", "512 GB SSD", "15.6 inch Full HD Display"], specs: { Processor: "Intel Core i5", RAM: "16 GB", Storage: "512 GB SSD", Display: "15.6 inch FHD", OS: "Windows 11" } },
      { name: "Gaming Laptop Ryzen 7 RTX 4060 (16GB/1TB SSD)", price: [79990, 124990], highlights: ["AMD Ryzen 7 7840HS", "NVIDIA RTX 4060 8GB", "144Hz Display", "1 TB SSD"], specs: { Processor: "AMD Ryzen 7", GPU: "RTX 4060", RAM: "16 GB", Storage: "1 TB SSD", Display: "15.6 inch 144Hz" } },
    ],
  },
  {
    category: { name: "Electronics", description: "Headphones, speakers, smartwatches and more" },
    brands: ["boAt", "Sony", "JBL", "Noise", "Bose"],
    items: [
      { name: "Bluetooth Truly Wireless Earbuds with ANC", price: [1299, 19990], highlights: ["Active Noise Cancellation", "Up to 40 hours playback", "IPX5 water resistant", "Fast charging"], specs: { Type: "TWS", Connectivity: "Bluetooth 5.3", Battery: "40 hours", ANC: "Yes" } },
      { name: "Over-Ear Wireless Headphones", price: [1999, 29990], highlights: ["40mm dynamic drivers", "Up to 60 hours playback", "Built-in mic", "Foldable design"], specs: { Type: "Over-ear", Connectivity: "Bluetooth 5.2", Battery: "60 hours" } },
      { name: "Smartwatch with 1.96\" AMOLED Display", price: [1499, 24999], highlights: ["1.96 inch AMOLED", "Bluetooth calling", "100+ sports modes", "7 day battery"], specs: { Display: "1.96 inch AMOLED", Battery: "7 days", "Water Resistance": "IP68" } },
      { name: "Portable Bluetooth Speaker 20W", price: [1799, 14999], highlights: ["20W output", "12 hours playback", "IP67 waterproof", "PartyBoost"], specs: { Output: "20 W", Battery: "12 hours", Waterproof: "IP67" } },
    ],
  },
  {
    category: { name: "Fashion", description: "Clothing, footwear and accessories" },
    brands: ["Puma", "Nike", "Adidas", "Levi's", "Roadster", "Allen Solly"],
    items: [
      { name: "Men Regular Fit Solid Casual Shirt", price: [599, 2499], highlights: ["100% Cotton", "Regular fit", "Machine wash"], specs: { Fabric: "Cotton", Fit: "Regular", Sleeve: "Full" } },
      { name: "Running Shoes For Men", price: [1499, 8999], highlights: ["Lightweight mesh upper", "Cushioned sole", "Lace-up"], specs: { Type: "Running", Material: "Mesh", Sole: "Rubber" } },
      { name: "Women Slim Fit Jeans", price: [899, 3499], highlights: ["Stretchable denim", "Mid rise", "Slim fit"], specs: { Fabric: "Denim", Fit: "Slim", Rise: "Mid" } },
      { name: "Unisex Graphic Print T-Shirt", price: [399, 1499], highlights: ["Pure cotton", "Round neck", "Half sleeve"], specs: { Fabric: "Cotton", Neck: "Round", Sleeve: "Half" } },
    ],
  },
  {
    category: { name: "Home & Kitchen", description: "Cookware, furniture and home essentials" },
    brands: ["Prestige", "Pigeon", "Milton", "Wakefit", "Solimo"],
    items: [
      { name: "Non-Stick Cookware Set (3 Pieces)", price: [999, 3499], highlights: ["Induction compatible", "PFOA free coating", "Toughened glass lid"], specs: { Material: "Aluminium", Pieces: "3", Induction: "Yes" } },
      { name: "Stainless Steel Water Bottle 1L", price: [299, 999], highlights: ["Hot & cold 24 hours", "Leak proof", "BPA free"], specs: { Capacity: "1 L", Material: "Stainless Steel" } },
      { name: "Orthopaedic Memory Foam Mattress (Queen)", price: [8999, 24999], highlights: ["Memory foam", "Medium firm", "10 year warranty"], specs: { Size: "Queen", Thickness: "6 inch", Warranty: "10 years" } },
    ],
  },
  {
    category: { name: "Appliances", description: "TVs, refrigerators, washing machines and more" },
    brands: ["LG", "Samsung", "Whirlpool", "Sony", "Mi"],
    items: [
      { name: "108 cm (43 inch) 4K Ultra HD Smart LED TV", price: [21999, 49999], highlights: ["4K Ultra HD", "Google TV", "Dolby Audio", "3 HDMI ports"], specs: { "Screen Size": "43 inch", Resolution: "4K UHD", "Smart TV": "Yes" } },
      { name: "7 kg Fully Automatic Front Load Washing Machine", price: [24990, 42990], highlights: ["Inverter motor", "In-built heater", "1200 RPM"], specs: { Capacity: "7 kg", Type: "Front Load", "Energy Rating": "5 Star" } },
      { name: "260 L Frost Free Double Door Refrigerator", price: [22990, 34990], highlights: ["Inverter compressor", "Convertible", "3 Star"], specs: { Capacity: "260 L", Type: "Double Door", "Energy Rating": "3 Star" } },
    ],
  },
  {
    category: { name: "Books", description: "Bestsellers, fiction, and non-fiction" },
    brands: ["Penguin", "HarperCollins", "O'Reilly", "Bloomsbury"],
    items: [
      { name: "Atomic Habits (Paperback)", price: [399, 699], highlights: ["Language: English", "Binding: Paperback", "Self-help"], specs: { Language: "English", Binding: "Paperback", Genre: "Self-help" } },
      { name: "Designing Data-Intensive Applications", price: [1499, 2999], highlights: ["Language: English", "Binding: Paperback", "Technology"], specs: { Language: "English", Binding: "Paperback", Genre: "Technology" } },
    ],
  },
  {
    category: { name: "Beauty", description: "Skincare, makeup and grooming" },
    brands: ["Lakme", "Nivea", "Mamaearth", "Philips", "The Derma Co"],
    items: [
      { name: "Vitamin C Face Serum 30ml", price: [349, 899], highlights: ["Brightens skin", "Dermatologically tested", "For all skin types"], specs: { Quantity: "30 ml", "Skin Type": "All" } },
      { name: "Cordless Beard Trimmer", price: [999, 2999], highlights: ["60 min runtime", "20 length settings", "Stainless steel blades"], specs: { Runtime: "60 min", Settings: "20" } },
    ],
  },
  {
    category: { name: "Sports", description: "Fitness equipment and sportswear" },
    brands: ["Decathlon", "Nivia", "Cosco", "Boldfit"],
    items: [
      { name: "Anti-Skid Yoga Mat 6mm", price: [399, 1499], highlights: ["6mm thickness", "Anti-skid", "Carry strap included"], specs: { Thickness: "6 mm", Material: "TPE" } },
      { name: "Adjustable Dumbbells Set 20kg", price: [1999, 5999], highlights: ["Adjustable plates", "Chrome handle", "Home gym"], specs: { Weight: "20 kg", Material: "Cast iron" } },
    ],
  },
  {
    category: { name: "Toys", description: "Toys, games and baby products" },
    brands: ["LEGO", "Funskool", "Hot Wheels", "Mattel"],
    items: [
      { name: "Building Blocks Creative Set (500 Pieces)", price: [999, 4999], highlights: ["500 pieces", "Ages 6+", "Improves creativity"], specs: { Pieces: "500", Age: "6+" } },
      { name: "Remote Control Racing Car", price: [799, 2999], highlights: ["2.4 GHz remote", "Rechargeable battery", "High speed"], specs: { Battery: "Rechargeable", Range: "30 m" } },
    ],
  },
];

// Deterministic pseudo-random so re-seeding produces the same catalog.
let s = 42;
const rand = () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646;
const between = (min: number, max: number) => Math.round(min + rand() * (max - min));
const round99 = (n: number) => Math.max(99, Math.round(n / 100) * 100 - 1);

async function main() {
  console.log("Seeding database…");
  await db.execute(sql`TRUNCATE reviews, order_items, orders, wishlist, products, categories, banners, users RESTART IDENTITY CASCADE`);

  const adminEmail = process.env.ADMIN_EMAIL ?? "admin@shopkart.dev";
  const adminPassword = process.env.ADMIN_PASSWORD ?? "Admin@12345";
  const [, customer] = await db
    .insert(users)
    .values([
      { name: "Store Admin", email: adminEmail, passwordHash: await bcrypt.hash(adminPassword, 10), role: "admin" },
      { name: "Demo Customer", email: "customer@shopkart.dev", passwordHash: await bcrypt.hash("Customer@123", 10), role: "customer" },
    ])
    .returning();

  const reviewers = await db
    .insert(users)
    .values(
      await Promise.all(
        ["Aarav Sharma", "Priya Nair", "Rohan Gupta", "Ananya Iyer", "Vikram Singh"].map(async (name, i) => ({
          name,
          email: `reviewer${i + 1}@shopkart.dev`,
          passwordHash: await bcrypt.hash("Reviewer@123", 10),
        })),
      ),
    )
    .returning();

  const cats = await db
    .insert(categories)
    .values(
      catalog.map((c, i) => ({
        name: c.category.name,
        slug: slugify(c.category.name),
        description: c.category.description,
        image: img(`cat-${slugify(c.category.name)}`, 200, 200),
        sortOrder: i,
      })),
    )
    .returning();

  const rows: NewProduct[] = [];
  catalog.forEach((tpl, ci) => {
    for (const brand of tpl.brands) {
      for (const item of tpl.items) {
        if (rand() < 0.25) continue; // not every brand sells every item
        const mrp = round99(between(item.price[0], item.price[1]) * (1.1 + rand() * 0.6));
        const price = round99(mrp * (0.45 + rand() * 0.5));
        const name = `${brand} ${item.name}`;
        const slug = slugify(name);
        rows.push({
          name,
          slug,
          brand,
          categoryId: cats[ci].id,
          description: `${name} — ${item.highlights.join(". ")}. Genuine ${brand} product with brand warranty, 7 day replacement policy and free delivery on eligible orders.`,
          price: Math.min(price, mrp),
          mrp,
          stock: rand() < 0.08 ? 0 : between(5, 250),
          images: [1, 2, 3, 4].map((n) => img(`${slug}-${n}`)),
          highlights: item.highlights,
          specs: { Brand: brand, ...item.specs, Warranty: "1 Year Manufacturer Warranty" },
          rating: 0,
          ratingCount: between(40, 25000),
          isFeatured: rand() < 0.2,
        });
      }
    }
  });
  const inserted = await db.insert(products).values(rows).returning({ id: products.id });

  const comments = [
    ["Excellent product", "Totally worth the money. Quality is great and delivery was quick."],
    ["Value for money", "Good product at this price point. Would recommend."],
    ["Nice", "Works as expected. Packaging could be better."],
    ["Average", "It's okay, not the best but does the job."],
    ["Loved it!", "Superb quality, exceeded my expectations."],
  ];
  const reviewRows = inserted.flatMap((p) =>
    reviewers
      .filter(() => rand() < 0.6)
      .map((u) => {
        const rating = Math.min(5, Math.max(2, Math.round(3.2 + rand() * 2)));
        const [title, comment] = comments[5 - rating] ?? comments[0];
        return { productId: p.id, userId: u.id, rating, title, comment };
      }),
  );
  if (reviewRows.length) await db.insert(reviews).values(reviewRows);

  // Blend real reviews with a synthetic historical baseline so listings look realistic.
  await db.execute(sql`
    UPDATE products p SET rating = round((coalesce(r.avg, 4.1) * 0.7 + (3.6 + random() * 1.3) * 0.3)::numeric, 1)
    FROM (SELECT p2.id, avg(r.rating)::float AS avg FROM products p2 LEFT JOIN reviews r ON r.product_id = p2.id GROUP BY p2.id) r
    WHERE r.id = p.id`);

  await db.insert(banners).values([
    { title: "Big Billion Deals", subtitle: "Up to 80% off on top brands", image: img("banner-sale", 1600, 400), link: "/search?sort=discount", sortOrder: 0 },
    { title: "Latest Smartphones", subtitle: "Exchange offers & no-cost EMI", image: img("banner-mobiles", 1600, 400), link: "/c/mobiles", sortOrder: 1 },
    { title: "Laptops for Everyone", subtitle: "Starting ₹29,999", image: img("banner-laptops", 1600, 400), link: "/c/laptops", sortOrder: 2 },
    { title: "Fashion Carnival", subtitle: "Min. 50% off", image: img("banner-fashion", 1600, 400), link: "/c/fashion", sortOrder: 3 },
  ]);

  console.log(`✔ ${cats.length} categories, ${inserted.length} products, ${reviewRows.length} reviews`);
  console.log(`✔ admin: ${adminEmail} / ${adminPassword}`);
  console.log(`✔ customer: ${customer.email} / Customer@123`);

  try {
    const n = await reindexAllProducts();
    console.log(`✔ indexed ${n} products in Elasticsearch`);
  } catch (e) {
    console.warn(`⚠ Elasticsearch indexing skipped (${(e as Error).message}). Search will use PostgreSQL until you run "npm run search:reindex".`);
  }

  await new Promise((r) => setTimeout(r, 300));
  await flushAppCache();
  getRedis()?.disconnect();
  await pool.end();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
