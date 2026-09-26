# ShopKart — Next.js E‑commerce (Flipkart‑style)

A full‑stack, SEO‑friendly e‑commerce store built with **Next.js 15 (App Router) + React 19**, **PostgreSQL (Drizzle ORM)**, **Redis** caching and **Elasticsearch** product search, with a separate **admin dashboard** (own login) for managing the catalog and orders.

## Features

### Storefront
- Home page with banner carousel, category strip, *Top Deals*, *Suggested For You* and per‑category product rails (streamed with `Suspense`).
- Category pages (`/c/[slug]`) and search (`/search`) with **faceted filters** — category, brand, price range, rating, in‑stock — and sorting (relevance, popularity, price, newest, discount) plus pagination. Filters are plain links/GET forms, so they work without JavaScript.
- **Search‑as‑you‑type autocomplete** (Elasticsearch completion + edge‑ngram, debounced, keyboard accessible).
- Product page: image gallery, price/MRP/discount, offers, highlights, specifications, ratings & reviews (write a review when logged in), similar products, wishlist.
- Cart (persisted in `localStorage`, synced across tabs), checkout with address + payment method (UPI / Card / COD — online payments are simulated), order confirmation, **order tracking timeline**, cancel order, order history.
- Customer auth (register / login / logout), account page, wishlist.

### Admin dashboard (`/admin`)
- Separate login at `/admin/login` with its own cookie/JWT audience — customer sessions can't access it, and middleware guards every `/admin` route.
- Dashboard: revenue, orders, products, customers, 14‑day sales chart, orders by status, recent orders, low‑stock alerts, service health (Postgres/Redis/Elasticsearch).
- Products: list/search/filter, **add / edit / delete**, show/hide, featured flag, images, highlights, specs, SEO slug.
- Categories, homepage banners, orders (update status → customer sees tracking update), customers list.
- *Search & Cache* page: rebuild Elasticsearch index, flush Redis cache.

### Performance & SEO
- React Server Components everywhere; client JS only for interactive bits (cart, gallery, search box).
- **Static generation + ISR**: home (`revalidate = 60`), product pages pre‑rendered via `generateStaticParams` (`revalidate = 600`, on‑demand for the rest). The header is fully static — the user menu hydrates from a non‑sensitive cookie — so storefront pages stay cacheable.
- On‑demand revalidation (`revalidatePath`) + Redis key invalidation whenever admins change data or stock changes.
- `next/image` with AVIF/WebP, responsive `sizes`, priority LCP images; immutable caching headers for static assets; `output: "standalone"` Docker image.
- Metadata API: title templates, descriptions, canonical URLs, Open Graph / Twitter cards, `noindex` on search/filter/account pages.
- **JSON‑LD**: `Product` (offers, availability, aggregate rating), `BreadcrumbList`, `Organization`, `WebSite` + `SearchAction` (sitelinks search box).
- Dynamic `sitemap.xml`, `robots.txt`, web app manifest, semantic HTML and accessible controls.

### Redis
- Cache‑aside helper (`src/lib/redis.ts`) for catalog queries, product details, reviews, search results and autocomplete, with prefix‑based invalidation via `SCAN` + `UNLINK`.
- Login/sign‑up **rate limiting**.
- Fails open: if Redis is down the site keeps working straight from Postgres.

### Elasticsearch
- Custom index (`src/lib/elasticsearch.ts`): English analyzer, edge‑ngram autocomplete sub‑fields, `completion` suggester, keyword facets.
- `function_score` relevance with a popularity boost, fuzzy matching, brand filter in `post_filter` so brand facets stay complete, aggregations for brands/categories/price.
- Products are synced on every admin create/update/delete, review and stock change; full reindex via `npm run search:reindex` or the admin page.
- **Automatic fallback to PostgreSQL search** (with a 30s circuit breaker) when Elasticsearch is unavailable.

## Tech stack
Next.js 15 · React 19 · TypeScript · Tailwind CSS v4 · Drizzle ORM · PostgreSQL 16 · Redis 7 (ioredis) · Elasticsearch 8 · jose (JWT) · bcryptjs · zod

## Getting started

### Option A — Docker (everything included)
```bash
docker compose --profile setup run --rm setup   # migrate, seed demo data, build search index
docker compose up -d app                         # http://localhost:3000
```

### Option B — Local
Requirements: Node 20+, PostgreSQL, Redis, Elasticsearch 8 (optional — search falls back to Postgres).
```bash
cp .env.example .env        # adjust connection strings / JWT_SECRET
npm install
npm run db:migrate          # create tables
npm run db:seed             # demo catalog, admin + customer, index into Elasticsearch
npm run dev                 # http://localhost:3000
```
Production: `npm run build && npm start`.

### Demo accounts
| Role | URL | Email | Password |
|---|---|---|---|
| Admin | `/admin/login` | `admin@shopkart.dev` | `Admin@12345` |
| Customer | `/login` | `customer@shopkart.dev` | `Customer@123` |

Change `ADMIN_EMAIL` / `ADMIN_PASSWORD` in `.env` before seeding, and always set a strong `JWT_SECRET` in production.

## Scripts
| Script | Description |
|---|---|
| `npm run dev` | Dev server (Turbopack) |
| `npm run build` / `npm start` | Production build / server |
| `npm run typecheck` | TypeScript check |
| `npm run db:generate` | Generate a migration after editing `src/db/schema.ts` |
| `npm run db:migrate` | Apply migrations |
| `npm run db:seed` | Reset & seed demo data (destructive) |
| `npm run search:reindex` | Rebuild the Elasticsearch index |

## Project structure
```
src/
  app/
    (shop)/            storefront: home, c/[slug], search, p/[slug], cart, checkout, orders, wishlist, account, login, register
    admin/(auth)/      admin login
    admin/(panel)/     admin dashboard, products, categories, orders, users, banners, system
    admin/actions.ts   admin server actions (CRUD + cache/search sync)
    actions/           auth & shop server actions (login, register, wishlist, reviews, checkout)
    api/               search suggest, products JSON API, health, me
    sitemap.ts robots.ts manifest.ts
  components/          shop/ and admin/ UI
  db/                  Drizzle schema + client
  lib/                 auth, redis, elasticsearch, search (with fallback), catalog queries, indexing
  middleware.ts        route protection (admin + customer areas)
drizzle/               SQL migrations
scripts/               migrate, seed, reindex
```

## API
- `GET /api/products?q=&category=&brand=&min=&max=&rating=&sort=&page=` — search JSON
- `GET /api/search/suggest?q=` — autocomplete suggestions
- `GET /api/health` — Postgres / Redis / Elasticsearch status

## Notes
- Product images use URLs (seed data uses picsum.photos). Allowed remote image hosts are configured in `next.config.ts` — add your CDN there.
- Payments are simulated; plug a real gateway into `placeOrderAction` in `src/app/actions/shop.ts`.
