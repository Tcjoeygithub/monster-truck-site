import { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getCategoryBySlug,
  getPagesByCategorySlug,
  getAllCategories,
} from "@/lib/data";
import ColoringPageCard from "@/components/ColoringPageCard";
import Breadcrumbs from "@/components/Breadcrumbs";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  "https://freemonstertruckcoloringpages.com";

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  const categories = getAllCategories();
  return categories.map((cat) => ({ slug: cat.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const category = getCategoryBySlug(params.slug);
  if (!category) return {};

  const pageUrl = `${siteUrl}/category/${category.slug}`;
  const seoName = category.name.toLowerCase().includes("coloring")
    ? category.name
    : `${category.name} Coloring Pages`;

  return {
    title: `Free ${seoName} for Kids | Printable Monster Truck Coloring Sheets`,
    description: `Free printable ${category.name.toLowerCase()} coloring pages for kids ages 2-8. ${category.description} Download and print for free!`,
    keywords: [
      `${category.name.toLowerCase()} coloring pages`,
      `free ${category.name.toLowerCase()} coloring pages`,
      "monster truck coloring pages",
      "free printable coloring pages",
      "coloring pages for kids",
      "monster truck coloring sheets",
    ],
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title: `Free ${seoName} for Kids - Monster Truck Coloring Sheets`,
      description: `Free printable ${category.name.toLowerCase()} coloring pages for kids ages 2-8. ${category.description}`,
      url: pageUrl,
      siteName: "Free Monster Truck Coloring Pages",
      locale: "en_US",
      type: "website",
      images: [
        {
          url: `${siteUrl}/images/coloring-pages/skull-crusher.png`,
          width: 1200,
          height: 1631,
          alt: `${category.name} Monster Truck Coloring Pages`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${category.name} - Free Coloring Pages`,
      description: category.description,
    },
  };
}

export default function CategoryPage({ params }: Props) {
  const category = getCategoryBySlug(params.slug);
  if (!category) notFound();

  const pages = getPagesByCategorySlug(params.slug);
  const pageUrl = `${siteUrl}/category/${category.slug}`;

  const collectionPageSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: category.name,
    description: category.description,
    url: pageUrl,
    inLanguage: "en-US",
    isPartOf: {
      "@type": "WebSite",
      name: "Free Monster Truck Coloring Pages",
      url: siteUrl,
    },
    about: {
      "@type": "Thing",
      name: category.name,
    },
    numberOfItems: pages.length,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: pages.length,
      itemListElement: pages.map((page, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: page.title,
        url: `${siteUrl}/coloring-page/${page.slug}`,
        image: `${siteUrl}${page.imagePath}`,
      })),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(collectionPageSchema),
        }}
      />
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Breadcrumbs
          crumbs={[
            { label: "Home", href: "/" },
            { label: "Categories", href: "/categories" },
            { label: category.name },
          ]}
        />

        <h1 className="font-[var(--font-display)] text-3xl md:text-4xl font-bold text-brand-black mb-3">
          {category.name.toLowerCase().includes("coloring")
            ? category.name
            : `${category.name} Coloring Pages`}
        </h1>
        <p className="text-gray-600 text-lg mb-4 max-w-3xl">
          {category.description}
        </p>
        <div className="text-gray-500 text-sm mb-8 max-w-3xl leading-relaxed">
          <p>
            Browse our free printable {category.name.toLowerCase()} coloring
            pages for kids. Every coloring page features bold, clean outlines
            designed for children ages 2&ndash;8. Click any image to print or
            download for free &mdash; no signup required. We add new{" "}
            {category.name.toLowerCase()} coloring pages regularly, so check
            back often!
          </p>
          {pages.length > 0 && (
            <p className="mt-2">
              This collection currently has{" "}
              <strong>{pages.length} free coloring page{pages.length !== 1 ? "s" : ""}</strong>{" "}
              ready to print.
            </p>
          )}
        </div>

        {pages.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {pages.map((page, i) => (
              <ColoringPageCard key={page.id} page={page} priority={i < 2} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <span className="text-6xl block mb-4">🛻</span>
            <h2 className="text-xl font-bold text-gray-500 mb-2">
              No pages yet in this category
            </h2>
            <p className="text-gray-400">
              Check back soon — we add new coloring pages every day!
            </p>
          </div>
        )}
      </div>
    </>
  );
}
