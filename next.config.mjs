/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    unoptimized: true,
  },
  // Keep the massive public/images and public/pdfs out of serverless
  // function bundles. They're served as static assets anyway.
  outputFileTracingExcludes: {
    "*": [
      "public/images/**",
      "public/pdfs/**",
      "scripts/**",
      "node_modules/@anthropic-ai/sdk/**",
    ],
  },
  async redirects() {
    // Legacy /category/<slug> and intermediate slugs both redirect to the
    // current canonical /<slug> form.
    const oldToNew = {
      // Very old /category/* slugs
      "bigfoot-style": "bigfoot-monster-truck-coloring-pages",
      "car-crushers": "car-crushing-monster-truck-coloring-pages",
      "racing-trucks": "racing-monster-truck-coloring-pages",
      "freestyle-tricks": "freestyle-monster-truck-coloring-pages",
      "mud-bog-trucks": "mud-bog-monster-truck-coloring-pages",
      "skeleton-trucks": "skeleton-monster-truck-coloring-pages",
      "flame-trucks": "flame-monster-truck-coloring-pages",
      "easter-monster-truck-coloring-pages": "easter-monster-truck-coloring-pages",
      "easy-monster-truck-toddlers": "easy-monster-truck-coloring-pages-for-toddlers",
      "dinosaur-monster-truck-coloring-pages": "dinosaur-monster-truck-coloring-pages",
    };
    const categoryRedirects = Object.entries(oldToNew).map(
      ([oldSlug, newSlug]) => ({
        source: `/category/${oldSlug}`,
        destination: `/${newSlug}`,
        permanent: true,
      })
    );

    // Intermediate root-level slugs that briefly existed
    const intermediateToNew = {
      "bigfoot-style-coloring-pages": "bigfoot-monster-truck-coloring-pages",
      "car-crushers-coloring-pages": "car-crushing-monster-truck-coloring-pages",
      "racing-trucks-coloring-pages": "racing-monster-truck-coloring-pages",
      "freestyle-tricks-coloring-pages": "freestyle-monster-truck-coloring-pages",
      "mud-bog-trucks-coloring-pages": "mud-bog-monster-truck-coloring-pages",
      "skeleton-trucks-coloring-pages": "skeleton-monster-truck-coloring-pages",
      "flame-trucks-coloring-pages": "flame-monster-truck-coloring-pages",
      "easy-monster-truck-toddlers-coloring-pages": "easy-monster-truck-coloring-pages-for-toddlers",
    };
    const intermediateRedirects = Object.entries(intermediateToNew).map(
      ([oldSlug, newSlug]) => ({
        source: `/${oldSlug}`,
        destination: `/${newSlug}`,
        permanent: true,
      })
    );

    return [
      ...categoryRedirects,
      ...intermediateRedirects,
      {
        source: "/category/:slug*",
        destination: "/categories",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
