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

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://freemonstertruckcoloringpages.com";

export async function generateStaticParams() {
  const pages = getAllPublishedPages();
  return pages.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const page = getPageBySlug(params.slug);
  if (!page) return {};

  const pageUrl = `${siteUrl}/coloring-page/${page.slug}`;
  const imageUrl = `${siteUrl}${page.imagePath}`;
  const categories = getAllCategories().filter((c) => page.categoryIds.includes(c.id));

  return {
    title: `${page.title} - Free Printable Coloring Page`,
    description: page.metaDescription,
    keywords: [
      page.title.toLowerCase(),
      "monster truck coloring page",
      "free printable",
      "coloring page for kids",
      ...categories.map((c) => c.name.toLowerCase()),
    ],
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title: `${page.title} - Free Monster Truck Coloring Page`,
      description: page.metaDescription,
      url: pageUrl,
      siteName: "Free Monster Truck Coloring Pages",
      locale: "en_US",
      type: "article",
      publishedTime: page.publishDate,
      modifiedTime: page.updatedAt,
      section: categories[0]?.name || "Monster Trucks",
      tags: categories.map((c) => c.name),
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 1631,
          alt: page.altText,
          type: "image/png",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${page.title} - Free Coloring Page`,
      description: page.metaDescription,
      images: [{ url: imageUrl, alt: page.altText }],
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

  const pageUrl = `${siteUrl}/coloring-page/${page.slug}`;
  const imageUrl = `${siteUrl}${page.imagePath}`;

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

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: page.title,
    description: page.metaDescription,
    image: {
      "@type": "ImageObject",
      url: imageUrl,
      width: 1200,
      height: 1631,
    },
    datePublished: page.publishDate,
    dateModified: page.updatedAt,
    url: pageUrl,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": pageUrl,
    },
    author: {
      "@type": "Organization",
      name: "Free Monster Truck Coloring Pages",
      url: siteUrl,
    },
    publisher: {
      "@type": "Organization",
      name: "Free Monster Truck Coloring Pages",
      url: siteUrl,
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/images/coloring-pages/skull-crusher.png`,
      },
    },
    inLanguage: "en-US",
    isAccessibleForFree: true,
    keywords: pageCategories.map((c) => c.name).join(", "),
    articleSection: pageCategories[0]?.name || "Monster Trucks",
  };

  const imageJsonLd = {
    "@context": "https://schema.org",
    "@type": "ImageObject",
    contentUrl: imageUrl,
    url: imageUrl,
    name: page.title,
    description: page.altText,
    width: 1200,
    height: 1631,
    thumbnailUrl: `${siteUrl}${page.thumbnailPath}`,
    datePublished: page.publishDate,
    author: {
      "@type": "Organization",
      name: "Free Monster Truck Coloring Pages",
    },
    copyrightHolder: {
      "@type": "Organization",
      name: "Free Monster Truck Coloring Pages",
    },
    license: `${siteUrl}/terms`,
    acquireLicensePage: `${siteUrl}/terms`,
  };

  const howToJsonLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: `How to Print ${page.title} Coloring Page`,
    description: `Print this free ${page.title} monster truck coloring page in 3 easy steps.`,
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Click Print or Download",
        text: "Click the orange Print button to print directly, or the green Download button to save the coloring page.",
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Print on standard paper",
        text: "Use standard 8.5 x 11 inch paper. The coloring page is optimized to fit perfectly on one page.",
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Color and enjoy",
        text: "Grab crayons, markers, or colored pencils and bring this monster truck to life!",
      },
    ],
    totalTime: "PT2M",
    supply: [
      { "@type": "HowToSupply", name: "Printer paper (8.5 x 11 in)" },
      { "@type": "HowToSupply", name: "Crayons, markers, or colored pencils" },
    ],
  };

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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }}
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

        <article>
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

          <time
            dateTime={page.publishDate}
            className="text-gray-400 text-xs block mb-4"
          >
            Published {new Date(page.publishDate).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          </time>

          <div className="print-area bg-white border-2 border-gray-200 rounded-xl overflow-hidden mb-6">
            <Image
              src={page.imagePath}
              alt={page.altText}
              width={1200}
              height={1631}
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
            <h2 className="text-xl font-bold text-brand-black mt-6 mb-2">
              How to Print This Coloring Page
            </h2>
            <ol className="text-gray-600 text-sm space-y-1 list-decimal pl-5">
              <li>Click the <strong>Print</strong> button above to print directly, or <strong>Download</strong> to save.</li>
              <li>Use standard 8.5 x 11 inch paper for the best fit.</li>
              <li>Grab crayons, markers, or colored pencils and color away!</li>
            </ol>
            <p className="text-gray-500 text-sm mt-4">
              This free printable coloring page is perfect for{" "}
              {ageLabel.toLowerCase()}. Difficulty level: {difficultyLabel.toLowerCase()}.
            </p>
          </div>
        </article>

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
