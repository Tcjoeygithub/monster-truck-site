#!/usr/bin/env node
/**
 * audit-trucks.mjs — Run Gemini vision over every published coloring page
 * and identify the ones that DON'T feature a monster truck as the primary
 * subject. Writes results to src/data/truck-audit.json and optionally
 * marks failing pages as status="draft" (hidden from site).
 *
 * Usage:
 *   node scripts/audit-trucks.mjs             # audit + report only
 *   node scripts/audit-trucks.mjs --hide      # also set status=draft on failures
 *   node scripts/audit-trucks.mjs --limit=N   # audit first N only
 *   node scripts/audit-trucks.mjs --refresh   # re-audit even pages already checked
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const DATA = path.join(ROOT, "src", "data");
const IMAGES = path.join(ROOT, "public", "images", "coloring-pages");

for (const line of fs.readFileSync(path.join(ROOT, ".env.local"), "utf8").split("\n")) {
  const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
}
const KEY = (process.env.GOOGLE_IMAGEN_API_KEY || "").trim();
if (!KEY) { console.error("Missing GOOGLE_IMAGEN_API_KEY"); process.exit(1); }

const args = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const [k, v] = a.replace(/^--/, "").split("=");
    return [k, v ?? true];
  })
);
const HIDE = Boolean(args.hide);
const LIMIT = args.limit ? Number(args.limit) : Infinity;
const REFRESH = Boolean(args.refresh);

const auditPath = path.join(DATA, "truck-audit.json");
const audit = fs.existsSync(auditPath)
  ? JSON.parse(fs.readFileSync(auditPath, "utf8"))
  : {};

const pages = JSON.parse(
  fs.readFileSync(path.join(DATA, "coloring-pages.json"), "utf8")
);

const PROMPT = `Look at this image. It is supposed to be a black-and-white line-art coloring page whose PRIMARY SUBJECT is a MONSTER TRUCK — meaning a truck with oversized tires, a large truck body, and visible monster-truck character (big wheels, raised suspension, truck shape).

Answer STRICTLY in JSON only:
{
  "is_monster_truck": <true|false>,
  "primary_subject": "<brief description of what you actually see>",
  "has_truck_body": <true|false>,
  "has_oversized_wheels": <true|false>,
  "confidence": <1-10>
}

is_monster_truck = true ONLY if the image clearly contains a monster truck as the dominant/main subject. If the image is mostly of other items (bakery goods, flowers, animals, people, scenery) without a monster truck, OR if the "truck" is barely visible / secondary, set is_monster_truck = false.`;

async function check(imagePath) {
  const fullPath = path.join(ROOT, "public", imagePath);
  if (!fs.existsSync(fullPath)) return { error: "missing file" };
  const b64 = fs.readFileSync(fullPath).toString("base64");
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          { parts: [
              { text: PROMPT },
              { inlineData: { mimeType: "image/png", data: b64 } },
            ],
          },
        ],
        generationConfig: { temperature: 0.0, maxOutputTokens: 512 },
      }),
    }
  );
  if (!res.ok) return { error: `HTTP ${res.status}` };
  const data = await res.json();
  const text = data.candidates?.[0]?.content?.parts?.map(p=>p.text||"").join("") || "";
  const match = text.replace(/```json\s*/g,"").replace(/```\s*/g,"").match(/\{[\s\S]*\}/);
  if (!match) return { error: "unparseable", raw: text.slice(0,200) };
  try { return JSON.parse(match[0]); } catch { return { error: "invalid json" }; }
}

async function main() {
  const todo = pages
    .filter((p) => p.status === "published")
    .filter((p) => REFRESH || !audit[p.id])
    .slice(0, LIMIT);

  console.log(`Auditing ${todo.length} pages (of ${pages.length} total)...`);
  let bad = 0;
  for (let i = 0; i < todo.length; i++) {
    const p = todo[i];
    const r = await check(p.imagePath);
    audit[p.id] = { slug: p.slug, title: p.title, ...r, checked_at: new Date().toISOString() };
    fs.writeFileSync(auditPath, JSON.stringify(audit, null, 2));

    const ok = r.is_monster_truck === true;
    if (!ok) bad++;
    const flag = ok ? "✓" : "✗";
    console.log(`  ${flag} ${i+1}/${todo.length} ${p.slug} — ${r.primary_subject || r.error}`);
  }

  // Summary
  const allChecked = Object.entries(audit).filter(([,v]) => !v.error);
  const failing = allChecked.filter(([,v]) => v.is_monster_truck === false);
  console.log(`\n=== Summary ===`);
  console.log(`Checked: ${allChecked.length}`);
  console.log(`Passing: ${allChecked.length - failing.length}`);
  console.log(`NOT A MONSTER TRUCK: ${failing.length}`);
  if (failing.length > 0) {
    console.log("\nFailing pages:");
    for (const [id, v] of failing) {
      console.log(`  ${v.slug} — "${v.primary_subject}"`);
    }
  }

  if (HIDE && failing.length > 0) {
    const failIds = new Set(failing.map(([id]) => id));
    const updated = pages.map((p) =>
      failIds.has(p.id) && p.status === "published"
        ? { ...p, status: "draft", updatedAt: new Date().toISOString() }
        : p
    );
    fs.writeFileSync(
      path.join(DATA, "coloring-pages.json"),
      JSON.stringify(updated, null, 2)
    );
    console.log(`\nHid ${failIds.size} pages (set status=draft)`);
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
