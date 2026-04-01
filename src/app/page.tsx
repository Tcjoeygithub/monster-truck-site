import ColoringPageCard from "@/components/ColoringPageCard";
import Link from "next/link";
import {
  getFeaturedPages,
  getNewTodayPages,
  getAllPublishedPages,
  getCategoriesByType,
} from "@/lib/data";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  "https://freemonstertruckcoloringpages.com";

export default function HomePage() {
  const featured = getFeaturedPages();
  const newToday = getNewTodayPages();
  const allPages = getAllPublishedPages();
  const truckCategories = getCategoriesByType("truck-type");
  const themeCategories = getCategoriesByType("theme");

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Free Monster Truck Coloring Pages",
    description:
      "Free printable monster truck coloring pages for kids ages 2-8. New pages added daily!",
    url: siteUrl,
    inLanguage: "en-US",
    isPartOf: {
      "@type": "WebSite",
      name: "Free Monster Truck Coloring Pages",
      url: siteUrl,
    },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: allPages.length,
      itemListElement: allPages.slice(0, 20).map((page, index) => ({
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-brand-orange via-brand-orange-dark to-brand-black text-white py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="font-[var(--font-display)] text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">
            Free Monster Truck
            <br />
            <span className="text-brand-green-light">Coloring Pages!</span>
          </h1>
          <p className="text-lg md:text-xl text-orange-100 max-w-2xl mx-auto mb-8">
            Awesome monster truck coloring pages for kids ages 2&ndash;8. Print
            them free, grab your crayons, and let&rsquo;s roll!
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="#new-today"
              className="bg-brand-green hover:bg-brand-green-dark text-white font-bold py-3 px-8 rounded-xl text-lg transition-colors shadow-lg"
            >
              See New Pages
            </Link>
            <Link
              href="/categories"
              className="bg-white/20 hover:bg-white/30 text-white font-bold py-3 px-8 rounded-xl text-lg transition-colors backdrop-blur"
            >
              Browse Categories
            </Link>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4">
        {/* New Today Section */}
        {newToday.length > 0 && (
          <section id="new-today" className="mt-12">
            <div className="flex items-center gap-3 mb-6">
              <span className="bg-brand-green text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide animate-pulse">
                New Today
              </span>
              <h2 className="font-[var(--font-display)] text-2xl md:text-3xl font-bold text-brand-black">
                Fresh Off the Press!
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {newToday.map((page, i) => (
                <ColoringPageCard key={page.id} page={page} priority={i < 2} />
              ))}
            </div>
          </section>
        )}

        {/* Featured Section */}
        {featured.length > 0 && (
          <section className="mt-12">
            <h2 className="font-[var(--font-display)] text-2xl md:text-3xl font-bold text-brand-black mb-6">
              Featured Coloring Pages
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featured.map((page, i) => (
                <ColoringPageCard
                  key={page.id}
                  page={page}
                  priority={newToday.length === 0 && i < 2}
                />
              ))}
            </div>
          </section>
        )}

        {/* Category Grid */}
        <section className="mt-12">
          <h2 className="font-[var(--font-display)] text-2xl md:text-3xl font-bold text-brand-black mb-6">
            Browse by Truck Type
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {truckCategories.map((cat) => (
              <Link
                key={cat.id}
                href={`/category/${cat.slug}`}
                className="group bg-gradient-to-br from-brand-orange to-brand-orange-dark text-white rounded-xl p-4 text-center hover:scale-105 transition-transform shadow-md"
              >
                <span className="text-3xl block mb-2">🛻</span>
                <span className="font-bold text-sm">{cat.name}</span>
                {cat.pageCount !== undefined && cat.pageCount > 0 && (
                  <span className="block text-xs text-orange-200 mt-1">
                    {cat.pageCount} page{cat.pageCount !== 1 ? "s" : ""}
                  </span>
                )}
              </Link>
            ))}
          </div>
        </section>

        {themeCategories.length > 0 && (
          <section className="mt-8">
            <h2 className="font-[var(--font-display)] text-2xl md:text-3xl font-bold text-brand-black mb-6">
              Browse by Theme
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {themeCategories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/category/${cat.slug}`}
                  className="group bg-gradient-to-br from-brand-black to-brand-dark text-white rounded-xl p-4 text-center hover:scale-105 transition-transform shadow-md"
                >
                  <span className="text-3xl block mb-2">
                    {cat.slug.includes("skeleton") ? "💀" : "🔥"}
                  </span>
                  <span className="font-bold text-sm">{cat.name}</span>
                  {cat.pageCount !== undefined && cat.pageCount > 0 && (
                    <span className="block text-xs text-gray-400 mt-1">
                      {cat.pageCount} page{cat.pageCount !== 1 ? "s" : ""}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* All Pages */}
        <section className="mt-12">
          <h2 className="font-[var(--font-display)] text-2xl md:text-3xl font-bold text-brand-black mb-6">
            All Coloring Pages
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {allPages.map((page) => (
              <ColoringPageCard key={page.id} page={page} />
            ))}
          </div>
        </section>

        {/* Difficulty Links */}
        <section className="mt-12 mb-8">
          <h2 className="font-[var(--font-display)] text-2xl md:text-3xl font-bold text-brand-black mb-6">
            By Difficulty Level
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/category/easy"
              className="bg-brand-green text-white rounded-xl p-6 text-center hover:scale-105 transition-transform shadow-md"
            >
              <span className="text-4xl block mb-2">🖍️</span>
              <span className="font-bold text-lg block">Easy (Ages 2-4)</span>
              <span className="text-sm text-green-100">
                Big shapes, simple outlines
              </span>
            </Link>
            <Link
              href="/category/medium"
              className="bg-brand-orange text-white rounded-xl p-6 text-center hover:scale-105 transition-transform shadow-md"
            >
              <span className="text-4xl block mb-2">✏️</span>
              <span className="font-bold text-lg block">
                Medium (Ages 4-6)
              </span>
              <span className="text-sm text-orange-100">
                More detail, more fun
              </span>
            </Link>
            <Link
              href="/category/hard"
              className="bg-red-500 text-white rounded-xl p-6 text-center hover:scale-105 transition-transform shadow-md"
            >
              <span className="text-4xl block mb-2">🎨</span>
              <span className="font-bold text-lg block">
                Detailed (Ages 6-8)
              </span>
              <span className="text-sm text-red-100">Challenge accepted!</span>
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
