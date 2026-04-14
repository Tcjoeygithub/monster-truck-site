import Link from "next/link";
import SearchBox from "./SearchBox";
import AdSlot from "./AdSlot";
import { getAllCategories } from "@/lib/data";

export default function Sidebar() {
  const categories = getAllCategories();

  const featured = [...categories]
    .filter((c) => (c.pageCount ?? 0) > 0)
    .sort((a, b) => (b.pageCount ?? 0) - (a.pageCount ?? 0))
    .slice(0, 3);

  const popular = [...categories]
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
          We&rsquo;re a small team that loves big trucks. Every collection on
          this site is a free, printable monster truck coloring page set
          designed for kids ages 2&ndash;8 &mdash; bold outlines, clean art, no
          signup. Grab your crayons and let&rsquo;s roll.
        </p>
      </section>

      {/* Featured Collections */}
      {featured.length > 0 && (
        <section className="bg-white border-2 border-gray-100 rounded-xl p-5">
          <h2 className="font-bold text-brand-black text-sm uppercase tracking-wide mb-3">
            Featured This Month
          </h2>
          <ul className="space-y-2">
            {featured.map((cat) => (
              <li key={cat.id}>
                <Link
                  href={`/${cat.slug}`}
                  className="block text-sm font-semibold text-brand-black hover:text-brand-orange transition-colors"
                >
                  {cat.name}
                  {cat.pageCount ? (
                    <span className="block text-xs text-gray-400 font-normal">
                      {cat.pageCount} coloring page
                      {cat.pageCount === 1 ? "" : "s"}
                    </span>
                  ) : null}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Popular Collections */}
      {popular.length > 0 && (
        <section className="bg-white border-2 border-gray-100 rounded-xl p-5">
          <h2 className="font-bold text-brand-black text-sm uppercase tracking-wide mb-3">
            Popular Collections
          </h2>
          <ul className="space-y-2">
            {popular.map((cat) => (
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

      <AdSlot position="sidebar" />
    </aside>
  );
}
