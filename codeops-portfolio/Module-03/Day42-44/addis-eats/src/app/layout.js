import "./globals.css";
import { Inter } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Providers } from "./providers";
import { SITE_URL, SITE_NAME } from "@/lib/seo";

// next/font: fetched once at build, served from our own origin (no request to Google when a
// visitor loads the page), with a metric-matched fallback so the swap does not move the layout.
// `variable` instead of `className` because globals.css sets the body font-family itself.
const inter = Inter({ subsets: ["latin"], display: "swap", variable: "--font-inter" });

export const metadata = {
  metadataBase: new URL(SITE_URL), // without it, relative og:image paths resolve against nothing
  title: {
    template: `%s · ${SITE_NAME}`, // each page supplies only its own part
    default: `${SITE_NAME} — Ethiopian food delivery in Addis Ababa`,
  },
  description:
    "Order Doro Wat, Tibs, Kitfo and more. Fresh Ethiopian comfort food, delivered across Addis Ababa.",
  openGraph: { siteName: SITE_NAME, type: "website", locale: "en_US" },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body>
        <Providers>
          <Header />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
