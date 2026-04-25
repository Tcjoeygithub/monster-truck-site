#!/usr/bin/env node
/**
 * enrich-collections.mjs — Use Claude to write rich, unique, educational
 * descriptions + FAQs for every collection. Replaces the short 1-2 sentence
 * descriptions with 300-500 word intros that provide real value.
 *
 * Adds to each category:
 *   - richDescription: 300-500 word educational intro (HTML allowed)
 *   - faqs: [{question, answer}] array for FAQ schema
 *   - coloringTips: 3-4 age-appropriate tips specific to this theme
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

const args = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const [k, v] = a.replace(/^--/, "").split("=");
    return [k, v ?? true];
  })
);
const FORCE = Boolean(args.force);
const LIMIT = args.limit ? Number(args.limit) : Infinity;

async function enrichOne(cat, pageCount) {
  const theme = cat.name.replace(/\s*Monster Truck Coloring Pages$/i, "").trim();

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": ANTHROPIC,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 2000,
      system: `You write educational, parent-friendly content for a free monster truck coloring page website targeting kids ages 2-8 and their parents/teachers. Write naturally — warm, helpful, not salesy. Include real educational value about child development, creativity, and the specific theme.`,
      messages: [{
        role: "user",
        content: `Write content for the "${cat.name}" collection page (${pageCount} free printable pages).

Return ONLY JSON:
{
  "richDescription": "A 300-500 word intro paragraph for this collection. Start with what makes this collection special. Include: why kids love ${theme} + monster trucks together, what age groups benefit most, how coloring helps fine motor skills and creativity, specific things kids will enjoy coloring in this set (mention 2-3 specific page types without exact titles), a note for teachers/parents about using these in classrooms or at home. Write in a warm conversational tone. Use simple HTML: <p>, <strong>, <em> for formatting. 3-4 paragraphs.",
  "faqs": [
    {"question": "What age group are these ${theme} monster truck coloring pages best for?", "answer": "A helpful 2-3 sentence answer mentioning the mix of easy/medium/hard pages"},
    {"question": "Are these coloring pages really free?", "answer": "Yes answer with details about printing"},
    {"question": "How can I use these ${theme} coloring pages in the classroom?", "answer": "2-3 practical classroom activity ideas"},
    {"question": "What supplies work best for coloring these pages?", "answer": "Age-appropriate supply recommendations"},
    {"question": "Can my toddler color these ${theme} monster truck pages?", "answer": "Mention the easy pages with thick outlines designed for ages 2-4"}
  ],
  "coloringTips": [
    "A tip specific to coloring ${theme}-themed trucks",
    "An age-appropriate technique tip",
    "A creative suggestion for this theme",
    "A fun activity idea using the finished coloring pages"
  ]
}`
      }],
    }),
  });
  if (!res.ok) throw new Error(`Claude ${res.status}: ${await res.text()}`);
  const body = await res.json();
  const text = body.content?.[0]?.text ?? "";
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) throw new Error("No JSON in response");
  return JSON.parse(match[0]);
}

async function main() {
  const catsPath = path.join(DATA, "categories.json");
  const pagesPath = path.join(DATA, "coloring-pages.json");
  const cats = JSON.parse(fs.readFileSync(catsPath, "utf8"));
  const pages = JSON.parse(fs.readFileSync(pagesPath, "utf8"));

  let todo = cats.filter((c) => FORCE || !c.richDescription);
  todo = todo.slice(0, LIMIT);

  if (todo.length === 0) {
    console.log("All collections already enriched.");
    return;
  }

  console.log(`Enriching ${todo.length} collections...`);

  for (let i = 0; i < todo.length; i++) {
    const cat = todo[i];
    const pageCount = pages.filter(
      (p) => p.categoryIds.includes(cat.id) && p.status === "published"
    ).length;

    process.stdout.write(`  [${i + 1}/${todo.length}] ${cat.name}... `);
    try {
      const enriched = await enrichOne(cat, pageCount);

      // Find and update the category in the main array
      const idx = cats.findIndex((c) => c.id === cat.id);
      cats[idx].richDescription = enriched.richDescription;
      cats[idx].faqs = enriched.faqs;
      cats[idx].coloringTips = enriched.coloringTips;

      // Save after each success
      fs.writeFileSync(catsPath, JSON.stringify(cats, null, 2));
      console.log(`✓ (${enriched.richDescription.length} chars)`);
    } catch (e) {
      console.log(`✗ ${e.message}`);
    }
  }

  console.log(`\nDone. Enriched ${todo.length} collections.`);
}

main().catch((e) => { console.error(e); process.exit(1); });
