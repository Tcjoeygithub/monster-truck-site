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
    slug: "griffin-beak-hood-truck",
    title: "Griffin Beak Hood Truck",
    difficulty: "medium", ageRange: "4-6",
    description: "This truck's hood is shaped like a giant eagle beak pointing forward — sharp, curved, and ready to charge! On the sides, the fender flares puff out in big rounded shapes like a lion's mane framing the wheels.",
    altText: "Black and white coloring page of a monster truck with an eagle beak shaped hood and lion mane fender flares",
    prompt: "A monster truck where the front of the hood is sculpted into a large downward-curving eagle beak shape pointing forward. On each side, the front fenders flare out in thick rounded shapes resembling a lion's mane. Side view. Four huge knobby tires."
  },
  {
    slug: "lion-paw-eagle-talon-bumper-truck",
    title: "Lion Paw & Eagle Talon Bumper Truck",
    difficulty: "hard", ageRange: "6-8",
    description: "The front bumper of this wild truck is split right down the middle! The left half is a massive lion paw with thick rounded toes, and the right half is a sharp eagle talon with curving talons. Two totally different beasts — one bumper!",
    altText: "Black and white coloring page of a monster truck with a split bumper showing a lion paw on one side and an eagle talon on the other",
    prompt: "A monster truck with a front bumper divided exactly in half. The left half of the bumper is shaped like a large lion paw with thick rounded toes spread wide. The right half is shaped like a large eagle talon with three sharp curved claws gripping forward. Front three-quarter view. Huge tires."
  },
  {
    slug: "baby-griffin-truck",
    title: "Baby Griffin Truck",
    difficulty: "easy", ageRange: "2-4",
    description: "Meet the tiniest truck in the mythical motor pool! This cute little monster truck has a tiny eagle beak on the front bumper, small stubby wings sticking out from the sides, a lion tail hanging off the back, and big round friendly headlight eyes.",
    altText: "Black and white coloring page of a simple cute monster truck with a small eagle beak, little wings on sides, and a lion tail on back",
    prompt: "A very simple cartoon monster truck with a small eagle beak on the front bumper. Two small stubby wings sticking out from each side of the cab. A short curly lion tail with a tuft hanging from the rear bumper. Big round friendly eyes as headlights. Side view. Only 5 to 6 large shapes. Extra thick outlines."
  },
  {
    slug: "griffin-wing-fender-truck",
    title: "Griffin Wing Fender Truck",
    difficulty: "hard", ageRange: "6-8",
    description: "This truck looks like it's about to take flight! The rear fenders sweep up and out in the shape of two massive spread eagle wings. The front fenders are bulging and rounded like the haunches of a powerful lion crouched to pounce.",
    altText: "Black and white coloring page of a monster truck with rear fenders shaped like spread eagle wings and front fenders like lion haunches",
    prompt: "A monster truck where the rear fenders sweep dramatically upward and outward, sculpted into two large spread eagle wing shapes with feather details. The front fenders bulge outward and curve downward like crouching lion haunch muscles. Side view. Four oversized tires."
  },
  {
    slug: "crown-crest-cab-truck",
    title: "Crown Crest Cab Truck",
    difficulty: "medium", ageRange: "4-6",
    description: "Royally built! This truck has a dramatic griffin head crest rising right from the center of the cab roof — like a knight's helmet plume, but shaped like a griffin's proud feathered crown. It makes the cab look like a king's chariot.",
    altText: "Black and white coloring page of a monster truck with a tall griffin head crest plume rising from the center of the cab roof",
    prompt: "A monster truck with a tall decorative crest mounted on the center of the cab roof, shaped like a griffin's head plume with feather layers fanning upward and back. The crest rises prominently above the cab roofline. Side view. Four big tires."
  },
  {
    slug: "lion-tail-exhaust-truck",
    title: "Lion Tail Exhaust Truck",
    difficulty: "medium", ageRange: "4-6",
    description: "Instead of a boring pipe, this truck's exhaust is built like a long lion tail! It curls upward from behind the cab, arcing high into the air, and ends in a big fluffy tuft at the top. When the engine roars, smoke puffs from the tuft!",
    altText: "Black and white coloring page of a monster truck with an exhaust pipe shaped like a long curved lion tail with a tuft at the end",
    prompt: "A monster truck with a single large exhaust pipe shaped like a long lion tail. The pipe rises from behind the cab and curves upward in a graceful arc, ending in a large fluffy lion tail tuft at the top. Side view. Four huge knobby tires."
  },
  {
    slug: "talon-wheel-spokes-truck",
    title: "Talon Wheel Spokes Truck",
    difficulty: "medium", ageRange: "4-6",
    description: "Look closely at those wheels! Each spoke on the front wheels is shaped like a sharp eagle talon curving inward from the rim. On the rear wheels, every spoke looks like a curved lion claw. Two different wild designs, same awesome truck!",
    altText: "Black and white coloring page of a monster truck with front wheels having eagle talon spokes and rear wheels having lion claw spokes",
    prompt: "A monster truck where the front wheels have spokes shaped like sharp curved eagle talons radiating from the hub. The rear wheels have spokes shaped like lion claws curving from the hub. Side view. Truck body is wide and muscular."
  },
  {
    slug: "griffin-shield-grille-truck",
    title: "Griffin Shield Grille Truck",
    difficulty: "hard", ageRange: "6-8",
    description: "The entire front end of this truck is a massive heraldic shield! Built into the center of the shield is a bold griffin silhouette — half eagle head above, half lion body below — embossed into the metal like a coat of arms. Fit for a king!",
    altText: "Black and white coloring page of a monster truck with a heraldic shield front grille featuring an embossed griffin silhouette",
    prompt: "A monster truck with a massive flat heraldic shield shape covering the entire front end as the grille. In the center of the shield a griffin silhouette is embossed with eagle head and wings on top and lion body on the bottom. The shield extends wider than the truck body. Front three-quarter view. Huge tires."
  },
  {
    slug: "feathered-mane-spoiler-truck",
    title: "Feathered Mane Spoiler Truck",
    difficulty: "easy", ageRange: "4-6",
    description: "This truck's rear spoiler tells two stories in one! The left half has smooth layered feather edges like an eagle wing, while the right half has wild fluffy mane edges like a lion's neck. Half bird, half lion — all monster truck!",
    altText: "Black and white coloring page of a monster truck with a rear spoiler where one half has feather edges and the other half has mane fur edges",
    prompt: "A monster truck with a rear spoiler divided down the middle. The left half of the spoiler has clean layered feather shapes along its edge. The right half has shaggy mane and fur shapes along its edge. Side view. Simple truck shape. Thick outlines. Four big tires."
  },
  {
    slug: "dual-nature-griffin-truck",
    title: "Dual Nature Griffin Truck",
    difficulty: "easy", ageRange: "2-4",
    description: "This simple and fun truck shows off both halves of a griffin! The front bumper curves into an eagle beak shape, a pair of small wings sit on top of the cab, and a lion tail with a fluffy end sticks out the back. Easy to color and totally mythical!",
    altText: "Black and white coloring page of a simple monster truck with a beak bumper on the front, small wings on the cab, and a lion tail on the back",
    prompt: "A simple cartoon monster truck with an eagle beak shape built into the front bumper. Two small wings on top of the cab. A lion tail with a tuft at the end extending from the back bumper. Side view. Chunky simple shapes. Very thick outlines for young kids. Four big round tires."
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
  const catId = "cat-griffin-monster-truck-coloring-pages";
  if (!cats.find(c => c.id === catId)) {
    cats.push({ id: catId, slug: "griffin-monster-truck-coloring-pages", name: "Griffin Monster Truck Coloring Pages",
      description: "Free printable griffin monster truck coloring pages for kids ages 2-8. Eagle beak hoods, lion paw bumpers, wing fenders, talon wheel spokes — every truck is built from the mythical lion-eagle hybrid. Bold outlines, ready to print!",
      type: "theme" });
    fs.writeFileSync(catsPath, JSON.stringify(cats, null, 2));
    console.log("Created Griffin category");
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
  console.log(`\n✅ Griffin collection complete: ${PAGES.length} pages`);
}
main().catch(e => { console.error(e); process.exit(1); });
