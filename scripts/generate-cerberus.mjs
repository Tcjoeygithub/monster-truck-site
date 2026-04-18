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
    slug: "three-head-hood-truck",
    title: "Three Head Hood Truck",
    difficulty: "hard", ageRange: "6-8",
    description: "Three dog heads are mounted right on the hood of this wild monster truck! The center head faces straight forward, the left head turns to face left, and the right head turns to face right. Each head has open jaws and pointy ears.",
    altText: "Black and white coloring page of a monster truck with three dog heads mounted on the hood facing forward and sideways",
    prompt: "A monster truck with three large dog heads mounted on the hood. The center dog head faces directly forward with open jaws. The left dog head faces left sideways with open jaws. The right dog head faces right sideways with open jaws. Each head has pointed ears and a thick neck base bolted to the hood. Heavy duty monster truck body. Side view. Four massive knobby tires."
  },
  {
    slug: "triple-exhaust-bark-truck",
    title: "Triple Exhaust Bark Truck",
    difficulty: "medium", ageRange: "4-6",
    description: "Three exhaust pipes rise up behind the cab of this wild truck, and each one is shaped like an open barking dog mouth! Round pipe body with teeth and lips at the top opening on every pipe. Loud and mean!",
    altText: "Black and white coloring page of a monster truck with three exhaust pipes shaped like open barking dog mouths",
    prompt: "A monster truck with three exhaust pipes rising behind the cab. Each exhaust pipe top is shaped like an open barking dog mouth with teeth and curled lips at the opening. The three pipes are arranged side by side. Thick heavy truck body. Side view. Four large tires."
  },
  {
    slug: "baby-cerberus-truck",
    title: "Baby Cerberus Truck",
    difficulty: "easy", ageRange: "2-4",
    description: "This adorable little monster truck has three tiny puppy heads on the hood, all with big friendly eyes and floppy ears! Simple chunky truck shape, easy to color, and super cute.",
    altText: "Black and white coloring page of a simple cute monster truck with three small puppy heads on the hood with big eyes and floppy ears",
    prompt: "A very simple cartoon monster truck with three small cute puppy heads on the hood. Each puppy head has big round friendly eyes and large floppy ears. All three heads face forward and look happy. Simple blocky truck body. Extra thick outlines. Side view. Only 6 to 7 large shapes. Big round tires."
  },
  {
    slug: "chain-leash-bumper-truck",
    title: "Chain Leash Bumper Truck",
    difficulty: "hard", ageRange: "6-8",
    description: "Heavy chain shapes hang from the front bumper like giant leashes! The grille is framed by a thick spiked dog collar shape with sharp spikes all around. This truck looks like it belongs in the underworld.",
    altText: "Black and white coloring page of a monster truck with heavy chain shapes hanging from the bumper and a spiked collar grille frame",
    prompt: "A monster truck with three heavy chains hanging down from the front bumper like leashes. Each chain has large bold oval links. The front grille is surrounded by a thick spiked dog collar shape with sharp spikes pointing outward all around. Aggressive heavy truck body. Front three-quarter view. Huge knobby tires."
  },
  {
    slug: "spiked-collar-grille-truck",
    title: "Spiked Collar Grille Truck",
    difficulty: "medium", ageRange: "4-6",
    description: "The front grille of this monster truck is surrounded by a thick spiked dog collar! Sharp spikes stick out all around the grille opening, making this truck look like the guard dog of the underworld.",
    altText: "Black and white coloring page of a monster truck with a front grille surrounded by a thick spiked dog collar shape",
    prompt: "A monster truck where the front grille opening is surrounded by a wide thick spiked dog collar ring. Sharp triangular spikes point outward all the way around the collar. The collar sits flat against the front face of the truck. Side view. Standard heavy truck body. Four big tires."
  },
  {
    slug: "dog-bone-spoiler-truck",
    title: "Dog Bone Spoiler Truck",
    difficulty: "easy", ageRange: "2-4",
    description: "Check out that spoiler! The rear wing on this truck is shaped exactly like a big dog bone. Up front, there is one cute dog head on the hood. Simple shapes, easy to color, and totally fun!",
    altText: "Black and white coloring page of a simple monster truck with a rear spoiler shaped like a giant dog bone and one dog head on the hood",
    prompt: "A simple cartoon monster truck with a rear spoiler shaped like a large dog bone with round knobs at each end. One cute dog head sits on the front center of the hood facing forward. Simple blocky truck shape. Extra thick outlines. Side view. Large round tires."
  },
  {
    slug: "paw-print-wheels-truck",
    title: "Paw Print Wheels Truck",
    difficulty: "easy", ageRange: "2-4",
    description: "Every wheel hub on this truck is shaped like a dog paw print with four toe pads! The cab has small rounded dog ears on each corner of the roof. Fun and simple to color!",
    altText: "Black and white coloring page of a simple monster truck with paw print shaped wheel hubs and small ears on the cab roof",
    prompt: "A simple cartoon monster truck where each of the four wheel hubs is shaped like a dog paw print with a large central pad and four round toe pads. Two small rounded dog ears sit on the top corners of the cab roof. Simple blocky truck body. Extra thick outlines. Side view."
  },
  {
    slug: "guard-dog-stance-truck",
    title: "Guard Dog Stance Truck",
    difficulty: "medium", ageRange: "4-6",
    description: "This truck is built in a wide aggressive stance like a guard dog bracing for action! Extra wide wheelbase, low center of gravity, front end dipped down like a dog ready to pounce. Built to protect and dominate.",
    altText: "Black and white coloring page of a monster truck in a wide aggressive low stance like a guard dog bracing",
    prompt: "A monster truck in a very wide aggressive stance with a very wide wheelbase and low center of gravity. The front end angles downward like a dog crouching and bracing. The suspension is visibly spread wide and low. The body is broad and flat. Side view. Four massive wide tires spread far apart."
  },
  {
    slug: "hellhound-fire-exhaust-truck",
    title: "Hellhound Fire Exhaust Truck",
    difficulty: "hard", ageRange: "6-8",
    description: "Three exhaust pipes shaped like dog snouts rise from behind the cab, and each one shoots bold flame shapes from the opening! The flames are drawn as bold outlined shapes rising upward from each snout pipe. Hellfire power!",
    altText: "Black and white coloring page of a monster truck with three dog snout exhaust pipes shooting flame shapes from each opening",
    prompt: "A monster truck with three exhaust pipes rising behind the cab, each shaped like a dog snout with nostrils. Bold outlined flame shapes shoot upward from the opening of each snout pipe. The flames are large teardrop and spike shapes. Heavy aggressive truck body. Side view. Four huge tires."
  },
  {
    slug: "wagging-tail-antenna-truck",
    title: "Wagging Tail Antenna Truck",
    difficulty: "easy", ageRange: "2-4",
    description: "This happy truck has a curved dog tail as the antenna, wagging upward from the roof! On the front grille, three small cute dog faces are arranged side by side. Simple and cheerful, perfect for little kids.",
    altText: "Black and white coloring page of a simple monster truck with a curved dog tail antenna and three small dog faces on the grille",
    prompt: "A simple cartoon monster truck with a curved dog tail shape as the antenna sticking up and curving from the cab roof. Three small cute dog faces are arranged side by side on the front grille. Each face has round eyes and a small nose. Simple blocky truck shape. Extra thick outlines. Side view. Large round tires."
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
  const catId = "cat-cerberus-monster-truck-coloring-pages";
  if (!cats.find(c => c.id === catId)) {
    cats.push({ id: catId, slug: "cerberus-monster-truck-coloring-pages", name: "Cerberus Monster Truck Coloring Pages",
      description: "Free printable Cerberus monster truck coloring pages for kids ages 2-8. Three-headed hood designs, spiked collar grilles, chain leash bumpers, hellhound exhaust pipes — every truck is built like a mythical beast. Bold outlines, ready to print!",
      type: "theme" });
    fs.writeFileSync(catsPath, JSON.stringify(cats, null, 2));
    console.log("Created Cerberus category");
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
  console.log(`\n✅ Cerberus collection complete: ${PAGES.length} pages`);
}
main().catch(e => { console.error(e); process.exit(1); });
