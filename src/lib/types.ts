export interface ColoringPage {
  id: string;
  slug: string;
  title: string;
  description: string;
  metaDescription: string;
  altText: string;
  imagePath: string;
  thumbnailPath: string;
  categoryIds: string[];
  difficulty: "easy" | "medium" | "hard";
  ageRange: "2-4" | "4-6" | "6-8" | "all";
  status: "draft" | "published";
  featured: boolean;
  publishDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  type: "truck-type" | "difficulty" | "age-range" | "theme";
  pageCount?: number;
  thumbnailPath?: string;
  thumbnailAlt?: string;
}

export interface SiteConfig {
  siteName: string;
  siteUrl: string;
  siteDescription: string;
  postsPerDay: number;
}
