import Image from "next/image";
import { ColoringPage } from "@/lib/types";
import ListicleItemActions from "./ListicleItemActions";

interface Props {
  page: ColoringPage;
  index: number;
  priority?: boolean;
}

export default function ListicleItem({ page, index, priority = false }: Props) {
  const pdfHref = `/pdfs/${page.slug}.pdf`;

  return (
    <article
      id={page.slug}
      className="border-b border-gray-200 pb-10 mb-10 last:border-b-0"
    >
      <h2 className="font-[var(--font-display)] text-2xl md:text-3xl font-bold text-brand-black mb-4">
        {index}. {page.title}
      </h2>
      <a
        href={pdfHref}
        target="_blank"
        rel="noopener"
        aria-label={`${page.title} — open free printable PDF`}
        className="block group"
      >
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
      </a>
      {page.description && (
        <p className="text-gray-600 mt-4 leading-relaxed max-w-3xl">
          {page.description}
        </p>
      )}
      <div className="mt-5">
        <ListicleItemActions
          imagePath={page.imagePath}
          pdfPath={pdfHref}
          title={page.title}
          slug={page.slug}
        />
      </div>
    </article>
  );
}
