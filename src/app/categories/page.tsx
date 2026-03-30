import { Metadata } from "next";
import Link from "next/link";
import { getCategoriesByType } from "@/lib/data";
import Breadcrumbs from "@/components/Breadcrumbs";

export const metadata: Metadata = {
  title: "All Categories",
  description:
    "Browse all monster truck coloring page categories. Find pages by truck type, theme, difficulty level, and age range.",
};

export default function CategoriesPage() {
  const truckTypes = getCategoriesByType("truck-type");
  const themes = getCategoriesByType("theme");
  const difficulty = getCategoriesByType("difficulty");

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <Breadcrumbs
        crumbs={[{ label: "Home", href: "/" }, { label: "All Categories" }]}
      />

      <h1 className="font-[var(--font-display)] text-3xl md:text-4xl font-bold text-brand-black mb-8">
        All Categories
      </h1>

      {/* By Truck Type */}
      <section className="mb-10">
        <h2 className="font-[var(--font-display)] text-2xl font-bold text-brand-black mb-4">
          By Truck Type
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {truckTypes.map((cat) => (
            <Link
              key={cat.id}
              href={`/category/${cat.slug}`}
              className="bg-white border-2 border-gray-100 hover:border-brand-orange rounded-xl p-6 transition-all hover:shadow-lg group"
            >
              <h3 className="font-bold text-lg text-brand-black group-hover:text-brand-orange transition-colors">
                {cat.name}
              </h3>
              <p className="text-gray-500 text-sm mt-1">{cat.description}</p>
              {cat.pageCount !== undefined && (
                <span className="inline-block mt-3 text-brand-orange text-sm font-semibold">
                  {cat.pageCount} page{cat.pageCount !== 1 ? "s" : ""} →
                </span>
              )}
            </Link>
          ))}
        </div>
      </section>

      {/* By Theme */}
      <section className="mb-10">
        <h2 className="font-[var(--font-display)] text-2xl font-bold text-brand-black mb-4">
          By Theme
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {themes.map((cat) => (
            <Link
              key={cat.id}
              href={`/category/${cat.slug}`}
              className="bg-white border-2 border-gray-100 hover:border-brand-orange rounded-xl p-6 transition-all hover:shadow-lg group"
            >
              <h3 className="font-bold text-lg text-brand-black group-hover:text-brand-orange transition-colors">
                {cat.name}
              </h3>
              <p className="text-gray-500 text-sm mt-1">{cat.description}</p>
              {cat.pageCount !== undefined && (
                <span className="inline-block mt-3 text-brand-orange text-sm font-semibold">
                  {cat.pageCount} page{cat.pageCount !== 1 ? "s" : ""} →
                </span>
              )}
            </Link>
          ))}
        </div>
      </section>

      {/* By Difficulty */}
      <section className="mb-10">
        <h2 className="font-[var(--font-display)] text-2xl font-bold text-brand-black mb-4">
          By Difficulty / Age
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {difficulty.map((cat) => (
            <Link
              key={cat.id}
              href={`/category/${cat.slug}`}
              className="bg-white border-2 border-gray-100 hover:border-brand-orange rounded-xl p-6 transition-all hover:shadow-lg group"
            >
              <h3 className="font-bold text-lg text-brand-black group-hover:text-brand-orange transition-colors">
                {cat.name}
              </h3>
              <p className="text-gray-500 text-sm mt-1">{cat.description}</p>
              {cat.pageCount !== undefined && (
                <span className="inline-block mt-3 text-brand-orange text-sm font-semibold">
                  {cat.pageCount} page{cat.pageCount !== 1 ? "s" : ""} →
                </span>
              )}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
