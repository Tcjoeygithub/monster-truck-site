#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const IMAGES = path.join(ROOT, "public", "images", "coloring-pages");

for (const line of fs.readFileSync(path.join(ROOT, ".env.local"), "utf8").split("\n")) {
  const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
}
const KEY = (process.env.GOOGLE_IMAGEN_API_KEY || "").trim();

const SUFFIX = "Black and white line art ONLY, coloring book style for young children ages 2-8, bold thick clean outlines only, simple shapes, NO COLOR, NO shading, NO gray fill, strictly black outlines on white background, NO text in image. The complete monster truck must be fully visible with white margins on all sides.";

const PAGES = [
  {
    slug: "fire-breathing-dragon-truck",
    title: "Fire-Breathing Dragon Truck",
    difficulty: "medium", ageRange: "4-6",
    description: "This fierce monster truck has a massive dragon head mounted right on the hood — mouth wide open with flames shooting out! Dragon scales cover the sides while huge knobby tires launch it off a dirt ramp. Grab your crayons and bring the fire to life!",
    altText: "Black and white coloring page of a monster truck with a dragon head on the hood breathing fire, jumping off a ramp",
    prompt: "A monster truck with a large dragon head sculpture mounted on the hood. The dragon mouth is wide open with flame shapes coming out. The truck body has fish-scale patterns on the side panels. Four huge knobby tires. Side view of the truck jumping off a dirt ramp."
  },
  {
    slug: "dragon-wing-monster-truck",
    title: "Dragon Wing Monster Truck",
    difficulty: "hard", ageRange: "6-8",
    description: "What if a monster truck could fly? This one has two massive dragon wings spread out from the sides and a dragon tail hanging off the back! It's soaring through the air with all four wheels off the ground. Color in every feather and scale!",
    altText: "Black and white coloring page of a monster truck with dragon wings spread out, flying through the air",
    prompt: "A monster truck with two big dragon wings spread out from the sides of the truck body. A dragon tail hanging off the rear bumper. The truck is mid-air flying. Front three-quarter angle view. Four oversized wheels."
  },
  {
    slug: "baby-dragon-buddy-truck",
    title: "Baby Dragon Buddy Truck",
    difficulty: "easy", ageRange: "2-4",
    description: "This adorable little monster truck has tiny dragon horns, big friendly eyes, and a cute curly tail! It's the friendliest dragon truck ever — perfect for little hands to color.",
    altText: "Black and white coloring page of a simple cute cartoon monster truck with small dragon horns and friendly eyes",
    prompt: "A very simple cartoon monster truck with tiny dragon horns on the roof, big round friendly eyes for headlights, and a small curly dragon tail on the back. Truck sitting still facing forward. Only 5 to 6 large shapes. Extra thick outlines for toddlers."
  },
  {
    slug: "dragon-claw-crusher",
    title: "Dragon Claw Crusher",
    difficulty: "hard", ageRange: "6-8",
    description: "This beast of a truck has giant dragon claws for a front bumper — and it's crushing a pile of rocks like they're nothing! Dragon scales cover every inch of the body. Can you color all those scales?",
    altText: "Black and white coloring page of a monster truck with dragon claw bumper crushing rocks, covered in dragon scales",
    prompt: "A monster truck with giant dragon claws as the front bumper, crushing a pile of rocks underneath. Dragon scales covering the entire truck body. Dust clouds around the tires. Side view action pose."
  },
  {
    slug: "two-headed-dragon-truck",
    title: "Two-Headed Dragon Truck",
    difficulty: "medium", ageRange: "4-6",
    description: "Why have one dragon head when you can have TWO? This monster truck has two fierce dragon heads on the hood, each facing a different direction with horns and sharp teeth. Double the dragon, double the fun!",
    altText: "Black and white coloring page of a monster truck with two dragon heads on the hood facing opposite directions",
    prompt: "A monster truck with two dragon heads mounted on the hood, facing opposite directions left and right. Each dragon head has horns and sharp teeth. Side view on flat ground. Big knobby monster truck tires."
  },
  {
    slug: "dragon-egg-hauler",
    title: "Dragon Egg Hauler",
    difficulty: "easy", ageRange: "2-4",
    description: "This monster truck is on a special mission — carrying a giant dragon egg! The egg is cracked and a cute baby dragon is peeking out. What color will you make the baby dragon?",
    altText: "Black and white coloring page of a simple monster truck carrying a large cracked egg with a baby dragon peeking out",
    prompt: "A simple monster truck carrying one giant cracked egg in the open truck bed. A cute baby dragon is peeking out of the crack in the egg, looking happy. Side view. Thick outlines and simple shapes."
  },
  {
    slug: "dragon-scale-armor-truck",
    title: "Dragon Scale Armor Truck",
    difficulty: "medium", ageRange: "4-6",
    description: "This truck is fully armored in dragon scales from bumper to bumper! Two curved horns sit on top of the cab, and the exhaust pipe is shaped like a dragon tail. It looks like it's ready for battle!",
    altText: "Black and white coloring page of a monster truck covered in dragon scale pattern with horns on the roof",
    prompt: "A monster truck completely covered in overlapping dragon scale pattern on every body panel. Two curved dragon horns on top of the cab roof. The exhaust pipe is shaped like a dragon tail curving upward. Side view with simple mountains in background."
  },
  {
    slug: "dragon-vs-monster-truck",
    title: "Dragon vs Monster Truck",
    difficulty: "hard", ageRange: "6-8",
    description: "It's the ultimate showdown — a giant dragon facing off against a monster truck! They're the same size, staring each other down. Who wins? You decide while you color!",
    altText: "Black and white coloring page of a cartoon dragon and a monster truck facing each other in a standoff",
    prompt: "A big cartoon dragon standing on the left side, face to face with a monster truck on the right side. Both are the same size. The dragon has wings spread open. The truck has huge tires. They are staring each other down on flat ground."
  },
  {
    slug: "ice-dragon-frost-truck",
    title: "Ice Dragon Frost Truck",
    difficulty: "medium", ageRange: "4-6",
    description: "Not all dragons breathe fire! This monster truck has an ice dragon theme with sharp crystal spikes, hanging icicles, and frost breath shooting from the dragon head on the hood. Cool as ice!",
    altText: "Black and white coloring page of a monster truck with ice crystal spikes and an ice dragon head on the hood",
    prompt: "A monster truck with sharp ice crystal spikes sticking up from the roof. Icicle shapes hanging from the front and rear bumpers. An ice dragon head on the hood with frost breath shapes coming from its mouth. Side view on snowy ground."
  },
  {
    slug: "dragon-rider-truck",
    title: "Dragon Rider Truck",
    difficulty: "easy", ageRange: "2-4",
    description: "A friendly little dragon is riding on top of this monster truck, holding on tight with a big smile! The dragon has tiny wings and a curly tail. This one's perfect for the youngest monster truck fans!",
    altText: "Black and white coloring page of a simple monster truck with a small friendly dragon riding on top of the cab",
    prompt: "A simple cartoon monster truck with a small friendly dragon sitting on top of the truck cab, holding on with its claws and smiling. The dragon has small wings and a curly tail. Side view. Thick outlines for young kids."
  }
];

async function generate(prompt) {
  const full = prompt + " " + SUFFIX;
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key=${KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: full }] }],
        generationConfig: { responseModalities: ["IMAGE", "TEXT"] },
      }),
    }
  );
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  for (const p of data.candidates?.[0]?.content?.parts ?? []) {
    if (p.inlineData?.data) return Buffer.from(p.inlineData.data, "base64");
  }
  throw new Error("No image in response");
}

async function main() {
  fs.mkdirSync(IMAGES, { recursive: true });
  for (let i = 0; i < PAGES.length; i++) {
    const p = PAGES[i];
    console.log(`[${i + 1}/10] ${p.title}...`);
    try {
      const buf = await generate(p.prompt);
      fs.writeFileSync(path.join(IMAGES, `${p.slug}.png`), buf);
      fs.writeFileSync(path.join(IMAGES, `${p.slug}-thumb.png`), buf);
      console.log(`  ✓ ${(buf.length / 1024).toFixed(0)} KB`);
    } catch (e) {
      console.log(`  ✗ ${e.message}`);
    }
  }

  // Add category + pages to data files
  const catsPath = path.join(ROOT, "src/data/categories.json");
  const pagesPath = path.join(ROOT, "src/data/coloring-pages.json");
  const cats = JSON.parse(fs.readFileSync(catsPath, "utf8"));
  const pages = JSON.parse(fs.readFileSync(pagesPath, "utf8"));

  const catId = "cat-dragon-monster-truck-coloring-pages";
  if (!cats.find(c => c.id === catId)) {
    cats.push({
      id: catId,
      slug: "dragon-monster-truck-coloring-pages",
      name: "Dragon Monster Truck Coloring Pages",
      description: "Free printable dragon monster truck coloring pages for kids ages 2-8. Fire-breathing dragons, dragon wings, dragon scales, and epic dragon battles — all on monster trucks with oversized wheels. Bold outlines, easy to print, ready to color!",
      type: "theme",
    });
    fs.writeFileSync(catsPath, JSON.stringify(cats, null, 2));
    console.log("\nCreated Dragon category");
  }

  const now = new Date().toISOString();
  const today = now.split("T")[0];
  for (const p of PAGES) {
    if (pages.find(x => x.slug === p.slug)) continue;
    pages.push({
      id: `page-${p.slug.slice(0, 8)}-${Date.now().toString(36).slice(-4)}`,
      slug: p.slug,
      title: p.title,
      description: p.description,
      metaDescription: `Free printable ${p.title} coloring page for kids. Bold outlines, easy to color. Download and print for free!`,
      altText: p.altText,
      imagePath: `/images/coloring-pages/${p.slug}.png`,
      thumbnailPath: `/images/coloring-pages/${p.slug}-thumb.png`,
      categoryIds: [catId],
      difficulty: p.difficulty,
      ageRange: p.ageRange,
      status: "published",
      featured: false,
      publishDate: today,
      createdAt: now,
      updatedAt: now,
    });
  }
  fs.writeFileSync(pagesPath, JSON.stringify(pages, null, 2));
  console.log(`Published ${PAGES.length} dragon pages`);
}

main().catch(e => { console.error(e); process.exit(1); });
