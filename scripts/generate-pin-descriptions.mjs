#!/usr/bin/env node
/**
 * generate-pin-descriptions.mjs
 *
 * For each published coloring page that doesn't already have a cached
 * Pinterest pin description, call Claude Haiku to generate a unique,
 * SEO-optimized description (<=500 chars) and cache it to
 * src/data/pin-descriptions.json.
 *
 * Re-runs only regenerate missing entries. Pass --force to regenerate all.
 *
 * Usage:
 *   node scripts/generate-pin-descriptions.mjs
 *   node scripts/generate-pin-descriptions.mjs --limit=10
 *   node scripts/generate-pin-descriptions.mjs --force
 *   node scripts/generate-pin-descriptions.mjs --slug=foo
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const DATA = path.join(ROOT, "src", "data");

const envPath = path.join(ROOT, ".env.local");
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
    const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
}

const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY;
if (!ANTHROPIC_KEY) {
  console.error("Missing ANTHROPIC_API_KEY in .env.local");
  process.exit(1);
}

const args = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const [k, v] = a.replace(/^--/, "").split("=");
    return [k, v ?? true];
  })
);
const FORCE = Boolean(args.force);
const LIMIT = args.limit ? Number(args.limit) : Infinity;
const SLUG = args.slug ?? null;

const categories = JSON.parse(
  fs.readFileSync(path.join(DATA, "categories.json"), "utf8")
);
const pages = JSON.parse(
  fs.readFileSync(path.join(DATA, "coloring-pages.json"), "utf8")
);
const cachePath = path.join(DATA, "pin-descriptions.json");
const cache = fs.existsSync(cachePath)
  ? JSON.parse(fs.readFileSync(cachePath, "utf8"))
  : {};

const catById = Object.fromEntries(categories.map((c) => [c.id, c]));

const MODEL = "claude-haiku-4-5-20251001";

function themeFromCategory(cat) {
  return cat.name.replace(/\s*Coloring Pages.*/i, "").trim();
}

async function generateOne(page, primaryCat) {
  const theme = themeFromCategory(primaryCat);
  const system = `You write unique, high-intent Pinterest pin descriptions for a free printable monster truck coloring page site. Goals: (1) each description is visibly different in phrasing, rhythm, and hashtag mix; (2) hit long-tail Pinterest search terms that parents/teachers/kids actually search for; (3) sound warm and human, not templated; (4) never use the words "awesome", "amazing", "epic", or "click here"; (5) end with 4-6 hashtags drawn from a relevant pool — rotate them, don't repeat the same six on every pin.

Output STRICTLY as JSON: {"description": "..."} with NO commentary. The description must be <=450 characters INCLUDING the hashtags. Do not include URLs (a link is attached separately). Do not mention prices; everything is free.`;

  const user = `Coloring page: ${page.title}
Collection: ${primaryCat.name}
Theme keyword: ${theme}
Page description (source): ${page.description}
Alt text: ${page.altText}
Difficulty: ${page.difficulty}
Age range: ${page.ageRange}

Write one Pinterest pin description for this specific page. Lead with something specific to this page (not a generic "free printable..." opener). Mix in 1-2 long-tail search phrases that a parent might type into Pinterest (e.g. "monster truck coloring pages for preschoolers", "easy ${theme.toLowerCase()} coloring sheets"). End with 4-6 hashtags relevant to THIS page — vary them, don't always use the same set.`;

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": ANTHROPIC_KEY,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 400,
      system,
      messages: [{ role: "user", content: user }],
    }),
  });
  const body = await res.json();
  if (!res.ok) throw new Error(body.error?.message || `HTTP ${res.status}`);

  const text = body.content?.[0]?.text?.trim() ?? "";
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) throw new Error(`No JSON in response: ${text.slice(0, 200)}`);
  const parsed = JSON.parse(match[0]);
  if (!parsed.description) throw new Error("No description field");
  // Hard cap — Pinterest enforces 500, keep headroom.
  return parsed.description.slice(0, 500);
}

async function main() {
  let todo = pages.filter((p) => p.status === "published");
  if (SLUG) todo = todo.filter((p) => p.slug === SLUG);
  else if (!FORCE) todo = todo.filter((p) => !cache[p.id]);
  todo = todo.slice(0, LIMIT);

  if (todo.length === 0) {
    console.log("Nothing to generate.");
    return;
  }

  console.log(`Generating ${todo.length} pin description${todo.length === 1 ? "" : "s"} via ${MODEL}...`);

  for (let i = 0; i < todo.length; i++) {
    const page = todo[i];
    const primaryCat = catById[page.categoryIds[0]];
    if (!primaryCat) {
      console.warn(`  ⚠ ${page.slug}: missing category`);
      continue;
    }
    try {
      const desc = await generateOne(page, primaryCat);
      cache[page.id] = {
        description: desc,
        generated_at: new Date().toISOString(),
        model: MODEL,
      };
      // Persist after each success so a failure doesn't lose progress.
      fs.writeFileSync(cachePath, JSON.stringify(cache, null, 2));
      console.log(
        `  ✓ ${i + 1}/${todo.length} ${page.slug} (${desc.length} chars)`
      );
    } catch (err) {
      console.error(`  ✗ ${page.slug}: ${err.message}`);
    }
  }
  console.log(`\nCached to ${cachePath}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
