import Link from "next/link";
import Image from "next/image";
import SearchBox from "./SearchBox";
import AdSlot from "./AdSlot";
import { getAllCategories, getFeaturedPages } from "@/lib/data";

export default function Sidebar() {
  const categories = getAllCategories();
  const featuredPool = getFeaturedPages();
  const featured = featuredPool.slice(0, 3);

  const topCollections = [...categories]
    .sort((a, b) => (b.pageCount ?? 0) - (a.pageCount ?? 0))
    .slice(0, 6);

  return (
    <aside className="no-print space-y-8">
      {/* Search */}
      <section className="bg-white border-2 border-gray-100 rounded-xl p-5">
        <h2 className="font-bold text-brand-black text-sm uppercase tracking-wide mb-3">
          Search
        </h2>
        <SearchBox />
      </section>

      {/* About Us */}
      <section className="bg-white border-2 border-gray-100 rounded-xl p-5">
        <h2 className="font-bold text-brand-black text-sm uppercase tracking-wide mb-3">
          About Us
        </h2>
        <p className="text-gray-600 text-sm leading-relaxed">
          We&rsquo;re a small team that loves big trucks. Every page on this site
          is a free, printable monster truck coloring page designed for kids
          ages 2&ndash;8 &mdash; bold outlines, clean art, no signup. Grab your
          crayons and let&rsquo;s roll.
        </p>
      </section>

      {/* Featured This Month */}
      {featured.length > 0 && (
        <section className="bg-white border-2 border-gray-100 rounded-xl p-5">
          <h2 className="font-bold text-brand-black text-sm uppercase tracking-wide mb-3">
            Featured This Month
          </h2>
          <ul className="space-y-4">
            {featured.map((page) => (
              <li key={page.id}>
                <a
                  href={`/pdfs/${page.slug}.pdf`}
                  target="_blank"
                  rel="noopener"
                  className="flex gap-3 items-center group"
                >
                  <div className="relative w-16 h-16 shrink-0 bg-gray-50 rounded-md overflow-hidden border border-gray-100">
                    <Image
                      src={page.thumbnailPath}
                      alt={page.altText}
                      fill
                      sizes="64px"
                      className="object-contain p-1"
                    />
                  </div>
                  <span className="text-sm font-semibold text-brand-black group-hover:text-brand-orange transition-colors leading-snug">
                    {page.title}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Popular Collections */}
      {topCollections.length > 0 && (
        <section className="bg-white border-2 border-gray-100 rounded-xl p-5">
          <h2 className="font-bold text-brand-black text-sm uppercase tracking-wide mb-3">
            Popular Collections
          </h2>
          <ul className="space-y-2">
            {topCollections.map((cat) => (
              <li key={cat.id}>
                <Link
                  href={`/${cat.slug}`}
                  className="text-sm text-gray-700 hover:text-brand-orange transition-colors flex justify-between items-center"
                >
                  <span>{cat.name}</span>
                  {cat.pageCount ? (
                    <span className="text-xs text-gray-400">
                      {cat.pageCount}
                    </span>
                  ) : null}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Ad slot */}
      <AdSlot position="sidebar" />
    </aside>
  );
}
