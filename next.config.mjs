/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    unoptimized: true,
  },
  async redirects() {
    // Old /category/<slug> URLs now live at root-level /<slug>-coloring-pages.
    // These map the legacy slugs to the new ones.
    const oldToNew = {
      "bigfoot-style": "bigfoot-style-coloring-pages",
      "car-crushers": "car-crushers-coloring-pages",
      "racing-trucks": "racing-trucks-coloring-pages",
      "freestyle-tricks": "freestyle-tricks-coloring-pages",
      "mud-bog-trucks": "mud-bog-trucks-coloring-pages",
      "skeleton-trucks": "skeleton-trucks-coloring-pages",
      "flame-trucks": "flame-trucks-coloring-pages",
      "easter-monster-truck-coloring-pages": "easter-monster-truck-coloring-pages",
      "easy-monster-truck-toddlers": "easy-monster-truck-toddlers-coloring-pages",
      "dinosaur-monster-truck-coloring-pages": "dinosaur-monster-truck-coloring-pages",
    };
    const specific = Object.entries(oldToNew).map(([oldSlug, newSlug]) => ({
      source: `/category/${oldSlug}`,
      destination: `/${newSlug}`,
      permanent: true,
    }));
    return [
      ...specific,
      // Catch-all safety net: anything else under /category/* goes to /categories
      {
        source: "/category/:slug*",
        destination: "/categories",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
