import { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import TwoColumnLayout from "@/components/TwoColumnLayout";
import { getAllCategories, getPagesByCategory } from "@/lib/data";

export const metadata: Metadata = {
  title: "Search | Free Monster Truck Coloring Pages",
  description: "Search our free monster truck coloring page collections.",
  robots: { index: false, follow: true },
};

interface Props {
  searchParams: { q?: string };
}

export default function SearchPage({ searchParams }: Props) {
  const q = (searchParams.q ?? "").trim();
  const needle = q.toLowerCase();

  const cats = needle
    ? getAllCategories().filter((c) => {
        if (
          c.name.toLowerCase().includes(needle) ||
          c.description.toLowerCase().includes(needle)
        ) {
          return true;
        }
        // Match against pages inside this collection
        return getPagesByCategory(c.id).some((p) =>
          p.title.toLowerCase().includes(needle)
        );
      })
    : [];

  return (
    <TwoColumnLayout>
      <Breadcrumbs
        crumbs={[{ label: "Home", href: "/" }, { label: "Search" }]}
      />
      <h1 className="font-[var(--font-display)] text-3xl md:text-4xl font-bold text-brand-black mb-2">
        Search
      </h1>
      <p className="text-gray-600 mb-8">
        {q ? (
          <>
            Results for <strong>&ldquo;{q}&rdquo;</strong> &mdash; {cats.length}{" "}
            matching collection{cats.length === 1 ? "" : "s"}.
          </>
        ) : (
          "Enter a search term in the sidebar to find coloring page collections."
        )}
      </p>

      {cats.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {cats.map((c) => (
            <Link
              key={c.id}
              href={`/${c.slug}`}
              className="bg-white border-2 border-gray-100 hover:border-brand-orange rounded-xl p-4 transition-all hover:shadow-md group"
            >
              <h3 className="font-bold text-base text-brand-black group-hover:text-brand-orange transition-colors">
                {c.name}
              </h3>
              <p className="text-gray-500 text-sm mt-1 line-clamp-2">
                {c.description}
              </p>
              {c.pageCount ? (
                <span className="inline-block mt-2 text-brand-orange text-xs font-semibold">
                  {c.pageCount} coloring page{c.pageCount === 1 ? "" : "s"} →
                </span>
              ) : null}
            </Link>
          ))}
        </div>
      ) : q ? (
        <div className="text-center py-16 border-2 border-dashed border-gray-200 rounded-xl">
          <span className="text-5xl block mb-3">🔍</span>
          <p className="text-gray-500">
            No collections match &ldquo;{q}&rdquo;. Try another word, or{" "}
            <Link href="/categories" className="text-brand-orange underline">
              browse all collections
            </Link>
            .
          </p>
        </div>
      ) : null}
    </TwoColumnLayout>
  );
}
