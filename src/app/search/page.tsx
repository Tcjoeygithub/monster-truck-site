import { Metadata } from "next";
import Link from "next/link";
import ColoringPageCard from "@/components/ColoringPageCard";
import Breadcrumbs from "@/components/Breadcrumbs";
import TwoColumnLayout from "@/components/TwoColumnLayout";
import { getAllPublishedPages, getAllCategories } from "@/lib/data";

export const metadata: Metadata = {
  title: "Search | Free Monster Truck Coloring Pages",
  description: "Search our free monster truck coloring pages.",
  robots: { index: false, follow: true },
};

interface Props {
  searchParams: { q?: string };
}

export default function SearchPage({ searchParams }: Props) {
  const q = (searchParams.q ?? "").trim();
  const needle = q.toLowerCase();

  const pages = needle
    ? getAllPublishedPages().filter(
        (p) =>
          p.title.toLowerCase().includes(needle) ||
          p.description.toLowerCase().includes(needle)
      )
    : [];
  const cats = needle
    ? getAllCategories().filter(
        (c) =>
          c.name.toLowerCase().includes(needle) ||
          c.description.toLowerCase().includes(needle)
      )
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
            Results for <strong>&ldquo;{q}&rdquo;</strong> &mdash; {pages.length}{" "}
            coloring page{pages.length === 1 ? "" : "s"}
            {cats.length > 0 && (
              <>, {cats.length} collection{cats.length === 1 ? "" : "s"}</>
            )}
            .
          </>
        ) : (
          "Enter a search term in the sidebar to find coloring pages."
        )}
      </p>

      {cats.length > 0 && (
        <section className="mb-10">
          <h2 className="font-bold text-brand-black text-sm uppercase tracking-wide mb-3">
            Matching Collections
          </h2>
          <ul className="flex flex-wrap gap-2">
            {cats.map((c) => (
              <li key={c.id}>
                <Link
                  href={`/category/${c.slug}`}
                  className="inline-block bg-white border border-gray-200 hover:border-brand-orange hover:text-brand-orange text-sm font-semibold px-3 py-1.5 rounded-full transition-colors"
                >
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {pages.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {pages.map((p) => (
            <ColoringPageCard key={p.id} page={p} />
          ))}
        </div>
      ) : q ? (
        <div className="text-center py-16 border-2 border-dashed border-gray-200 rounded-xl">
          <span className="text-5xl block mb-3">🔍</span>
          <p className="text-gray-500">
            No coloring pages match &ldquo;{q}&rdquo;. Try another word, or{" "}
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
