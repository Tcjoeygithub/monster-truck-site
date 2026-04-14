import Link from "next/link";
import TwoColumnLayout from "@/components/TwoColumnLayout";
import { getAllCategories, getAllPublishedPages } from "@/lib/data";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  "https://freemonstertruckcoloringpages.com";

export default function HomePage() {
  const allCollections = getAllCategories();
  const allPages = getAllPublishedPages();

  const trending = [...allCollections]
    .sort((a, b) => (b.pageCount ?? 0) - (a.pageCount ?? 0))
    .slice(0, 9);

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Free Monster Truck Coloring Pages",
    description:
      "Free printable monster truck coloring pages for kids ages 2-8. New pages added daily!",
    url: siteUrl,
    inLanguage: "en-US",
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: allCollections.length,
      itemListElement: allCollections.map((cat, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: cat.name,
        url: `${siteUrl}/category/${cat.slug}`,
      })),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />

      {/* Hero */}
      <section className="bg-gradient-to-br from-brand-orange via-brand-orange-dark to-brand-black text-white py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="font-[var(--font-display)] text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg">
            Free Monster Truck Coloring Pages
          </h1>
          <p className="text-lg md:text-xl text-orange-100 max-w-2xl mx-auto mb-6">
            {allPages.length}+ printable monster truck coloring pages across{" "}
            {allCollections.length} collections. 100% free, no signup.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/categories"
              className="bg-white/15 hover:bg-white/25 text-white font-bold py-3 px-8 rounded-xl text-lg transition-colors backdrop-blur"
            >
              Browse All Collections
            </Link>
          </div>
        </div>
      </section>

      <TwoColumnLayout>
        {/* Trending collections */}
        <Section
          title="Trending Collections"
          viewAllHref="/categories"
          viewAllLabel="View all"
        >
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {trending.map((cat) => (
              <Link
                key={cat.id}
                href={`/category/${cat.slug}`}
                className="bg-white border-2 border-gray-100 hover:border-brand-orange rounded-lg px-4 py-3 text-sm font-semibold text-brand-black hover:text-brand-orange transition-colors"
              >
                {cat.name}
                {cat.pageCount ? (
                  <span className="block text-xs text-gray-400 font-normal mt-0.5">
                    {cat.pageCount} page{cat.pageCount === 1 ? "" : "s"}
                  </span>
                ) : null}
              </Link>
            ))}
          </div>
        </Section>

        {/* All collections */}
        <Section title="All Collections">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {allCollections.map((cat) => (
              <Link
                key={cat.id}
                href={`/category/${cat.slug}`}
                className="bg-white border-2 border-gray-100 hover:border-brand-orange rounded-xl p-4 transition-all hover:shadow-md group"
              >
                <h3 className="font-bold text-base text-brand-black group-hover:text-brand-orange transition-colors">
                  {cat.name}
                </h3>
                <p className="text-gray-500 text-sm mt-1 line-clamp-2">
                  {cat.description}
                </p>
                {cat.pageCount !== undefined && cat.pageCount > 0 && (
                  <span className="inline-block mt-2 text-brand-orange text-xs font-semibold">
                    {cat.pageCount} coloring page
                    {cat.pageCount !== 1 ? "s" : ""} →
                  </span>
                )}
              </Link>
            ))}
          </div>
        </Section>
      </TwoColumnLayout>
    </>
  );
}

function Section({
  title,
  viewAllHref,
  viewAllLabel,
  children,
}: {
  title: string;
  viewAllHref?: string;
  viewAllLabel?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-10 first:mt-0">
      <div className="flex items-end justify-between gap-3 mb-5 border-b-2 border-gray-100 pb-2">
        <h2 className="font-[var(--font-display)] text-2xl md:text-3xl font-bold text-brand-black">
          {title}
        </h2>
        {viewAllHref && (
          <Link
            href={viewAllHref}
            className="text-brand-orange font-semibold text-sm whitespace-nowrap hover:underline"
          >
            {viewAllLabel ?? "View all"} →
          </Link>
        )}
      </div>
      {children}
    </section>
  );
}
