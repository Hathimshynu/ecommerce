import Link from "next/link";
import { siteName } from "@/lib/format";

export function Footer() {
  const cols = [
    { title: "About", links: [["Contact Us", "/"], ["About Us", "/"], ["Careers", "/"], ["Press", "/"]] },
    { title: "Help", links: [["Payments", "/"], ["Shipping", "/"], ["Cancellation & Returns", "/"], ["FAQ", "/"]] },
    { title: "Consumer Policy", links: [["Return Policy", "/"], ["Terms Of Use", "/"], ["Security", "/"], ["Privacy", "/"]] },
    { title: "Shop", links: [["Mobiles", "/c/mobiles"], ["Laptops", "/c/laptops"], ["Fashion", "/c/fashion"], ["Top Deals", "/search?sort=discount"]] },
  ];
  return (
    <footer className="mt-10 bg-[#172337] text-xs text-white">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 py-10 md:grid-cols-5">
        {cols.map((c) => (
          <div key={c.title}>
            <p className="mb-3 text-gray-400 uppercase">{c.title}</p>
            <ul className="space-y-2">
              {c.links.map(([label, href]) => (
                <li key={label}>
                  <Link href={href} className="hover:underline">{label}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <div className="col-span-2 border-gray-600 md:col-span-1 md:border-l md:pl-6">
          <p className="mb-3 text-gray-400 uppercase">Registered Office</p>
          <address className="not-italic leading-5">
            {siteName()} Internet Pvt. Ltd.<br />
            Outer Ring Road, Bengaluru, 560103<br />
            Karnataka, India
          </address>
        </div>
      </div>
      <div className="border-t border-gray-700 py-5 text-center text-gray-300">
        © {new Date().getFullYear()} {siteName()}. All rights reserved.
      </div>
    </footer>
  );
}
