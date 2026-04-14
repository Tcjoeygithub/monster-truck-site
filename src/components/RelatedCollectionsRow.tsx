import Link from "next/link";
import { Category } from "@/lib/types";

interface Props {
  heading?: string;
  collections: Category[];
}

export default function RelatedCollectionsRow({
  heading = "More Free Printable Coloring Pages",
  collections,
}: Props) {
  if (collections.length === 0) return null;
  return (
    <section className="my-10 bg-brand-cream/40 border-2 border-gray-100 rounded-xl p-5">
      <h3 className="font-bold text-brand-black text-sm uppercase tracking-wide mb-3">
        {heading}
      </h3>
      <ul className="flex flex-wrap gap-2">
        {collections.map((cat) => (
          <li key={cat.id}>
            <Link
              href={`/category/${cat.slug}`}
              className="inline-block bg-white border border-gray-200 hover:border-brand-orange hover:text-brand-orange text-sm font-semibold px-3 py-1.5 rounded-full transition-colors"
            >
              {cat.name}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
