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
    slug: "eagle-beak-bumper-truck",
    title: "Eagle Beak Bumper Truck",
    difficulty: "medium", ageRange: "4-6",
    description: "This monster truck's entire front end is shaped like a massive eagle beak — sharp, curved, and ready to strike! The hood slopes down into the beak point while angry eagle eyes sit above as headlights.",
    altText: "Black and white coloring page of a monster truck with a front end shaped like a sharp eagle beak",
    prompt: "A monster truck where the entire front end is shaped like a large curved eagle beak pointing forward. The hood slopes down into the sharp beak point. Two angry eagle eye shapes sit above the beak as headlights. Side view. Four big knobby tires."
  },
  {
    slug: "eagle-wing-door-truck",
    title: "Eagle Wing Door Truck",
    difficulty: "hard", ageRange: "6-8",
    description: "The doors on this truck open UPWARD like eagle wings! Both doors are propped open showing the shape of spread eagle feathers. The roof has a tall mohawk-style fin running front to back.",
    altText: "Black and white coloring page of a monster truck with gull-wing doors shaped like eagle wings spread open",
    prompt: "A monster truck with both doors open upward like spread eagle wings, each door shaped with feather edges. A tall pointed fin runs along the center of the roof from front to back like a mohawk. Front three-quarter view with both wing-doors open. Big tires."
  },
  {
    slug: "baby-eagle-truck",
    title: "Baby Eagle Truck",
    difficulty: "easy", ageRange: "2-4",
    description: "A cute baby eaglet is sitting in the truck bed of this simple monster truck, flapping its tiny wings! The truck has a small beak shape on the front bumper and round friendly headlight eyes.",
    altText: "Black and white coloring page of a simple monster truck with a cute baby eagle sitting in the truck bed",
    prompt: "A very simple cartoon monster truck with a cute baby eagle bird sitting in the open truck bed flapping tiny wings. The front bumper has a small beak shape. Round friendly headlight eyes. Side view. Only 5 to 6 large shapes. Extra thick outlines."
  },
  {
    slug: "talon-wheel-truck",
    title: "Talon Wheel Truck",
    difficulty: "hard", ageRange: "6-8",
    description: "Check out these wheels! Each hub cap is shaped like an eagle's open talon with curved claws reaching outward. The front bumper has two massive talons grabbing the ground like the truck is about to take off.",
    altText: "Black and white coloring page of a monster truck with eagle talon shaped hub caps and talon front bumper",
    prompt: "A monster truck where each of the four wheel hub caps is shaped like an eagle talon with curved claws reaching out from the center. The front bumper has two large eagle talons gripping the ground underneath. Side view. Aggressive low stance."
  },
  {
    slug: "eagle-nest-cab-truck",
    title: "Eagle Nest Cab Truck",
    difficulty: "medium", ageRange: "4-6",
    description: "The cab of this truck is built inside a giant eagle nest made of thick sticks and branches! The roof is open like a real nest and a small eagle perches on the roll bar keeping watch.",
    altText: "Black and white coloring page of a monster truck with the cab built inside a large eagle nest with sticks",
    prompt: "A monster truck where the cab is built inside a large eagle nest made of thick sticks and branches woven around it. The roof is open. A small eagle bird perches on the top of the roll bar. Side view. Big knobby tires."
  },
  {
    slug: "bald-eagle-hood-truck",
    title: "Bald Eagle Hood Truck",
    difficulty: "medium", ageRange: "4-6",
    description: "A massive bald eagle head is mounted on the hood of this beast — white head, sharp beak, fierce eyes looking straight ahead. The exhaust pipes curve upward like tail feathers.",
    altText: "Black and white coloring page of a monster truck with a large bald eagle head sculpture on the hood",
    prompt: "A monster truck with a large bald eagle head sculpture mounted on the center of the hood facing forward. Sharp curved beak, fierce eyes. Two exhaust pipes curving upward behind the cab shaped like long tail feathers. Side view. Massive tires."
  },
  {
    slug: "eagle-feather-spoiler-truck",
    title: "Eagle Feather Spoiler Truck",
    difficulty: "medium", ageRange: "4-6",
    description: "This truck has a massive rear spoiler shaped like a spread eagle tail fan — each section looks like a giant feather! The side mirrors are shaped like small eagle heads looking backward.",
    altText: "Black and white coloring page of a monster truck with a feather-shaped rear spoiler and eagle head mirrors",
    prompt: "A monster truck with a large rear spoiler shaped like a spread fan of eagle tail feathers, each feather section clearly visible. Each side mirror is shaped like a small eagle head facing backward. Side view. Four big tires."
  },
  {
    slug: "flying-eagle-jump-truck",
    title: "Flying Eagle Jump Truck",
    difficulty: "easy", ageRange: "4-6",
    description: "This monster truck is catching massive air off a ramp! Two fixed metal wings shaped like eagle wings extend from the sides of the cab. All four wheels are off the ground!",
    altText: "Black and white coloring page of a monster truck mid-air with fixed eagle-shaped metal wings on each side",
    prompt: "A monster truck mid-air jumping off a ramp with all four wheels off the ground. Two fixed metal wings shaped like eagle wings extend from each side of the cab. The truck is tilted slightly upward. Side view."
  },
  {
    slug: "eagle-vs-monster-truck",
    title: "Eagle vs Monster Truck",
    difficulty: "easy", ageRange: "4-6",
    description: "A giant cartoon eagle swoops down from above with talons out while a monster truck waits below looking up. The eagle is huge — same size as the truck! Epic showdown!",
    altText: "Black and white coloring page of a giant eagle swooping down toward a monster truck on the ground",
    prompt: "A giant cartoon eagle diving down from the top of the image with talons extended. A monster truck on the ground below looking up at the eagle. The eagle and truck are the same size. Simple composition."
  },
  {
    slug: "double-exhaust-eagle-truck",
    title: "Double Exhaust Eagle Truck",
    difficulty: "hard", ageRange: "6-8",
    description: "This truck is all about power! Four massive exhaust stacks shaped like eagle feather quills blast out from behind the cab. The front grille is shaped like an eagle's chest with layered feather plates as armor.",
    altText: "Black and white coloring page of a monster truck with four feather-quill exhaust stacks and armored eagle chest grille",
    prompt: "A monster truck with four tall exhaust stacks behind the cab, each shaped like a pointed eagle feather quill. The front grille is shaped like an eagle chest with overlapping feather-shaped armor plates. Wide aggressive stance. Side view. Huge tires."
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
img=Image.open('${path.join(IMAGES, slug+'.png')}').convert('L')
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
  const catId = "cat-eagle-monster-truck-coloring-pages";
  if (!cats.find(c => c.id === catId)) {
    cats.push({ id: catId, slug: "eagle-monster-truck-coloring-pages", name: "Eagle Monster Truck Coloring Pages",
      description: "Free printable eagle monster truck coloring pages for kids ages 2-8. Beak-shaped bumpers, talon wheels, wing doors, feather spoilers — every truck has a unique eagle-inspired structural design. Bold outlines, ready to print!",
      type: "theme" });
    fs.writeFileSync(catsPath, JSON.stringify(cats, null, 2));
    console.log("Created Eagle category");
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
  console.log(`\n✅ Eagle collection complete: ${PAGES.length} pages`);
}
main().catch(e => { console.error(e); process.exit(1); });
