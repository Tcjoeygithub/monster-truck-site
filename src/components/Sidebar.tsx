import Link from "next/link";
import SearchBox from "./SearchBox";
import {
  getRecentlyUpdatedCategories,
  getPopularCategories,
} from "@/lib/data";

export default function Sidebar() {
  const latest = getRecentlyUpdatedCategories(6);
  const popular = getPopularCategories(6);

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
          this site is a free, printable monster truck coloring page set for
          kids ages 2&ndash;8 &mdash; bold outlines, no signup.
        </p>
      </section>

      {/* Latest Updates */}
      {latest.length > 0 && (
        <section className="bg-white border-2 border-gray-100 rounded-xl p-5">
          <h2 className="font-bold text-brand-black text-sm uppercase tracking-wide mb-3">
            Latest Updates
          </h2>
          <ul className="space-y-2">
            {latest.map((cat) => (
              <li key={cat.id}>
                <Link
                  href={`/${cat.slug}`}
                  className="text-sm text-gray-700 hover:text-brand-orange transition-colors flex justify-between items-center gap-2"
                >
                  <span className="truncate">{cat.name}</span>
                  {cat.pageCount ? (
                    <span className="text-xs text-gray-400 shrink-0">
                      {cat.pageCount}
                    </span>
                  ) : null}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Popular */}
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
                  className="text-sm text-gray-700 hover:text-brand-orange transition-colors flex justify-between items-center gap-2"
                >
                  <span className="truncate">{cat.name}</span>
                  {cat.pageCount ? (
                    <span className="text-xs text-gray-400 shrink-0">
                      {cat.pageCount}
                    </span>
                  ) : null}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </aside>
  );
}
