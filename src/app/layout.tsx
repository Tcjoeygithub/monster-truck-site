import type { Metadata } from "next";
import { Fredoka, Nunito } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Analytics from "@/components/Analytics";

const fredoka = Fredoka({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700"],
});

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "600", "700"],
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  "https://freemonstertruckcoloringpages.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Free Monster Truck Coloring Pages | Printable for Kids Ages 2-8",
    template: "%s | Free Monster Truck Coloring Pages",
  },
  description:
    "Free printable monster truck coloring pages for kids ages 2-8. New pages added daily! Bold outlines, easy to print. Download and color your favorite monster trucks.",
  keywords: [
    "monster truck coloring pages",
    "free coloring pages",
    "printable coloring pages",
    "kids coloring pages",
    "monster truck",
    "coloring pages for boys",
    "truck coloring sheets",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Free Monster Truck Coloring Pages",
    title: "Free Monster Truck Coloring Pages | Printable for Kids Ages 2-8",
    description:
      "Free printable monster truck coloring pages for kids ages 2-8. New pages added daily!",
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID;

  return (
    <html lang="en">
      <body
        className={`${fredoka.variable} ${nunito.variable} font-[var(--font-body)] antialiased min-h-screen flex flex-col`}
      >
        {/* GTM noscript */}
        {gtmId && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            />
          </noscript>
        )}
        <Analytics />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
