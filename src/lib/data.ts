import { ColoringPage, Category } from "./types";
import categoriesData from "@/data/categories.json";
import pagesData from "@/data/coloring-pages.json";

const RAW_BASE =
  "https://raw.githubusercontent.com/Tcjoeygithub/monster-truck-site/main/public";

// Public helper: convert a /images/... or /pdfs/... path into a GitHub raw URL.
// Used so the Vercel deploy can exclude these giant directories.
export function rawUrl(path: string): string {
  if (!path) return path;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  if (path.startsWith("/")) return RAW_BASE + path;
  return RAW_BASE + "/" + path;
}

function rewriteImagePath(p: string | undefined): string | undefined {
  if (!p) return p;
  if (p.startsWith("http://") || p.startsWith("https://")) return p;
  if (p.startsWith("/images/") || p.startsWith("/pdfs/")) {
    return RAW_BASE + p;
  }
  return p;
}

const categories: Category[] = categoriesData as Category[];
const coloringPages: ColoringPage[] = (pagesData as ColoringPage[]).map(
  (p) => ({
    ...p,
    imagePath: rewriteImagePath(p.imagePath) ?? p.imagePath,
    thumbnailPath: rewriteImagePath(p.thumbnailPath) ?? p.thumbnailPath,
  })
);

// --- Categories ---

export function getAllCategories(): Category[] {
  return categories.map((cat) => {
    const catPages = coloringPages.filter(
      (p) => p.status === "published" && p.categoryIds.includes(cat.id)
    );
    const thumb = catPages[0];
    const lastUpdatedAt = catPages
      .map((p) => p.updatedAt || p.publishDate)
      .filter(Boolean)
      .sort()
      .pop();
    return {
      ...cat,
      pageCount: catPages.length,
      thumbnailPath: thumb?.thumbnailPath ?? thumb?.imagePath,
      thumbnailAlt: thumb ? `${cat.name} — ${thumb.title}` : cat.name,
      lastUpdatedAt,
    };
  });
}

export function getRecentlyUpdatedCategories(limit = 6): Category[] {
  return [...getAllCategories()]
    .filter((c) => (c.pageCount ?? 0) > 0)
    .sort((a, b) =>
      (b.lastUpdatedAt ?? "").localeCompare(a.lastUpdatedAt ?? "")
    )
    .slice(0, limit);
}

export function getPopularCategories(limit = 6): Category[] {
  return [...getAllCategories()]
    .filter((c) => (c.pageCount ?? 0) > 0)
    .sort((a, b) => (b.pageCount ?? 0) - (a.pageCount ?? 0))
    .slice(0, limit);
}

export function getCategoryBySlug(slug: string): Category | undefined {
  const cat = categories.find((c) => c.slug === slug);
  if (!cat) return undefined;
  const catPages = coloringPages.filter(
    (p) => p.status === "published" && p.categoryIds.includes(cat.id)
  );
  const thumb = catPages[0];
  return {
    ...cat,
    pageCount: catPages.length,
    thumbnailPath: thumb?.thumbnailPath ?? thumb?.imagePath,
    thumbnailAlt: thumb ? `${cat.name} — ${thumb.title}` : cat.name,
    lastUpdatedAt: catPages
      .map((p) => p.updatedAt || p.publishDate)
      .filter(Boolean)
      .sort()
      .pop(),
  };
}

export function getCategoriesByType(
  type: Category["type"]
): Category[] {
  return getAllCategories().filter((c) => c.type === type);
}

// --- Coloring Pages ---

export function getAllPublishedPages(): ColoringPage[] {
  const now = new Date().toISOString().split("T")[0];
  return coloringPages
    .filter((p) => p.status === "published" && p.publishDate <= now)
    .sort(
      (a, b) =>
        new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
    );
}

export function getAllPages(): ColoringPage[] {
  return [...coloringPages].sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function getPageBySlug(slug: string): ColoringPage | undefined {
  return coloringPages.find(
    (p) => p.slug === slug && p.status === "published"
  );
}

export function getPageById(id: string): ColoringPage | undefined {
  return coloringPages.find((p) => p.id === id);
}

export function getFeaturedPages(): ColoringPage[] {
  return getAllPublishedPages().filter((p) => p.featured);
}

export function getNewTodayPages(): ColoringPage[] {
  const today = new Date().toISOString().split("T")[0];
  return getAllPublishedPages().filter((p) => p.publishDate === today);
}

export function getPagesByCategory(categoryId: string): ColoringPage[] {
  return getAllPublishedPages().filter((p) =>
    p.categoryIds.includes(categoryId)
  );
}

export function getRelatedPages(
  page: ColoringPage,
  limit: number = 4
): ColoringPage[] {
  const otherPages = getAllPublishedPages().filter((p) => p.id !== page.id);
  const scored = otherPages.map((p) => {
    let score = 0;
    for (const catId of page.categoryIds) {
      if (p.categoryIds.includes(catId)) score++;
    }
    if (p.difficulty === page.difficulty) score++;
    if (p.ageRange === page.ageRange) score++;
    return { page: p, score };
  });
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map((s) => s.page);
}

export function getPagesByCategorySlug(slug: string): ColoringPage[] {
  const cat = getCategoryBySlug(slug);
  if (!cat) return [];
  return getPagesByCategory(cat.id);
}
