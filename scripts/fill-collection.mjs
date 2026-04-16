#!/usr/bin/env node
/**
 * fill-collection.mjs — Generate N new pages for an EXISTING collection.
 *
 * Used to backfill specific collections up to the target page count without
 * the autopilot's "always create new collection" rule.
 *
 * Usage:
 *   node scripts/fill-collection.mjs --slug=fruit-monster-truck-coloring-pages --count=8
 *
 * Requires ANTHROPIC_API_KEY + GOOGLE_IMAGEN_API_KEY in .env.local.
 */
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const DATA = path.join(ROOT, "src", "data");
const IMAGES = path.join(ROOT, "public", "images", "coloring-pages");

const envPath = path.join(ROOT, ".env.local");
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
    const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
}
const ANTHROPIC = (process.env.ANTHROPIC_API_KEY || "").trim();
const IMAGEN = (process.env.GOOGLE_IMAGEN_API_KEY || "").trim();
if (!ANTHROPIC || !IMAGEN) {
  console.error("Missing ANTHROPIC_API_KEY or GOOGLE_IMAGEN_API_KEY");
  process.exit(1);
}

const args = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const [k, v] = a.replace(/^--/, "").split("=");
    return [k, v ?? true];
  })
);
const SLUG = args.slug;
const COUNT = Number(args.count || 8);
if (!SLUG) {
  console.error("Usage: --slug=<category-slug> --count=N");
  process.exit(1);
}

const categories = JSON.parse(
  fs.readFileSync(path.join(DATA, "categories.json"), "utf8")
);
const cat = categories.find((c) => c.slug === SLUG);
if (!cat) {
  console.error(`No category with slug "${SLUG}"`);
  process.exit(1);
}

const BASE_IMAGEN_PROMPT =
  "MUST FEATURE A MONSTER TRUCK AS THE PRIMARY AND DOMINANT SUBJECT FILLING MOST OF THE FRAME. A monster truck has an oversized truck body sitting high on huge knobby tires with raised suspension. The truck IS the subject; any theme is decoration ON or AROUND it. Black and white line art ONLY, coloring book style for young children ages 2-8, bold thick clean outlines only, simple shapes, NO COLOR, NO shading, NO gray fill, strictly black outlines on white background, NO complex backgrounds, NO crowds, NO tiny details, NO text in image. The complete monster truck must be fully visible.";

async function planTopics() {
  const pagesRaw = JSON.parse(
    fs.readFileSync(path.join(DATA, "coloring-pages.json"), "utf8")
  );
  const existingInCollection = pagesRaw
    .filter((p) => p.categoryIds.includes(cat.id) && p.status === "published")
    .map((p) => p.title);

  const system = `You plan a themed monster truck coloring page collection for kids 2-8. The theme is "${cat.name}". All pages feature an ORIGINAL monster truck design (no trademarks). Mix difficulty: some easy/toddler, some medium, some hard.`;
  const user = `Add ${COUNT} NEW coloring pages to the existing collection "${cat.name}". Theme: ${cat.description}

Existing pages in this collection (DO NOT duplicate): ${existingInCollection.join(", ") || "(none)"}

Return ONLY a JSON array of ${COUNT} objects:
[
  {
    "title": "Creative Title",
    "slug": "url-slug",
    "description": "2-3 fun sentences for kids/parents",
    "metaDescription": "SEO meta <160 chars with 'free printable' and 'coloring page'",
    "altText": "alt text for the black and white coloring page",
    "imagenPrompt": "Detailed prompt for the monster truck design. For EASY: 'very simple monster truck, only 5-6 large shapes, extra thick outlines, no small details'. For MEDIUM: moderate detail. For HARD: more detail.",
    "difficulty": "easy|medium|hard",
    "ageRange": "2-4|4-6|6-8"
  }
]`;

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": ANTHROPIC,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 8192,
      system,
      messages: [{ role: "user", content: user }],
    }),
  });
  if (!res.ok) throw new Error(`Claude: ${res.status} ${await res.text()}`);
  const body = await res.json();
  const text = body.content?.[0]?.text ?? "";
  const match = text.match(/\[[\s\S]*\]/);
  if (!match) throw new Error(`No JSON array in response: ${text.slice(0, 300)}`);
  return JSON.parse(match[0]);
}

async function generateImage(prompt) {
  const fullPrompt = `${prompt} ${BASE_IMAGEN_PROMPT}`;
  // Try Nano Banana first (28x more daily quota than Imagen)
  const nanoRes = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key=${IMAGEN}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: fullPrompt }] }],
        generationConfig: { responseModalities: ["IMAGE", "TEXT"] },
      }),
    }
  );
  if (nanoRes.ok) {
    const data = await nanoRes.json();
    const parts = data.candidates?.[0]?.content?.parts ?? [];
    for (const p of parts) {
      if (p.inlineData?.data) return Buffer.from(p.inlineData.data, "base64");
    }
    throw new Error("Nano Banana returned no image");
  }
  // Fall back to Imagen
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-generate-001:predict?key=${IMAGEN}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        instances: [{ prompt: fullPrompt }],
        parameters: { sampleCount: 1 },
      }),
    }
  );
  if (!res.ok) throw new Error(`Both generators failed: ${res.status}`);
  const data = await res.json();
  return Buffer.from(data.predictions[0].bytesBase64Encoded, "base64");
}

async function qcImage(imagePath) {
  const b64 = fs.readFileSync(imagePath).toString("base64");
  const qcPrompt = `Rate this coloring page for kids 2-8 on 1-10 scales. Respond with ONLY JSON: {"overall": <num>, "completeness": <num>, "no_color": <num>, "no_text": <num>, "is_truck": <num>, "pass": <bool>}. Require completeness>=7, no_color>=9, no_text>=9, is_truck>=8, overall>=7 AND set pass=true only if all hold. no_color = 10 means pure black outlines on white; <9 = any colored fill or gray shading. no_text = 10 means no letters/numbers/text squiggles. is_truck = 10 means the primary subject is clearly a monster truck (truck body with oversized knobby tires and raised suspension); <8 = image is mostly of other items (bakery goods, animals, flowers) without a dominant monster truck.`;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${IMAGEN}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            { text: qcPrompt },
            { inlineData: { mimeType: "image/png", data: b64 } },
          ],
        },
      ],
      generationConfig: { temperature: 0.1, maxOutputTokens: 1024 },
    }),
  });
  if (!res.ok) return { pass: false, overall: 0 };
  const data = await res.json();
  const text = data.candidates?.[0]?.content?.parts?.map((p) => p.text).join("") ?? "";
  const match = text.replace(/```json\s*/g, "").replace(/```\s*/g, "").match(/\{[\s\S]*\}/);
  if (!match) return { pass: false, overall: 0 };
  try {
    const r = JSON.parse(match[0]);
    const noColor = r.no_color ?? 10;
    const noText = r.no_text ?? 10;
    const isTruck = r.is_truck ?? 10;
    const hardFail = noColor < 9 || noText < 9 || isTruck < 8 || (r.completeness ?? 10) < 7;
    return { pass: (r.pass || false) && !hardFail, overall: r.overall ?? 0, no_color: noColor, no_text: noText, is_truck: isTruck };
  } catch {
    return { pass: false, overall: 0 };
  }
}

function checkBW(imagePath) {
  try {
    execSync(`python3 "${path.join(ROOT, "scripts", "check-color.py")}" "${imagePath}"`, {
      stdio: "pipe",
      timeout: 15000,
    });
    return true;
  } catch {
    return false;
  }
}

async function main() {
  console.log(`Filling "${cat.name}" with ${COUNT} new pages...`);
  const topics = await planTopics();
  console.log(`Got ${topics.length} topics from Claude`);

  const pages = JSON.parse(fs.readFileSync(path.join(DATA, "coloring-pages.json"), "utf8"));
  const existingSlugs = new Set(pages.map((p) => p.slug));

  for (let i = 0; i < topics.length; i++) {
    const t = topics[i];
    let slug = t.slug;
    if (existingSlugs.has(slug)) slug = `${slug}-${Date.now().toString(36)}`;
    existingSlugs.add(slug);

    const imgPath = path.join(IMAGES, `${slug}.png`);
    const thumbPath = path.join(IMAGES, `${slug}-thumb.png`);

    console.log(`\n[${i + 1}/${topics.length}] ${t.title}`);

    let passed = false;
    let attempts = 0;
    while (!passed && attempts < 5) {
      attempts++;
      try {
        const buf = await generateImage(t.imagenPrompt);
        fs.writeFileSync(imgPath, buf);
        const qc = await qcImage(imgPath);
        console.log(`  attempt ${attempts}: ${qc.overall}/10 ${qc.pass ? "PASS" : "FAIL"} (no_color=${qc.no_color} no_text=${qc.no_text})`);
        if (qc.pass && checkBW(imgPath)) {
          passed = true;
        }
      } catch (e) {
        console.log(`  attempt ${attempts} error: ${e.message}`);
      }
    }

    if (!passed) {
      console.log(`  ✗ skipped (failed 5 QC attempts)`);
      try { fs.unlinkSync(imgPath); } catch {}
      continue;
    }

    // Copy to thumbnail
    fs.copyFileSync(imgPath, thumbPath);

    // Frame + watermark via existing script
    try {
      execSync(`python3 "${path.join(ROOT, "scripts", "frame-image.py")}" "${imgPath}"`, {
        stdio: "pipe",
        timeout: 30000,
      });
    } catch (e) {
      console.log(`  frame error: ${e.message}`);
    }

    const pageId = `page-${crypto.randomBytes(4).toString("hex")}`;
    const now = new Date().toISOString();
    const today = now.split("T")[0];

    pages.push({
      id: pageId,
      slug,
      title: t.title,
      description: t.description,
      metaDescription: t.metaDescription,
      altText: t.altText,
      imagePath: `/images/coloring-pages/${slug}.png`,
      thumbnailPath: `/images/coloring-pages/${slug}-thumb.png`,
      categoryIds: [cat.id],
      difficulty: t.difficulty,
      ageRange: t.ageRange,
      status: "published",
      featured: false,
      publishDate: today,
      createdAt: now,
      updatedAt: now,
    });

    // Persist after each page
    fs.writeFileSync(path.join(DATA, "coloring-pages.json"), JSON.stringify(pages, null, 2));
    console.log(`  ✓ published`);
  }

  console.log("\nDone.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
