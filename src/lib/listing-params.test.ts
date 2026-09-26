import { describe, expect, it } from "vitest";
import { buildHref, parseListingParams } from "./listing-params";
import { discountPercent, slugify } from "./format";

describe("parseListingParams", () => {
  it("parses filters and clamps bad input", () => {
    const q = parseListingParams({ q: "phone", brand: ["Samsung", "Apple"], min: "1000", max: "-5", sort: "bogus", page: "999" });
    expect(q).toMatchObject({ q: "phone", brands: ["Samsung", "Apple"], minPrice: 1000, maxPrice: undefined, sort: "relevance", page: 100 });
  });
  it("defaults page to 1", () => {
    expect(parseListingParams({}).page).toBe(1);
  });
});

describe("buildHref", () => {
  it("overrides keys, drops page on filter changes and removes nulls", () => {
    expect(buildHref("/search", { q: "tv", page: "3", sort: "rating" }, { sort: null })).toBe("/search?q=tv");
    expect(buildHref("/search", { q: "tv" }, { brand: ["LG", "Sony"] })).toBe("/search?q=tv&brand=LG&brand=Sony");
    expect(buildHref("/c/mobiles", {}, { page: "2" })).toBe("/c/mobiles?page=2");
  });
});

describe("format helpers", () => {
  it("computes discounts and slugs", () => {
    expect(discountPercent(750, 1000)).toBe(25);
    expect(discountPercent(1000, 900)).toBe(0);
    expect(slugify("Levi's Slim Fit Jeans (Blue)")).toBe("levi-s-slim-fit-jeans-blue");
  });
});
