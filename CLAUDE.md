# Monster Truck Coloring Pages - Build Standards

## Tech Stack
- Next.js 14 (App Router), TypeScript, Tailwind CSS
- Deployed on Vercel at freemonstertruckcoloringpages.com
- GitHub: Tcjoeygithub/monster-truck-site
- Image generation: Google Imagen API (Gemini)
- Secrets in `.env.local` (gitignored)

## SEO Protocol (WordPress/Yoast Parity)
Every page must have:
- Canonical URL, og:url, og:image (with dimensions), twitter:card
- Per-page keywords array, meta description
- JSON-LD schema appropriate to page type:
  - Global: Organization + WebSite
  - Content pages: Article + ImageObject + HowTo
  - Category pages: CollectionPage + ItemList
  - All pages: BreadcrumbList
- Semantic HTML: `<article>`, `<time>`, `<nav>`, `<section>`
- Two sitemaps: `/sitemap.xml` + `/image-sitemap.xml`
- robots.txt blocks AI crawlers (GPTBot, CCBot)

## Image QC Pipeline (scripts/qc-images.mjs)
All generated images must pass 4 layers:
1. **AI Vision** (Gemini) — 6 criteria, all >= 6, overall >= 7, framing >= 7
2. **Pixel Edge Scan** (Pillow) — hard fail if >3% dark pixels in outer 5% border
3. **Print-Fit** — resize to 1200x1575 (US Letter at 150 DPI), pad white
4. **Watermark** (scripts/watermark.py) — black-and-white text banner, no icons

## Content Rules
- No ad placeholders until AdSense is approved
- Tags/badges must be clickable links to categories
- Print button opens clean popup window (never window.print on main page)
- Watermarks: black-and-white only, text-only, print-friendly
- Copyright: all artwork is original, never reproduce official brands
- Disclaimer on every page footer

## AdSense Compliance
Required pages (all linked in footer):
- Privacy Policy (COPPA, GDPR, cookies, advertising)
- Terms of Service
- Disclaimer
- About
- Contact

## Deploy
- Push to GitHub, then `vercel --prod --yes`
- Always deploy after significant changes so user can test on mobile
