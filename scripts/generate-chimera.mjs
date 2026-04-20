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
    slug: "lion-goat-serpent-hood-truck",
    title: "Lion Goat Serpent Hood Truck",
    difficulty: "hard", ageRange: "6-8",
    description: "The ultimate mythical mashup! This truck's hood has three heads — a lion on the left, a goat in the center, and a serpent on the right. Three beasts, one monster truck!",
    altText: "Black and white coloring page of a monster truck with a lion head, goat head, and serpent head mounted on the hood",
    prompt: "A monster truck with three animal heads mounted across the hood. A lion head on the left side, a goat head in the center, and a snake head on the right side. All three face forward. Big knobby tires. Side view."
  },
  {
    slug: "chimera-wing-fender-truck",
    title: "Chimera Wing Fender Truck",
    difficulty: "hard", ageRange: "6-8",
    description: "Dragon wings on one side, bat wings on the other! This chimera truck has mismatched fenders — one feathered, one leathery — because it's part of every beast at once.",
    altText: "Black and white coloring page of a monster truck with a dragon wing fender on one side and a bat wing fender on the other",
    prompt: "A monster truck where the left rear fender is shaped like a feathered dragon wing and the right rear fender is shaped like a leathery bat wing. The front bumper has a lion jaw on one side and a goat horn on the other. Side view. Big tires."
  },
  {
    slug: "baby-chimera-truck",
    title: "Baby Chimera Truck",
    difficulty: "easy", ageRange: "2-4",
    description: "A cute little chimera truck with a tiny lion nose on the front, small goat horns on the roof, and a curly snake tail on the back. Three animals in one adorable truck!",
    altText: "Black and white coloring page of a simple cute monster truck with lion nose, goat horns, and snake tail",
    prompt: "A very simple cartoon monster truck with a small lion nose on the front of the hood, two small goat horns on the cab roof, and a curly snake tail attached to the rear bumper. Big round friendly eyes. Only 5 to 6 large shapes. Extra thick outlines."
  },
  {
    slug: "fire-breath-exhaust-chimera-truck",
    title: "Fire Breath Exhaust Chimera Truck",
    difficulty: "medium", ageRange: "4-6",
    description: "This chimera truck breathes fire from three exhaust pipes — each shaped like a different animal mouth! A lion mouth, a goat mouth, and a snake mouth all blasting flames backward.",
    altText: "Black and white coloring page of a monster truck with three animal-mouth shaped exhaust pipes",
    prompt: "A monster truck with three exhaust pipes behind the cab. The left pipe is shaped like a lion mouth, the center pipe like a goat mouth, and the right pipe like a snake mouth. Flame shapes come from each mouth. Side view. Big tires."
  },
  {
    slug: "chimera-claw-wheel-truck",
    title: "Chimera Claw Wheel Truck",
    difficulty: "hard", ageRange: "6-8",
    description: "Every wheel on this truck is different! Front left has lion claws, front right has eagle talons, rear left has goat hooves, rear right has dragon claws. A true chimera of wheels!",
    altText: "Black and white coloring page of a monster truck where each wheel hub has a different animal claw design",
    prompt: "A monster truck where each of the four wheel hubs is a different animal shape. Front left wheel has lion claw spokes, front right has eagle talon spokes, rear left has goat hoof shape, rear right has dragon claw spokes. Side view showing all four wheels."
  },
  {
    slug: "serpent-tail-bumper-truck",
    title: "Serpent Tail Bumper Truck",
    difficulty: "medium", ageRange: "4-6",
    description: "The rear bumper of this truck IS a living snake tail! It curves up and over the truck bed with a snake head at the tip looking backward. The front has a lion jaw grille.",
    altText: "Black and white coloring page of a monster truck with a snake tail curving from the rear bumper and a lion jaw grille",
    prompt: "A monster truck with a long snake body shape extending from the rear bumper, curving up over the truck bed and ending in a snake head at the tip looking backward. The front grille is shaped like a lion jaw with teeth. Side view. Big tires."
  },
  {
    slug: "goat-horn-roll-cage-truck",
    title: "Goat Horn Roll Cage Truck",
    difficulty: "medium", ageRange: "4-6",
    description: "The roll cage bars on this truck curve into goat horn shapes at each corner! Four massive curved horns point outward from the cab, making this truck look ready to charge.",
    altText: "Black and white coloring page of a monster truck with roll cage bars that curve into goat horn shapes",
    prompt: "A monster truck with a roll cage where each of the four corner bars curves outward into a large goat horn shape. The horns point up and outward from each corner of the cab. Side view. Big knobby tires."
  },
  {
    slug: "chimera-shield-grille-truck",
    title: "Chimera Shield Grille Truck",
    difficulty: "medium", ageRange: "4-6",
    description: "The front of this truck is a massive shield with three animal faces on it — a lion at the top, a goat in the middle, and a snake at the bottom. Three-headed protection!",
    altText: "Black and white coloring page of a monster truck with a shield grille showing three animal faces stacked",
    prompt: "A monster truck with a large flat shield shape covering the entire front end. On the shield are three animal faces stacked vertically: a lion face at the top, a goat face in the middle, and a snake face at the bottom. Front three-quarter view. Big tires."
  },
  {
    slug: "chimera-rider-truck",
    title: "Chimera Rider Truck",
    difficulty: "easy", ageRange: "2-4",
    description: "A cute cartoon chimera creature is riding on top of this monster truck! It has a lion head, goat body, and snake tail — all sitting on the cab roof holding on tight.",
    altText: "Black and white coloring page of a simple monster truck with a small cartoon chimera creature sitting on top",
    prompt: "A simple cartoon monster truck with a small cute chimera creature sitting on top of the cab. The creature has a lion head, a goat body with small horns, and a snake for a tail. It is holding on to the roof with its paws. Side view. Thick outlines."
  },
  {
    slug: "triple-crown-chimera-truck",
    title: "Triple Crown Chimera Truck",
    difficulty: "easy", ageRange: "2-4",
    description: "The champion of all mythical trucks! This simple truck has a triple crown on the roof — three small crowns for the three chimera beasts. A lion paw, goat hoof, and snake coil decorate the door.",
    altText: "Black and white coloring page of a simple monster truck with three small crowns on the roof",
    prompt: "A simple cartoon monster truck with three small crown shapes sitting side by side on the cab roof. On the door panel there is a simple lion paw shape, a goat hoof shape, and a coiled snake shape stacked. Side view. Thick outlines for young kids."
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
  const catId = "cat-chimera-monster-truck-coloring-pages";
  if (!cats.find(c => c.id === catId)) {
    cats.push({ id: catId, slug: "chimera-monster-truck-coloring-pages", name: "Chimera Monster Truck Coloring Pages",
      description: "Free printable chimera monster truck coloring pages for kids ages 2-8. Lion jaws, goat horns, serpent tails, dragon wings — every truck mashes up multiple mythical beasts into one wild ride. Bold outlines, ready to print!",
      type: "theme" });
    fs.writeFileSync(catsPath, JSON.stringify(cats, null, 2));
    console.log("Created Chimera category");
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
  console.log(`\n✅ Chimera collection complete: ${PAGES.length} pages`);
}
main().catch(e => { console.error(e); process.exit(1); });
