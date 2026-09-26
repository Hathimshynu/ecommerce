import type { MetadataRoute } from "next";
import { siteName } from "@/lib/format";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteName(),
    short_name: siteName(),
    description: "Online shopping for mobiles, electronics, fashion and more",
    start_url: "/",
    display: "standalone",
    background_color: "#f1f3f6",
    theme_color: "#2874f0",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
