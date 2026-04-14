import { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getCategoryBySlug,
  getPagesByCategorySlug,
  getAllCategories,
} from "@/lib/data";
import Breadcrumbs from "@/components/Breadcrumbs";
import TwoColumnLayout from "@/components/TwoColumnLayout";
import ListicleItem from "@/components/ListicleItem";
import RelatedCollectionsRow from "@/components/RelatedCollectionsRow";

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

function displayName(name: string) {
  return name.toLowerCase().includes("coloring")
    ? name
    : `${name} Coloring Pages`;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const category = getCategoryBySlug(params.slug);
  if (!category) return {};

  const pageUrl = `${siteUrl}/${category.slug}`;
  const seoName = displayName(category.name);
  const count = category.pageCount ?? 0;
  const title = `${count > 0 ? `${count} ` : ""}${seoName} (Free PDF Printables)`;

  return {
    title: `${title} | Free Monster Truck Coloring Pages`,
    description: `Free printable ${category.name.toLowerCase()} coloring pages for kids ages 2-8. ${category.description} Download and print for free!`,
    keywords: [
      `${category.name.toLowerCase()} coloring pages`,
      `free ${category.name.toLowerCase()} coloring pages`,
      "monster truck coloring pages",
      "free printable coloring pages",
      "coloring pages for kids",
      "monster truck coloring sheets",
    ],
    alternates: { canonical: pageUrl },
    openGraph: {
      title,
      description: category.description,
      url: pageUrl,
      siteName: "Free Monster Truck Coloring Pages",
      locale: "en_US",
      type: "article",
      images: [
        {
          url: `${siteUrl}/images/coloring-pages/skull-crusher.png`,
          width: 1200,
          height: 1631,
          alt: `${seoName}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: category.description,
    },
  };
}

export default function CategoryPage({ params }: Props) {
  const category = getCategoryBySlug(params.slug);
  if (!category) notFound();

  const pages = getPagesByCategorySlug(params.slug);
  const pageUrl = `${siteUrl}/${category.slug}`;
  const seoName = displayName(category.name);

  const allCats = getAllCategories().filter((c) => c.id !== category.id);
  const sameType = allCats.filter((c) => c.type === category.type);
  const preRelated = (sameType.length ? sameType : allCats).slice(0, 4);
  const postRelated = allCats
    .filter((c) => !preRelated.find((p) => p.id === c.id))
    .slice(0, 5);

  const collectionPageSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: seoName,
    description: category.description,
    url: pageUrl,
    inLanguage: "en-US",
    isPartOf: {
      "@type": "WebSite",
      name: "Free Monster Truck Coloring Pages",
      url: siteUrl,
    },
    about: { "@type": "Thing", name: category.name },
    numberOfItems: pages.length,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: pages.length,
      itemListElement: pages.map((page, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: page.title,
        url: `${siteUrl}/pdfs/${page.slug}.pdf`,
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
      <TwoColumnLayout>
        <Breadcrumbs
          crumbs={[
            { label: "Home", href: "/" },
            { label: "Collections", href: "/categories" },
            { label: seoName },
          ]}
        />

        <header className="mb-8">
          <h1 className="font-[var(--font-display)] text-3xl md:text-4xl font-bold text-brand-black mb-4">
            {pages.length > 0 ? `${pages.length} ` : ""}
            {seoName} (Free PDF Printables)
          </h1>
          <div className="text-gray-700 text-base leading-relaxed max-w-3xl space-y-3">
            <p>{category.description}</p>
            <p>
              To start coloring, click on any of the images or titles below to
              open the printable page. Every sheet is free &mdash; no signup,
              no watermark mess, just print and color.
            </p>
          </div>
        </header>

        {preRelated.length > 0 && (
          <RelatedCollectionsRow
            heading="Related Collections"
            collections={preRelated}
          />
        )}

        {pages.length > 0 ? (
          <div className="mt-8">
            {pages.map((page, i) => (
              <ListicleItem
                key={page.id}
                page={page}
                index={i + 1}
                priority={i === 0}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <span className="text-6xl block mb-4">🛻</span>
            <h2 className="text-xl font-bold text-gray-500 mb-2">
              No pages yet in this collection
            </h2>
            <p className="text-gray-400">
              Check back soon — we add new coloring pages every day!
            </p>
          </div>
        )}

        {postRelated.length > 0 && (
          <RelatedCollectionsRow
            heading="More Free Printable Coloring Pages"
            collections={postRelated}
          />
        )}
      </TwoColumnLayout>
    </>
  );
}
