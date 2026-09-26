import type { Metadata, Viewport } from "next";
import "./globals.css";
import { siteName, siteUrl } from "@/lib/format";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: {
    default: `${siteName()} — Online Shopping for Mobiles, Electronics, Fashion & More`,
    template: `%s | ${siteName()}`,
  },
  description:
    "Shop online for mobiles, laptops, electronics, fashion, home & kitchen, appliances and more. Best prices, fast delivery, easy returns and cash on delivery.",
  applicationName: siteName(),
  keywords: ["online shopping", "mobiles", "laptops", "electronics", "fashion", "deals", "ecommerce"],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: siteName(),
    locale: "en_IN",
    url: "/",
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#2874f0",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN">
      <body className="min-h-screen font-sans">{children}</body>
    </html>
  );
}
