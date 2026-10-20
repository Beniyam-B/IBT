import { SITE_URL } from "@/lib/seo";

// Everything behind sign-in cannot be crawled anyway (the proxy redirects it), so say so.
export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/cart", "/checkout", "/orders", "/kitchen", "/dashboard", "/login", "/register", "/api/"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
