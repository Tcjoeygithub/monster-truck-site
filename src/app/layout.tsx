import type { Metadata } from "next";
import { Fredoka, Nunito } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Analytics from "@/components/Analytics";
import { getAllCategories } from "@/lib/data";

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
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32" },
      { url: "/favicon.png", type: "image/png", sizes: "32x32" },
    ],
    apple: "/apple-touch-icon.png",
  },
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
    "monster truck printables",
    "coloring pages for toddlers",
    "free printable coloring sheets",
  ],
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Free Monster Truck Coloring Pages",
    title: "Free Monster Truck Coloring Pages | Printable for Kids Ages 2-8",
    description:
      "Free printable monster truck coloring pages for kids ages 2-8. New pages added daily!",
    images: [
      {
        url: `${siteUrl}/images/coloring-pages/skull-crusher.png`,
        width: 1200,
        height: 1631,
        alt: "Free Monster Truck Coloring Pages for Kids",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Monster Truck Coloring Pages | Printable for Kids Ages 2-8",
    description:
      "Free printable monster truck coloring pages for kids ages 2-8. New pages added daily!",
    images: [`${siteUrl}/images/coloring-pages/skull-crusher.png`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  other: {
    "theme-color": "#FF6B00",
    "color-scheme": "light",
    "msapplication-TileColor": "#FF6B00",
    "p:domain_verify": "6738417e7c1a207fc0b2c14cbd0011ba",
  },
  verification: {
    // Add your verification codes here when ready
    // google: "your-google-verification-code",
    // yandex: "your-yandex-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID;

  // Dynamic collections for nav — auto-updates as new collections are created
  const collections = getAllCategories().map((c) => ({
    name: c.name,
    slug: c.slug,
  }));

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Free Monster Truck Coloring Pages",
    url: siteUrl,
    logo: `${siteUrl}/images/coloring-pages/skull-crusher.png`,
    description:
      "Free printable monster truck coloring pages for kids ages 2-8. Built by a dad for his son.",
    foundingDate: "2026",
    sameAs: [],
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Free Monster Truck Coloring Pages",
    url: siteUrl,
    description:
      "Free printable monster truck coloring pages for kids ages 2-8. New pages added daily!",
    inLanguage: "en-US",
    publisher: {
      "@type": "Organization",
      name: "Free Monster Truck Coloring Pages",
      url: siteUrl,
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteUrl}/categories`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  const gaId = process.env.NEXT_PUBLIC_GA_ID?.trim();
  const adsenseId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID?.trim();

  return (
    <html lang="en">
      <head>
        {gaId && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${gaId}');`,
              }}
            />
          </>
        )}
        {adsenseId && (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseId}`}
            crossOrigin="anonymous"
          />
        )}
        <link rel="canonical" href={siteUrl} />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        <link rel="dns-prefetch" href="https://pagead2.googlesyndication.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body
        className={`${fredoka.variable} ${nunito.variable} font-[var(--font-body)] antialiased min-h-screen flex flex-col`}
      >
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
        <Header collections={collections} />
        <main className="flex-1">{children}</main>
        <Footer collections={collections} />
      </body>
    </html>
  );
}
