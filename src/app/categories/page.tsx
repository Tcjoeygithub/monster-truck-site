import { Metadata } from "next";
import { getAllCategories } from "@/lib/data";
import Breadcrumbs from "@/components/Breadcrumbs";
import CollectionCard from "@/components/CollectionCard";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  "https://freemonstertruckcoloringpages.com";

export const metadata: Metadata = {
  title: "All Collections - Monster Truck Coloring Pages",
  description:
    "Browse all monster truck coloring page collections. Find free printable pages by truck type, theme, and more.",
  alternates: {
    canonical: `${siteUrl}/categories`,
  },
  openGraph: {
    title: "All Collections - Free Monster Truck Coloring Pages",
    description:
      "Browse all monster truck coloring page collections. Find pages by truck type, theme, and more.",
    url: `${siteUrl}/categories`,
    siteName: "Free Monster Truck Coloring Pages",
    type: "website",
    images: [
      {
        url: `${siteUrl}/images/coloring-pages/skull-crusher.png`,
        width: 1200,
        height: 1631,
        alt: "Monster Truck Coloring Page Collections",
      },
    ],
  },
};

export default function CategoriesPage() {
  const allCollections = getAllCategories();

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <Breadcrumbs
        crumbs={[{ label: "Home", href: "/" }, { label: "All Collections" }]}
      />

      <h1 className="font-[var(--font-display)] text-3xl md:text-4xl font-bold text-brand-black mb-3">
        All Coloring Page Collections
      </h1>
      <p className="text-gray-600 text-lg mb-8 max-w-3xl">
        Browse our growing library of free printable monster truck coloring page
        collections. Each collection features unique themed coloring pages
        designed for kids ages 2&ndash;8. New collections added regularly!
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {allCollections.map((cat, i) => (
          <CollectionCard
            key={cat.id}
            collection={cat}
            priority={i < 3}
          />
        ))}
      </div>
    </div>
  );
}
