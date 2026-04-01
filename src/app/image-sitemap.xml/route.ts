import { getAllPublishedPages } from "@/lib/data";
import { NextResponse } from "next/server";

export async function GET() {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://freemonstertruckcoloringpages.com";

  const pages = getAllPublishedPages();

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${pages
  .map(
    (page) => `  <url>
    <loc>${siteUrl}/coloring-page/${page.slug}</loc>
    <image:image>
      <image:loc>${siteUrl}${page.imagePath}</image:loc>
      <image:title>${escapeXml(page.title)} - Free Monster Truck Coloring Page</image:title>
      <image:caption>${escapeXml(page.altText)}</image:caption>
      <image:license>${siteUrl}/terms</image:license>
    </image:image>
  </url>`
  )
  .join("\n")}
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
