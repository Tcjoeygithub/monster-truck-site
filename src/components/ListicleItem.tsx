import Image from "next/image";
import { ColoringPage } from "@/lib/types";

interface Props {
  page: ColoringPage;
  index: number;
  priority?: boolean;
}

export default function ListicleItem({ page, index, priority = false }: Props) {
  return (
    <article className="border-b border-gray-200 pb-10 mb-10 last:border-b-0">
      <a
        href={`/pdfs/${page.slug}.pdf`}
        target="_blank"
        rel="noopener"
        className="block group"
        aria-label={`${page.title} — open free printable PDF`}
      >
        <h2 className="font-[var(--font-display)] text-2xl md:text-3xl font-bold text-brand-black group-hover:text-brand-orange transition-colors mb-4">
          {index}. {page.title}
        </h2>
        <div className="relative w-full aspect-[4/5] max-h-[820px] bg-gray-50 rounded-xl overflow-hidden border-2 border-gray-100 group-hover:border-brand-orange transition-colors">
          <Image
            src={page.imagePath}
            alt={page.altText}
            fill
            sizes="(max-width: 1024px) 100vw, 760px"
            className="object-contain p-4"
            priority={priority}
          />
        </div>
        {page.description && (
          <p className="text-gray-600 mt-4 leading-relaxed max-w-3xl">
            {page.description}
          </p>
        )}
        <span className="inline-block mt-4 text-brand-orange font-bold group-hover:underline">
          Open free printable PDF →
        </span>
      </a>
    </article>
  );
}
