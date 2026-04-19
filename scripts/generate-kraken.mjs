#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const IMAGES = path.join(ROOT, "public", "images", "coloring-pages");

for (const line of fs.readFileSync(path.join(ROOT, ".env.local"), "utf8").split("\n")) {
  const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
}
const KEY = (process.env.GOOGLE_IMAGEN_API_KEY || "").trim();

const SUFFIX = "Black and white line art ONLY, coloring book style for young children ages 2-8, bold thick clean outlines only, simple shapes, NO COLOR, NO shading, NO gray fill, strictly black outlines on white background, NO text in image. IMPORTANT: Do NOT draw any border, frame, box, or rectangle around the image. Just the truck on a plain white background. The complete monster truck must be fully visible.";

const PAGES = [
  {
    slug: "kraken-tentacle-bumper-truck",
    title: "Kraken Tentacle Bumper Truck",
    difficulty: "hard", ageRange: "6-8",
    description: "This truck looks like it crawled up from the deep! Massive kraken tentacles curl forward from both sides of the bumper, each covered in rows of large suction cups. The tentacles wrap around the front like the truck is ready to grab and crush everything in its path.",
    altText: "Black and white coloring page of a monster truck with giant kraken tentacles with suction cups curling out from the front bumper",
    prompt: "A monster truck with massive kraken tentacles curling forward from both sides of the front bumper. Each tentacle is thick with large suction cup circles along the underside. The tentacles curl inward toward the center as if grabbing forward. Side view. Four huge knobby tires."
  },
  {
    slug: "giant-eye-hood-truck",
    title: "Giant Eye Hood Truck",
    difficulty: "medium", ageRange: "4-6",
    description: "Look at that hood! The entire hood of this monster truck is one gigantic kraken eye with a long vertical slit pupil staring straight ahead. The eyelid edges are built into the hood panels. Creepy and cool!",
    altText: "Black and white coloring page of a monster truck with the entire hood shaped as one enormous kraken eye with a vertical slit pupil",
    prompt: "A monster truck where the entire hood panel is shaped like one enormous kraken eye. A long vertical slit pupil runs down the center of the hood. The upper and lower eyelid edges are formed by the hood body panels. Side view. Four oversized tires."
  },
  {
    slug: "baby-kraken-truck",
    title: "Baby Kraken Truck",
    difficulty: "easy", ageRange: "2-4",
    description: "Aww, this little sea monster truck is so cute! Small chubby tentacles stick out from the bumper like little arms, a big round friendly eye sits on the hood, and a tiny dorsal fin pokes up from the roof. Easy and adorable to color!",
    altText: "Black and white coloring page of a simple cute monster truck with small tentacles as bumper, big round eye on hood, and tiny fin on roof",
    prompt: "A very simple cartoon monster truck with small chubby tentacles sticking forward from the front bumper. One large round friendly eye centered on the hood. A single small rounded fin on top of the cab roof. Side view. Only 5 to 6 large shapes. Extra thick outlines."
  },
  {
    slug: "ship-wreck-cargo-truck",
    title: "Ship Wreck Cargo Truck",
    difficulty: "hard", ageRange: "6-8",
    description: "The truck bed is hauling something wild! A broken ship hull sits in the cargo bed, splintered and crushed by thick tentacle shapes squeezing around it. The mast is snapped in half and the hull planks are cracked apart. A deep sea destroyer!",
    altText: "Black and white coloring page of a monster truck with a broken ship hull being crushed by tentacle shapes in the truck bed",
    prompt: "A monster truck with a large open truck bed. Inside the bed sits a broken ship hull with cracked planks and a snapped mast. Thick tentacle shapes wrap around and squeeze the ship hull from each side. Side view. Four large tires."
  },
  {
    slug: "suction-cup-wheels-truck",
    title: "Suction Cup Wheels Truck",
    difficulty: "medium", ageRange: "4-6",
    description: "These wheels grip everything! Each of the four huge tires is covered in large raised suction cup bulges across the entire surface, just like a kraken tentacle. This truck could climb straight up a wall!",
    altText: "Black and white coloring page of a monster truck with all four tires covered in large suction cup bulge shapes",
    prompt: "A monster truck where all four tires are completely covered in large round suction cup bulge shapes across the entire tire surface. Each suction cup is a raised circle with a round indent in the center. Side view. Wide truck body."
  },
  {
    slug: "ink-cloud-exhaust-truck",
    title: "Ink Cloud Exhaust Truck",
    difficulty: "medium", ageRange: "4-6",
    description: "When this truck revs up, it sprays like a kraken! The rear exhaust pipe is shaped like a wide nozzle that fans out into a big cloud spray shape — just like a kraken squirting ink to escape predators. Unique and fun to color!",
    altText: "Black and white coloring page of a monster truck with a rear exhaust pipe shaped like an ink spray nozzle fanning out in a cloud shape",
    prompt: "A monster truck with a large exhaust pipe at the rear shaped like a wide fan nozzle. The exhaust output fans out into a large billowing cloud shape like an ink spray. The nozzle opening is wide and flat like a squid ink jet. Side view. Four big tires."
  },
  {
    slug: "deep-sea-pressure-cab-truck",
    title: "Deep Sea Pressure Cab Truck",
    difficulty: "hard", ageRange: "6-8",
    description: "This cab is built to survive the deep ocean! The entire cab is shaped like a deep sea diving bell — a round dome with thick walls and rows of large rivets around every panel edge. A small round porthole window replaces the windshield. Built like a submarine!",
    altText: "Black and white coloring page of a monster truck with the cab shaped like a deep sea diving bell dome covered in rivets with a porthole window",
    prompt: "A monster truck where the entire cab is shaped like a deep sea diving bell or submarine dome. The cab is rounded and dome-shaped with thick heavy walls. Rows of large round rivets line all the panel seams and edges. A small round porthole replaces the windshield. Side view. Four massive tires."
  },
  {
    slug: "anchor-crusher-bumper-truck",
    title: "Anchor Crusher Bumper Truck",
    difficulty: "medium", ageRange: "4-6",
    description: "The front bumper of this truck IS a giant ship anchor! The anchor shape is bolted to the front as a massive battering ram, crossbar and all, ready to smash through anything. A true sea monster of the monster truck arena!",
    altText: "Black and white coloring page of a monster truck with a large ship anchor shape as the front bumper battering ram",
    prompt: "A monster truck where the entire front bumper is shaped like a large ship anchor. The anchor has a ring at top, a thick shaft, and curved flukes at the bottom, all mounted as a solid front bumper battering ram. Side view. Four huge tires."
  },
  {
    slug: "tentacle-wrap-roll-cage-truck",
    title: "Tentacle Wrap Roll Cage Truck",
    difficulty: "easy", ageRange: "2-4",
    description: "The roll cage on this truck looks like a kraken is giving it a hug! The roll cage bars are shaped like thick tentacles that wrap and curl around the cab from below, holding the roof in their grip. Easy to color with big bold shapes!",
    altText: "Black and white coloring page of a simple monster truck with roll cage bars shaped like tentacles wrapping around the cab",
    prompt: "A simple monster truck with a roll cage whose bars are shaped like thick rounded tentacles curling and wrapping around the sides of the cab from bottom to roof. The tentacle bars have smooth curved bends. Thick outlines. Side view. Four big tires."
  },
  {
    slug: "sea-monster-crown-truck",
    title: "Sea Monster Crown Truck",
    difficulty: "easy", ageRange: "2-4",
    description: "This truck wears a crown fit for a sea monster king! A row of small tentacle tips rises up from the roof in a crown shape — some curling left, some right, some straight up. Simple, fun, and great for little colorers!",
    altText: "Black and white coloring page of a simple monster truck with small tentacle tips rising from the roof in a crown shape",
    prompt: "A simple monster truck with a crown of small stubby tentacle tips rising from the top of the cab roof. Some tentacle tips curl slightly left, some right, and some point straight up, forming a crown shape. Thick clean outlines. Side view. Four large tires."
  }
];

async function generate(slug, prompt) {
  const full = prompt + " " + SUFFIX;
  for (let attempt = 1; attempt <= 3; attempt++) {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key=${KEY}`,
      { method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [{ text: full }] }], generationConfig: { responseModalities: ["IMAGE", "TEXT"] } }) }
    );
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    for (const p of data.candidates?.[0]?.content?.parts ?? []) {
      if (p.inlineData?.data) {
        const buf = Buffer.from(p.inlineData.data, "base64");
        fs.writeFileSync(path.join(IMAGES, `${slug}.png`), buf);
        const check = execSync(`python3 -c "
from PIL import Image
img=Image.open('${path.join(IMAGES,slug+'.png')}').convert('L')
w,h=img.size;m=int(min(w,h)*0.03);edges=[]
for x in range(w):
 for y in range(m): edges.append(img.getpixel((x,y)))
 for y in range(h-m,h): edges.append(img.getpixel((x,y)))
for y in range(h):
 for x in range(m): edges.append(img.getpixel((x,y)))
 for x in range(w-m,w): edges.append(img.getpixel((x,y)))
print('border' if sum(1 for p in edges if p<128)/len(edges)>0.03 else 'clean')
"`, { encoding: "utf8" }).trim();
        if (check === "clean") return buf;
        console.log(`  attempt ${attempt}: border, retrying...`);
      }
    }
  }
  throw new Error("Failed 3 attempts");
}

async function main() {
  fs.mkdirSync(IMAGES, { recursive: true });
  for (let i = 0; i < PAGES.length; i++) {
    const p = PAGES[i];
    process.stdout.write(`[${i+1}/10] ${p.title}... `);
    try { const buf = await generate(p.slug, p.prompt); console.log(`✓ ${(buf.length/1024).toFixed(0)} KB`); }
    catch (e) { console.log(`✗ ${e.message}`); }
  }
  console.log("\nFraming...");
  for (const p of PAGES) {
    const img = path.join(IMAGES, `${p.slug}.png`);
    if (!fs.existsSync(img)) continue;
    execSync(`python3 "${path.join(ROOT,"scripts","frame-image.py")}" "${img}"`, { stdio: "pipe" });
    fs.copyFileSync(img, path.join(IMAGES, `${p.slug}-thumb.png`));
  }
  const catsPath = path.join(ROOT, "src/data/categories.json");
  const pagesPath = path.join(ROOT, "src/data/coloring-pages.json");
  const cats = JSON.parse(fs.readFileSync(catsPath, "utf8"));
  const pages = JSON.parse(fs.readFileSync(pagesPath, "utf8"));
  const catId = "cat-kraken-monster-truck-coloring-pages";
  if (!cats.find(c => c.id === catId)) {
    cats.push({ id: catId, slug: "kraken-monster-truck-coloring-pages", name: "Kraken Monster Truck Coloring Pages",
      description: "Free printable kraken monster truck coloring pages for kids ages 2-8. Tentacle bumpers, giant kraken eyes, suction cup wheels, deep sea diving bell cabs — every truck rises from the deep. Bold outlines, ready to print!",
      type: "theme" });
    fs.writeFileSync(catsPath, JSON.stringify(cats, null, 2));
    console.log("Created Kraken category");
  }
  const now = new Date().toISOString(); const today = now.split("T")[0];
  for (const p of PAGES) {
    if (pages.find(x => x.slug === p.slug)) continue;
    pages.push({ id: `page-${p.slug.slice(0,8)}-${Date.now().toString(36).slice(-4)}`, slug: p.slug, title: p.title, description: p.description,
      metaDescription: `Free printable ${p.title} coloring page for kids. Bold outlines, easy to color. Download and print for free!`,
      altText: p.altText, imagePath: `/images/coloring-pages/${p.slug}.png`, thumbnailPath: `/images/coloring-pages/${p.slug}-thumb.png`,
      categoryIds: [catId], difficulty: p.difficulty, ageRange: p.ageRange, status: "published", featured: false, publishDate: today, createdAt: now, updatedAt: now });
  }
  fs.writeFileSync(pagesPath, JSON.stringify(pages, null, 2));
  execSync("python3 scripts/generate-pdfs.py", { stdio: "pipe" });
  console.log(`\n✅ Kraken collection complete: ${PAGES.length} pages`);
}
main().catch(e => { console.error(e); process.exit(1); });
