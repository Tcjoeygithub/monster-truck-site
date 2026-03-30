import { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getPageBySlug, getRelatedPages, getAllPublishedPages, getAllCategories } from "@/lib/data";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import PrintDownloadButtons from "@/components/PrintDownloadButtons";
import ColoringPageCard from "@/components/ColoringPageCard";

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  const pages = getAllPublishedPages();
  return pages.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const page = getPageBySlug(params.slug);
  if (!page) return {};

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://freemonstertruckcoloringpages.com";

  return {
    title: `${page.title} - Free Printable Coloring Page`,
    description: page.metaDescription,
    openGraph: {
      title: `${page.title} - Free Monster Truck Coloring Page`,
      description: page.metaDescription,
      images: [
        {
          url: `${siteUrl}${page.imagePath}`,
          width: 800,
          height: 600,
          alt: page.altText,
        },
      ],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: page.title,
      description: page.metaDescription,
      images: [`${siteUrl}${page.imagePath}`],
    },
  };
}

export default function ColoringPageDetail({ params }: Props) {
  const page = getPageBySlug(params.slug);
  if (!page) notFound();

  const related = getRelatedPages(page);
  const allCategories = getAllCategories();
  const pageCategories = allCategories.filter((c) =>
    page.categoryIds.includes(c.id)
  );

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://freemonstertruckcoloringpages.com";

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: page.title,
    description: page.metaDescription,
    image: `${siteUrl}${page.imagePath}`,
    datePublished: page.publishDate,
    dateModified: page.updatedAt,
    author: {
      "@type": "Organization",
      name: "Free Monster Truck Coloring Pages",
    },
  };

  const imageJsonLd = {
    "@context": "https://schema.org",
    "@type": "ImageObject",
    contentUrl: `${siteUrl}${page.imagePath}`,
    name: page.title,
    description: page.altText,
    width: 800,
    height: 600,
  };

  const difficultyLabel =
    page.difficulty === "easy"
      ? "Easy"
      : page.difficulty === "medium"
        ? "Medium"
        : "Detailed";

  const ageLabel =
    page.ageRange === "2-4"
      ? "Ages 2-4"
      : page.ageRange === "4-6"
        ? "Ages 4-6"
        : page.ageRange === "6-8"
          ? "Ages 6-8"
          : "All Ages";

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(imageJsonLd) }}
      />

      <div className="max-w-7xl mx-auto px-4 py-6">
        <Breadcrumbs
          crumbs={[
            { label: "Home", href: "/" },
            ...(pageCategories.length > 0
              ? [
                  {
                    label: pageCategories[0].name,
                    href: `/category/${pageCategories[0].slug}`,
                  },
                ]
              : []),
            { label: page.title },
          ]}
        />

        <div>
          {/* Main content */}
          <div>
            <h1 className="font-[var(--font-display)] text-3xl md:text-4xl font-bold text-brand-black mb-4">
              {page.title}
            </h1>

            <div className="flex flex-wrap gap-2 mb-4">
              <Link
                href={`/category/${page.difficulty === "easy" ? "easy" : page.difficulty === "medium" ? "medium" : "hard"}`}
                className="bg-brand-orange/10 text-brand-orange text-xs font-bold px-3 py-1 rounded-full hover:bg-brand-orange hover:text-white transition-colors"
              >
                {difficultyLabel}
              </Link>
              <Link
                href={`/category/${page.difficulty === "easy" ? "easy" : page.difficulty === "medium" ? "medium" : "hard"}`}
                className="bg-brand-green/10 text-brand-green-dark text-xs font-bold px-3 py-1 rounded-full hover:bg-brand-green hover:text-white transition-colors"
              >
                {ageLabel}
              </Link>
              {pageCategories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/category/${cat.slug}`}
                  className="bg-gray-100 text-gray-600 text-xs font-medium px-3 py-1 rounded-full hover:bg-brand-orange hover:text-white transition-colors"
                >
                  {cat.name}
                </Link>
              ))}
            </div>

            {/* Coloring page image - this is the print area */}
            <div className="print-area bg-white border-2 border-gray-200 rounded-xl overflow-hidden mb-6">
              <Image
                src={page.imagePath}
                alt={page.altText}
                width={800}
                height={600}
                className="w-full h-auto"
                priority
              />
            </div>

            <PrintDownloadButtons
              imagePath={page.imagePath}
              title={page.title}
            />

            <div className="prose max-w-none mt-6">
              <p className="text-gray-700 text-lg leading-relaxed">
                {page.description}
              </p>
              <p className="text-gray-500 text-sm mt-4">
                This free printable coloring page is perfect for{" "}
                {ageLabel.toLowerCase()}. Just click the Print button above to
                print directly from your browser, or Download to save it for
                later. Grab some crayons, markers, or colored pencils and have
                fun!
              </p>
            </div>
          </div>

        </div>

        {/* Related Pages */}
        {related.length > 0 && (
          <section className="mt-12">
            <h2 className="font-[var(--font-display)] text-2xl font-bold text-brand-black mb-6">
              You Might Also Like
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map((relPage) => (
                <ColoringPageCard key={relPage.id} page={relPage} />
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
