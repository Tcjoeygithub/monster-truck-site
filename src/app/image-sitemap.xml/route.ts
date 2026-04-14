import { getAllCategories, getPagesByCategorySlug } from "@/lib/data";
import { NextResponse } from "next/server";

export async function GET() {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://freemonstertruckcoloringpages.com";

  const categories = getAllCategories();

  const urls = categories
    .map((cat) => {
      const pages = getPagesByCategorySlug(cat.slug);
      if (pages.length === 0) return "";
      const images = pages
        .map(
          (page) => `    <image:image>
      <image:loc>${siteUrl}${page.imagePath}</image:loc>
      <image:title>${escapeXml(page.title)} - Free Monster Truck Coloring Page</image:title>
      <image:caption>${escapeXml(page.altText)}</image:caption>
      <image:license>${siteUrl}/terms</image:license>
    </image:image>`
        )
        .join("\n");
      return `  <url>
    <loc>${siteUrl}/${cat.slug}</loc>
${images}
  </url>`;
    })
    .filter(Boolean)
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
