import { Header } from "@/components/shop/header";
import { Footer } from "@/components/shop/footer";
import { CartProvider } from "@/components/shop/cart-provider";
import { JsonLd } from "@/components/json-ld";
import { siteName, siteUrl } from "@/lib/format";

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: siteName(),
          url: siteUrl(),
          potentialAction: {
            "@type": "SearchAction",
            target: { "@type": "EntryPoint", urlTemplate: `${siteUrl()}/search?q={search_term_string}` },
            "query-input": "required name=search_term_string",
          },
        }}
      />
      <Header />
      <main className="min-h-[60vh]">{children}</main>
      <Footer />
    </CartProvider>
  );
}
