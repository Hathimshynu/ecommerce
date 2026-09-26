import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/format";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api/", "/cart", "/checkout", "/orders", "/account", "/wishlist", "/login", "/register"],
      },
    ],
    sitemap: `${siteUrl()}/sitemap.xml`,
    host: siteUrl(),
  };
}
