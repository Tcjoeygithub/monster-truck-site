#!/usr/bin/env node
/**
 * generate-blog.mjs — Use Claude to write 5 substantive blog articles
 * about coloring, child development, and monster trucks. Saves as
 * src/data/blog-posts.json for rendering by the blog pages.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const DATA = path.join(ROOT, "src", "data");

for (const line of fs.readFileSync(path.join(ROOT, ".env.local"), "utf8").split("\n")) {
  const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
}
const ANTHROPIC = (process.env.ANTHROPIC_API_KEY || "").trim();

const ARTICLES = [
  {
    slug: "benefits-of-coloring-for-kids",
    title: "7 Surprising Benefits of Coloring for Kids Ages 2-8",
    metaDescription: "Discover how coloring helps children develop fine motor skills, creativity, focus, and emotional regulation. Science-backed benefits every parent should know.",
    prompt: "Write a 800-1000 word blog article about the developmental benefits of coloring for young children ages 2-8. Cover: fine motor skill development, hand-eye coordination, color recognition, focus/concentration, emotional expression, creativity, pre-writing skills. Include specific examples. Reference that monster truck coloring pages are great because they have bold outlines and exciting subjects. Use HTML formatting (<h2>, <p>, <strong>, <ul>, <li>). Warm parent-friendly tone.",
  },
  {
    slug: "monster-truck-coloring-pages-classroom",
    title: "How to Use Monster Truck Coloring Pages in the Classroom",
    metaDescription: "Creative classroom activities using free printable monster truck coloring pages. Perfect for teachers working with pre-K through 2nd grade students.",
    prompt: "Write a 800-1000 word blog article for teachers about using monster truck coloring pages in the classroom. Cover: 5 specific activity ideas (color-and-count, vocabulary building with truck parts, collaborative murals, difficulty progression by grade, reward/free time activities). Include tips for different age groups (pre-K vs K vs 1st-2nd grade). Mention that the pages are free to print with no signup. Use HTML formatting. Professional but warm teacher-friendly tone.",
  },
  {
    slug: "best-crayons-markers-for-toddlers",
    title: "The Best Crayons and Markers for Toddler Coloring (2026 Guide)",
    metaDescription: "Age-appropriate coloring supplies for kids 2-8. From chunky crayons for toddlers to fine-tip markers for older kids. Parent-tested recommendations.",
    prompt: "Write a 800-1000 word blog article recommending coloring supplies for different ages. Cover: chunky crayons for ages 2-3 (why they work for small hands), regular crayons for ages 3-5, washable markers for ages 4-6, colored pencils for ages 6-8. Include tips like using a clipboard, taping pages down, washable vs permanent. DO NOT name specific brands — keep it generic (e.g. 'jumbo triangular crayons' not 'Crayola'). Mention that monster truck coloring pages with thick outlines work best for younger kids. Use HTML formatting. Helpful parent tone.",
  },
  {
    slug: "free-printable-activities-road-trips",
    title: "Free Printable Coloring Activities for Road Trips with Kids",
    metaDescription: "Keep kids entertained on long car rides with free printable monster truck coloring pages. Tips for mess-free coloring on the go.",
    prompt: "Write a 600-800 word blog article about using printable coloring pages for road trips with kids. Cover: prepping a coloring kit (clipboard, crayons, printed pages in a folder), mess-free tips for the car, how many pages to print per hour of driving, using easy pages for bumpy roads, making it a game (spot a real truck then color one), screen-free entertainment benefits. Mention that monster truck pages are perfect for road trips because kids can spot real trucks on the highway. Use HTML formatting. Fun parent tone.",
  },
  {
    slug: "age-appropriate-coloring-difficulty-guide",
    title: "Coloring Page Difficulty Guide: Matching Pages to Your Child's Age",
    metaDescription: "How to choose the right coloring page difficulty for your child. Easy pages for toddlers, medium for preschoolers, and detailed designs for big kids.",
    prompt: "Write a 800-1000 word blog article explaining how to choose the right coloring page difficulty for different ages. Cover: Easy (ages 2-4): 5-8 large shapes, extra thick outlines, what to expect (scribbling is normal and good!). Medium (ages 4-6): 10-20 areas, moderate detail, starting to stay in lines. Hard (ages 6-8): lots of detail, patterns, small areas, building patience. Include signs a child is ready to move up in difficulty. Mention that our monster truck coloring pages come in all three difficulty levels. Use HTML formatting. Educational parent tone.",
  },
];

async function generateArticle(article) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": ANTHROPIC,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4096,
      system: `You write helpful, educational blog articles for a free monster truck coloring page website. Your audience is parents and teachers of children ages 2-8. Write naturally — warm, knowledgeable, not salesy. Include genuinely useful information.

CRITICAL: You MUST format your response as HTML. Use these tags:
- <h2> for section headings (NOT h1, the page already has h1)
- <p> for paragraphs
- <strong> for emphasis
- <ul> and <li> for bullet lists
- <ol> and <li> for numbered lists
- <em> for italics
- <blockquote> for callouts/tips

Include internal links to our coloring page collections where relevant using <a href="/categories">browse our collections</a> or <a href="/dragon-monster-truck-coloring-pages">dragon monster truck coloring pages</a> etc.

Do NOT output markdown. Do NOT output plain text. Every line must be wrapped in HTML tags.`,
      messages: [{ role: "user", content: article.prompt }],
    }),
  });
  if (!res.ok) throw new Error(`Claude ${res.status}`);
  const body = await res.json();
  return body.content?.[0]?.text ?? "";
}

async function main() {
  const postsPath = path.join(DATA, "blog-posts.json");
  const existing = fs.existsSync(postsPath)
    ? JSON.parse(fs.readFileSync(postsPath, "utf8"))
    : [];

  for (let i = 0; i < ARTICLES.length; i++) {
    const a = ARTICLES[i];
    if (existing.find((p) => p.slug === a.slug)) {
      console.log(`[${i + 1}/5] ${a.slug} — already exists, skipping`);
      continue;
    }

    process.stdout.write(`[${i + 1}/5] ${a.title}... `);
    try {
      const content = await generateArticle(a);
      existing.push({
        slug: a.slug,
        title: a.title,
        metaDescription: a.metaDescription,
        content,
        publishDate: new Date().toISOString().split("T")[0],
        author: "Monster Truck Coloring Pages Team",
      });
      fs.writeFileSync(postsPath, JSON.stringify(existing, null, 2));
      console.log(`✓ (${content.length} chars)`);
    } catch (e) {
      console.log(`✗ ${e.message}`);
    }
  }

  console.log(`\nDone. ${existing.length} blog posts saved.`);
}

main().catch((e) => { console.error(e); process.exit(1); });
