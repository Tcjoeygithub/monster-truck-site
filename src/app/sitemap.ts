import { MetadataRoute } from "next";
import { getAllPublishedPages, getAllCategories } from "@/lib/data";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://freemonstertruckcoloringpages.com";

  const pages = getAllPublishedPages();
  const categories = getAllCategories();

  const pageEntries = pages.map((page) => ({
    url: `${siteUrl}/coloring-page/${page.slug}`,
    lastModified: new Date(page.updatedAt),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const categoryEntries = categories.map((cat) => ({
    url: `${siteUrl}/category/${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.7,
  }));

  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${siteUrl}/categories`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.6,
    },
    ...pageEntries,
    ...categoryEntries,
  ];
}
