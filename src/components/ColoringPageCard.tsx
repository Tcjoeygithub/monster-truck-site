import Image from "next/image";
import Link from "next/link";
import { ColoringPage } from "@/lib/types";

interface Props {
  page: ColoringPage;
  priority?: boolean;
}

export default function ColoringPageCard({ page, priority = false }: Props) {
  return (
    <Link
      href={`/coloring-page/${page.slug}`}
      className="group block bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border-2 border-gray-100 hover:border-brand-orange"
    >
      <div className="relative aspect-[4/3] bg-gray-50">
        <Image
          src={page.thumbnailPath}
          alt={page.altText}
          fill
          className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          priority={priority}
        />
      </div>
      <div className="p-4">
        <h3 className="font-bold text-brand-black group-hover:text-brand-orange transition-colors text-lg leading-tight">
          {page.title}
        </h3>
        <p className="text-gray-500 text-sm mt-1 line-clamp-2">
          {page.description}
        </p>
        <div className="mt-3 flex items-center gap-2">
          <span className="text-brand-orange font-semibold text-sm">
            Print Free →
          </span>
        </div>
      </div>
    </Link>
  );
}
