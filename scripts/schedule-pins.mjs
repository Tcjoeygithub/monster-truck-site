#!/usr/bin/env node
/**
 * schedule-pins.mjs
 *
 * For each published coloring page that hasn't been pinned yet, schedule a
 * Pinterest pin via Zippy Scheduler. Pins are staggered across the next 24
 * hours starting from the current time.
 *
 * Pin link targets the collection LISTICLE page (not the PDF) so clicks drive
 * ad-revenue page views.
 *
 * State tracking: writes `src/data/pinned.json` with { [pageId]: iso } so reruns
 * only schedule pins for new pages.
 *
 * Usage:
 *   node scripts/schedule-pins.mjs              # schedule any unpinned pages
 *   node scripts/schedule-pins.mjs --dry-run    # show what would be scheduled
 *   node scripts/schedule-pins.mjs --limit=5    # cap at N new pins this run
 *   node scripts/schedule-pins.mjs --slug=foo   # single page by slug
 *   node scripts/schedule-pins.mjs --days=7     # spread across N days (default 1)
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const DATA = path.join(ROOT, "src", "data");

// Load .env.local
const envPath = path.join(ROOT, ".env.local");
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
    const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
}

const ZIPPY_KEY = process.env.ZIPPY_SCHEDULER_API_KEY;
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  "https://freemonstertruckcoloringpages.com";
const ZIPPY_BASE = "https://www.zippyscheduler.com/api/v1";

if (!ZIPPY_KEY) {
  console.error("Missing ZIPPY_SCHEDULER_API_KEY in .env.local");
  process.exit(1);
}

const args = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const [k, v] = a.replace(/^--/, "").split("=");
    return [k, v ?? true];
  })
);
const DRY = Boolean(args["dry-run"]);
const LIMIT = args.limit ? Number(args.limit) : Infinity;
const SLUG = args.slug ?? null;
const DAYS = args.days ? Number(args.days) : 1;

const categories = JSON.parse(
  fs.readFileSync(path.join(DATA, "categories.json"), "utf8")
);
const pages = JSON.parse(
  fs.readFileSync(path.join(DATA, "coloring-pages.json"), "utf8")
);
const boardMap = JSON.parse(
  fs.readFileSync(path.join(DATA, "pinterest-boards.json"), "utf8")
);
const pinnedPath = path.join(DATA, "pinned.json");
const pinned = fs.existsSync(pinnedPath)
  ? JSON.parse(fs.readFileSync(pinnedPath, "utf8"))
  : {};
const descPath = path.join(DATA, "pin-descriptions.json");
const descCache = fs.existsSync(descPath)
  ? JSON.parse(fs.readFileSync(descPath, "utf8"))
  : {};

const catById = Object.fromEntries(categories.map((c) => [c.id, c]));

function hashtag(catName) {
  return (
    "#" +
    catName
      .toLowerCase()
      .replace(/[^a-z0-9 ]/g, "")
      .replace(/\s+/g, "")
  );
}

function buildPin(page, categoryId) {
  const cat = catById[categoryId];
  if (!cat) return null;
  const boardId = boardMap.boards[categoryId];
  if (!boardId) return null;

  const collectionUrl = `${SITE_URL}/${cat.slug}`;

  // Pinterest: title <=100, description <=500
  const title = page.title.slice(0, 100);
  // Prefer Claude-generated unique description; fall back to a simple template.
  const cached = descCache[page.id]?.description;
  const fallback = `${page.description}\n\n#monstertruck #coloringpages ${hashtag(cat.name)}`;
  const description = (cached ?? fallback).slice(0, 500);

  return {
    account_id: boardMap.account_id,
    board_id: boardId,
    title,
    description,
    link: collectionUrl,
    // Serve pin images from GitHub raw so Pinterest's fetcher isn't challenged
    // by Vercel's DDoS mitigations on the live domain. Images are same PNGs.
    image_url: `https://raw.githubusercontent.com/Tcjoeygithub/monster-truck-site/main/public${page.imagePath}`,
    alt_text: (page.altText || page.title).slice(0, 500),
  };
}

function minutesFromNow(min) {
  return new Date(Date.now() + min * 60_000).toISOString();
}

async function schedulePin(pin, scheduled_for) {
  const res = await fetch(`${ZIPPY_BASE}/pins`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${ZIPPY_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ...pin, scheduled_for }),
  });
  const body = await res.json();
  if (!res.ok) throw new Error(body.error || `HTTP ${res.status}`);
  return body.pin;
}

async function main() {
  let todo = pages.filter((p) => p.status === "published");
  if (SLUG) todo = todo.filter((p) => p.slug === SLUG);
  else todo = todo.filter((p) => !pinned[p.id]);

  todo = todo.slice(0, LIMIT);

  if (todo.length === 0) {
    console.log("Nothing to pin.");
    return;
  }

  // Stagger across DAYS starting 5 minutes from now.
  const windowMinutes = DAYS * 24 * 60;
  const spacing = Math.floor(windowMinutes / Math.max(todo.length, 1));

  console.log(
    `Scheduling ${todo.length} pin${todo.length === 1 ? "" : "s"} across ~${DAYS}d (~${spacing}m apart)${DRY ? " [DRY RUN]" : ""}`
  );

  for (let i = 0; i < todo.length; i++) {
    const page = todo[i];
    const primaryCat = page.categoryIds[0];
    const pin = buildPin(page, primaryCat);
    if (!pin) {
      console.warn(`  ⚠ ${page.slug}: no board for category ${primaryCat}`);
      continue;
    }
    const scheduled = minutesFromNow(5 + i * spacing);
    console.log(
      `  • ${scheduled.slice(11, 16)}  ${page.slug} → ${catById[primaryCat].name}`
    );
    if (!DRY) {
      try {
        const result = await schedulePin(pin, scheduled);
        pinned[page.id] = {
          scheduled_for: scheduled,
          board_id: pin.board_id,
          zippy_pin_id: result?.id,
          pinned_at: new Date().toISOString(),
        };
      } catch (err) {
        console.error(`    ✗ ${err.message}`);
      }
    }
  }

  if (!DRY) {
    fs.writeFileSync(pinnedPath, JSON.stringify(pinned, null, 2));
    console.log(`\nUpdated ${pinnedPath}`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
