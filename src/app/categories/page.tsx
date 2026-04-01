import { Metadata } from "next";
import Link from "next/link";
import { getAllCategories } from "@/lib/data";
import Breadcrumbs from "@/components/Breadcrumbs";

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
        {allCollections.map((cat) => (
          <Link
            key={cat.id}
            href={`/category/${cat.slug}`}
            className="bg-white border-2 border-gray-100 hover:border-brand-orange rounded-xl p-6 transition-all hover:shadow-lg group"
          >
            <h2 className="font-bold text-lg text-brand-black group-hover:text-brand-orange transition-colors">
              {cat.name}
            </h2>
            <p className="text-gray-500 text-sm mt-1 line-clamp-2">
              {cat.description}
            </p>
            {cat.pageCount !== undefined && (
              <span className="inline-block mt-3 text-brand-orange text-sm font-semibold">
                {cat.pageCount} coloring page{cat.pageCount !== 1 ? "s" : ""} →
              </span>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
