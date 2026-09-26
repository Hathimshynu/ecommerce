export type SortOption = "relevance" | "price_asc" | "price_desc" | "newest" | "rating" | "discount";

export const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "relevance", label: "Relevance" },
  { value: "rating", label: "Popularity" },
  { value: "price_asc", label: "Price -- Low to High" },
  { value: "price_desc", label: "Price -- High to Low" },
  { value: "newest", label: "Newest First" },
  { value: "discount", label: "Discount" },
];

export type SearchQuery = {
  q?: string;
  category?: string;
  brands?: string[];
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  inStock?: boolean;
  sort?: SortOption;
  page?: number;
  pageSize?: number;
};

export type ProductCardData = {
  id: number;
  name: string;
  slug: string;
  brand: string;
  price: number;
  mrp: number;
  rating: number;
  ratingCount: number;
  image: string | null;
  stock: number;
  categorySlug?: string;
};

export type Facet = { key: string; label?: string; count: number };

export type SearchResult = {
  items: ProductCardData[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  facets: { brands: Facet[]; categories: Facet[]; priceMin: number; priceMax: number };
  engine: "elasticsearch" | "postgres";
};
