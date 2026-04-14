import Link from "next/link";
import TwoColumnLayout from "@/components/TwoColumnLayout";
import CollectionCard from "@/components/CollectionCard";
import {
  getAllCategories,
  getAllPublishedPages,
  getRecentlyUpdatedCategories,
  getPopularCategories,
} from "@/lib/data";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  "https://freemonstertruckcoloringpages.com";

export default function HomePage() {
  const allCollections = getAllCategories();
  const allPages = getAllPublishedPages();
  const latest = getRecentlyUpdatedCategories(6);
  const popular = getPopularCategories(6);

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Free Monster Truck Coloring Pages",
    description:
      "Free printable monster truck coloring pages for kids ages 2-8. New collections added regularly!",
    url: siteUrl,
    inLanguage: "en-US",
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: allCollections.length,
      itemListElement: allCollections.map((cat, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: cat.name,
        url: `${siteUrl}/${cat.slug}`,
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
        {/* Latest Updates — 6 most recently added/updated listicles */}
        <Section
          title="Latest Updates"
          viewAllHref="/categories"
          viewAllLabel="View all"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {latest.map((cat, i) => (
              <CollectionCard
                key={cat.id}
                collection={cat}
                priority={i < 3}
              />
            ))}
          </div>
        </Section>

        {/* Popular Collections — list below */}
        {popular.length > 0 && (
          <Section title="Popular Collections">
            <ul className="divide-y divide-gray-100 border-2 border-gray-100 rounded-xl bg-white overflow-hidden">
              {popular.map((cat, i) => (
                <li key={cat.id}>
                  <Link
                    href={`/${cat.slug}`}
                    className="flex items-center justify-between gap-3 px-5 py-3 hover:bg-brand-cream/40 transition-colors group"
                  >
                    <span className="flex items-center gap-3 min-w-0">
                      <span className="text-gray-400 text-sm w-6 shrink-0">
                        {i + 1}.
                      </span>
                      <span className="font-semibold text-brand-black group-hover:text-brand-orange transition-colors truncate">
                        {cat.name}
                      </span>
                    </span>
                    <span className="text-brand-orange text-sm font-semibold shrink-0">
                      {cat.pageCount} page{cat.pageCount === 1 ? "" : "s"} →
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </Section>
        )}
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
