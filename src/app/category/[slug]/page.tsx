import { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getCategoryBySlug,
  getPagesByCategorySlug,
  getAllCategories,
} from "@/lib/data";
import ColoringPageCard from "@/components/ColoringPageCard";
import Breadcrumbs from "@/components/Breadcrumbs";

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  const categories = getAllCategories();
  return categories.map((cat) => ({ slug: cat.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const category = getCategoryBySlug(params.slug);
  if (!category) return {};

  return {
    title: `${category.name} - Free Monster Truck Coloring Pages`,
    description: category.description,
    openGraph: {
      title: `${category.name} - Free Monster Truck Coloring Pages`,
      description: category.description,
    },
  };
}

export default function CategoryPage({ params }: Props) {
  const category = getCategoryBySlug(params.slug);
  if (!category) notFound();

  const pages = getPagesByCategorySlug(params.slug);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <Breadcrumbs
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Categories", href: "/categories" },
          { label: category.name },
        ]}
      />

      <h1 className="font-[var(--font-display)] text-3xl md:text-4xl font-bold text-brand-black mb-3">
        {category.name}
      </h1>
      <p className="text-gray-600 text-lg mb-8 max-w-3xl">
        {category.description}
      </p>

      {pages.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {pages.map((page, i) => (
            <ColoringPageCard key={page.id} page={page} priority={i < 2} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <span className="text-6xl block mb-4">🛻</span>
          <h2 className="text-xl font-bold text-gray-500 mb-2">
            No pages yet in this category
          </h2>
          <p className="text-gray-400">
            Check back soon — we add new coloring pages every day!
          </p>
        </div>
      )}

    </div>
  );
}
