import Link from "next/link";
import Image from "next/image";
import { Category } from "@/lib/types";

interface Props {
  collection: Category;
  variant?: "full" | "compact";
  priority?: boolean;
}

export default function CollectionCard({
  collection: cat,
  variant = "full",
  priority = false,
}: Props) {
  const showDescription = variant === "full";
  return (
    <Link
      href={`/${cat.slug}`}
      className="bg-white border-2 border-gray-100 hover:border-brand-orange rounded-xl overflow-hidden transition-all hover:shadow-md group flex flex-col"
    >
      <div className="relative aspect-[4/3] bg-gray-50 border-b border-gray-100">
        {cat.thumbnailPath ? (
          <Image
            src={cat.thumbnailPath}
            alt={cat.thumbnailAlt ?? cat.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-contain p-3 group-hover:scale-[1.02] transition-transform"
            priority={priority}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-4xl text-gray-300">
            🛻
          </div>
        )}
      </div>
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="font-bold text-base text-brand-black group-hover:text-brand-orange transition-colors leading-tight">
          {cat.name}
        </h3>
        {showDescription && (
          <p className="text-gray-500 text-sm mt-1 line-clamp-2 flex-1">
            {cat.description}
          </p>
        )}
        {cat.pageCount !== undefined && cat.pageCount > 0 && (
          <span className="inline-block mt-2 text-brand-orange text-xs font-semibold">
            {cat.pageCount} coloring page{cat.pageCount !== 1 ? "s" : ""} →
          </span>
        )}
      </div>
    </Link>
  );
}
