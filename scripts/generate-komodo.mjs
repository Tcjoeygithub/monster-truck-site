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
    slug: "forked-tongue-bumper-truck",
    title: "Forked Tongue Bumper Truck",
    difficulty: "medium", ageRange: "4-6",
    description: "This truck has a wild front bumper built from two long forked tongue shapes extending forward from the grille! Each prong of the fork curves slightly outward, just like a real komodo dragon's tongue.",
    altText: "Black and white coloring page of a monster truck with two long forked tongue shapes as the front bumper",
    prompt: "A monster truck with a front bumper made of two long forked tongue shapes extending forward from the grille. The tongue fork splits into two prongs at the front, each curving slightly outward. The grille sits above where the tongue base connects to the truck body. Side view. Four huge knobby tires."
  },
  {
    slug: "komodo-jaw-hood-truck",
    title: "Komodo Jaw Hood Truck",
    difficulty: "hard", ageRange: "6-8",
    description: "The hood of this powerful truck is shaped exactly like a komodo dragon's wide flat head with a strong lower jaw built into the front end. The flat skull shape extends forward with heavy jaw lines on each side.",
    altText: "Black and white coloring page of a monster truck with a hood shaped like a komodo dragon's wide flat head and jaw",
    prompt: "A monster truck where the entire hood is shaped like a komodo dragon's wide flat skull. The front of the hood has a thick wide lower jaw structure built into the front end with heavy jaw line ridges on each side. The hood surface is flat and low like a reptile skull. Side view. Four oversized tires."
  },
  {
    slug: "baby-komodo-truck",
    title: "Baby Komodo Truck",
    difficulty: "easy", ageRange: "2-4",
    description: "This adorable little truck has a small lizard head on the hood, a long thick tail built into the rear bumper, and big cute round eyes. Easy shapes and thick outlines make it perfect for the youngest colorers!",
    altText: "Black and white coloring page of a simple cute monster truck with a small lizard head on the hood and a long tail bumper",
    prompt: "A very simple cartoon monster truck with a small cute lizard head mounted on the front of the hood with big round friendly eyes. A long thick rounded tail shape extends from the rear bumper dragging slightly behind. Side view. Only 5 to 6 large simple shapes. Extra thick outlines."
  },
  {
    slug: "venom-drip-grille-truck",
    title: "Venom Drip Grille Truck",
    difficulty: "medium", ageRange: "4-6",
    description: "The grille on this truck has long drip shapes hanging down from the top like komodo dragon venom! Each drip is a different length, and the grille bars behind them look thick and menacing.",
    altText: "Black and white coloring page of a monster truck with a grille featuring long venom drip shapes hanging from the top",
    prompt: "A monster truck with a large front grille that has long teardrop drip shapes hanging down from the top bar of the grille, like drops of venom dripping down. The drips are different lengths. The grille bars behind the drips are thick and heavy. Side view. Four huge tires."
  },
  {
    slug: "monitor-tail-exhaust-truck",
    title: "Monitor Tail Exhaust Truck",
    difficulty: "medium", ageRange: "4-6",
    description: "Instead of regular exhaust pipes, this truck has one huge thick exhaust shaped like a komodo dragon's heavy muscular tail! It drags behind the truck low to the ground, thick at the base and tapering to a point.",
    altText: "Black and white coloring page of a monster truck with a thick komodo dragon tail shape as the rear exhaust",
    prompt: "A monster truck where the rear exhaust is a single thick heavy tube shaped like a monitor lizard tail, attached at the back of the truck and dragging low behind it. The tail shape is thick and muscular at the base where it connects to the truck and tapers to a rounded point. Side view. Four big tires."
  },
  {
    slug: "scaly-armor-fender-truck",
    title: "Scaly Armor Fender Truck",
    difficulty: "hard", ageRange: "6-8",
    description: "This truck is covered in protection! The fenders are built with thick raised scale armor plates covering every inch, each scale overlapping the next like real komodo dragon skin. Heavy duty and ready for anything.",
    altText: "Black and white coloring page of a monster truck with thick raised scale armor plates covering the fenders",
    prompt: "A monster truck with fenders completely covered in thick raised armor scale plates. Each scale is a rounded rectangular shape that overlaps the next scale below it, like lizard skin or armor. The scales cover both front and rear fenders entirely. Side view. Four large tires."
  },
  {
    slug: "komodo-claw-wheels-truck",
    title: "Komodo Claw Wheels Truck",
    difficulty: "hard", ageRange: "6-8",
    description: "Look at those wheel hubs! Each one is shaped like a lizard foot with five claws splayed outward from the center. The claws stick out past the tire edges making this truck look like it could grab the ground.",
    altText: "Black and white coloring page of a monster truck with wheel hubs shaped like splayed lizard claws",
    prompt: "A monster truck where each of the four wheel hub caps is shaped like a lizard foot with five thick claws splaying outward from the center hub. The claw tips extend past the edge of the tires. Side view. The wheel claw hubs are clearly visible and detailed."
  },
  {
    slug: "flat-skull-cab-truck",
    title: "Flat Skull Cab Truck",
    difficulty: "medium", ageRange: "4-6",
    description: "The cab on this truck is built super low and flat, shaped just like a komodo dragon's skull! The roof barely rises above the body, the windshield is wide and low, and the whole cab has that flat reptile head profile.",
    altText: "Black and white coloring page of a monster truck with a very low flat cab shaped like a komodo skull",
    prompt: "A monster truck with a cab that is extremely low and flat like a komodo dragon skull shape. The roofline is nearly flat with very little height. The windshield is wide and very low. The front of the cab slopes forward like a reptile snout. Side view. Four huge tires."
  },
  {
    slug: "lizard-eye-headlights-truck",
    title: "Lizard Eye Headlights Truck",
    difficulty: "easy", ageRange: "2-4",
    description: "This truck has the most unique headlights — each one has a vertical slit pupil just like a reptile's eye! The headlight housings are oval shaped with a bold vertical slit in the center of each one.",
    altText: "Black and white coloring page of a monster truck with oval headlights featuring vertical slit pupils like reptile eyes",
    prompt: "A monster truck with two large oval headlights on the front, each headlight has a bold vertical slit shape in the center like a reptile or lizard eye pupil. The headlight housings are prominent oval shapes. Side view. Simple design. Four big tires. Extra thick outlines."
  },
  {
    slug: "tongue-flick-antenna-truck",
    title: "Tongue Flick Antenna Truck",
    difficulty: "easy", ageRange: "2-4",
    description: "A simple fun truck with one special detail — the antenna on top is shaped like a forked lizard tongue! The fork flicks up from a thin antenna base, with two little prongs at the top.",
    altText: "Black and white coloring page of a simple monster truck with a forked tongue shaped antenna on the roof",
    prompt: "A simple cartoon monster truck with a single antenna on the roof that ends in a forked lizard tongue shape at the top. The antenna is a thin rod with a Y-shaped fork at the tip like a snake or komodo tongue. Side view. Simple clean design. Extra thick outlines. Four big tires."
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
  const catId = "cat-komodo-dragon-monster-truck-coloring-pages";
  if (!cats.find(c => c.id === catId)) {
    cats.push({ id: catId, slug: "komodo-dragon-monster-truck-coloring-pages", name: "Komodo Dragon Monster Truck Coloring Pages",
      description: "Free printable komodo dragon monster truck coloring pages for kids ages 2-8. Forked tongue bumpers, jaw hoods, venom drip grilles, scaly armor fenders, claw wheels — every truck is built like the world's biggest lizard. Bold outlines, ready to print!",
      type: "theme" });
    fs.writeFileSync(catsPath, JSON.stringify(cats, null, 2));
    console.log("Created Komodo Dragon category");
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
  console.log(`\n✅ Komodo Dragon collection complete: ${PAGES.length} pages`);
}
main().catch(e => { console.error(e); process.exit(1); });
