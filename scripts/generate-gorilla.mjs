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
    slug: "gorilla-fist-bumper-truck",
    title: "Gorilla Fist Bumper Truck",
    difficulty: "hard", ageRange: "6-8",
    description: "This truck means business! Two massive gorilla fists form the front bumper, knuckles forward like it's about to punch through anything in its way. The hood has a gorilla brow ridge built into the metal.",
    altText: "Black and white coloring page of a monster truck with two large gorilla fist shapes as the front bumper",
    prompt: "A monster truck with two massive clenched gorilla fists as the front bumper, knuckles pointing forward. The hood has a heavy gorilla brow ridge shape built into the front edge above the fists. Muscular wide body. Side view. Four huge knobby tires."
  },
  {
    slug: "silverback-monster-truck",
    title: "Silverback Monster Truck",
    difficulty: "medium", ageRange: "4-6",
    description: "Built like a silverback gorilla! This truck has a massive wide chest-shaped front end, huge rounded fenders like gorilla shoulders, and a short stubby cab sitting low between them.",
    altText: "Black and white coloring page of a wide muscular monster truck shaped like a silverback gorilla's body",
    prompt: "A monster truck with a very wide muscular body shaped like a gorilla's chest. Huge rounded fenders that look like gorilla shoulders hunched up high on each side. The cab sits low between the wide shoulders. Short and powerful looking. Side view. Massive wide tires."
  },
  {
    slug: "baby-gorilla-truck",
    title: "Baby Gorilla Truck",
    difficulty: "easy", ageRange: "2-4",
    description: "A cute little monster truck with round gorilla ears on the roof, a flat gorilla nose on the front, and big goofy eyes! The truck bed has a banana sitting in it. Adorable and easy to color!",
    altText: "Black and white coloring page of a simple cute monster truck with gorilla ears, flat nose, and a banana in the bed",
    prompt: "A very simple cartoon monster truck with two round gorilla ears on top of the cab roof. A wide flat gorilla nose on the center of the front. Big round friendly eyes as headlights. One banana sitting in the open truck bed. Side view. Only 5 to 6 large shapes. Extra thick outlines."
  },
  {
    slug: "gorilla-arm-crane-truck",
    title: "Gorilla Arm Crane Truck",
    difficulty: "hard", ageRange: "6-8",
    description: "This beast has two long mechanical gorilla arms mounted on the sides of the cab! Each arm ends in a big grabbing gorilla hand. The arms reach forward like it's ready to grab and crush.",
    altText: "Black and white coloring page of a monster truck with two mechanical gorilla arms with grabbing hands on each side",
    prompt: "A monster truck with two long mechanical gorilla arms mounted on each side of the cab. Each arm has joints at the elbow and ends in a large open gorilla hand with thick fingers. The arms reach forward aggressively. Side view. Big tires."
  },
  {
    slug: "king-kong-cab-truck",
    title: "King Kong Cab Truck",
    difficulty: "medium", ageRange: "4-6",
    description: "The cab of this truck is shaped like a gorilla's head! The windshield sits inside the mouth area, the roof curves up like a gorilla skull, and two small gorilla nostrils form the air intake on top.",
    altText: "Black and white coloring page of a monster truck with the cab shaped like a gorilla head",
    prompt: "A monster truck where the entire cab is shaped like a gorilla head. The windshield is set inside the open mouth area. The roof curves up like a gorilla skull dome. Two small nostril shapes on top serve as air intakes. Side view. Four oversized tires."
  },
  {
    slug: "gorilla-knuckle-wheels-truck",
    title: "Gorilla Knuckle Wheels Truck",
    difficulty: "medium", ageRange: "4-6",
    description: "These wheels are insane! Each hub cap is shaped like a curled gorilla fist, and the truck sits extra low with a wide gorilla-like stance. The roll cage on top looks like gorilla finger bones.",
    altText: "Black and white coloring page of a monster truck with gorilla fist shaped hub caps and a wide low stance",
    prompt: "A monster truck where each of the four wheel hub caps is shaped like a clenched gorilla fist. The truck has an extra wide low stance like a gorilla walking on its knuckles. A roll cage on top made of thick bars that look like gorilla finger bones. Side view."
  },
  {
    slug: "chest-beat-exhaust-truck",
    title: "Chest Beat Exhaust Truck",
    difficulty: "medium", ageRange: "4-6",
    description: "When this truck revs its engine, the twin exhausts blast out the sides like a gorilla beating its chest! The hood has a gorilla chest plate shape and the bumper looks like a gorilla's jaw.",
    altText: "Black and white coloring page of a monster truck with side-mounted exhausts and gorilla chest shaped hood",
    prompt: "A monster truck with two large exhaust pipes mounted on each side of the cab pointing outward like arms beating a chest. The hood is shaped like a gorilla's broad chest plate. The front bumper is shaped like a gorilla's wide jaw. Side view. Big tires."
  },
  {
    slug: "gorilla-tire-swing-truck",
    title: "Gorilla Tire Swing Truck",
    difficulty: "easy", ageRange: "2-4",
    description: "This fun truck has a tire swing hanging off the back bumper! A cute cartoon gorilla is swinging on it while the truck drives along. The cab has a simple banana-shaped spoiler on top.",
    altText: "Black and white coloring page of a simple monster truck with a tire swing on the back and a gorilla swinging on it",
    prompt: "A simple cartoon monster truck with a tire swing hanging from a bar on the rear bumper. A small cute cartoon gorilla is sitting in the tire swing holding on. A banana-shaped spoiler on the cab roof. Side view. Thick outlines for young kids."
  },
  {
    slug: "gorilla-shield-grille-truck",
    title: "Gorilla Shield Grille Truck",
    difficulty: "hard", ageRange: "6-8",
    description: "The front of this truck is pure armor! A massive shield-shaped grille covers the entire front end with a gorilla face embossed into it — angry brow, flared nostrils, bared teeth. Built to intimidate.",
    altText: "Black and white coloring page of a monster truck with a huge shield grille featuring an embossed gorilla face",
    prompt: "A monster truck with a massive flat shield-shaped grille covering the entire front end. An angry gorilla face is embossed into the shield with heavy brow ridge, flared nostrils, and bared teeth. The shield extends wider than the truck body. Front three-quarter view. Huge tires."
  },
  {
    slug: "jungle-crusher-gorilla-truck",
    title: "Jungle Crusher Gorilla Truck",
    difficulty: "easy", ageRange: "4-6",
    description: "This tough truck has a gorilla head hood ornament, thick bumper bars that look like gorilla arms crossed in front, and a roof-mounted spotlight shaped like a gorilla eye. Ready to crush!",
    altText: "Black and white coloring page of a monster truck with gorilla head hood ornament and arm-shaped bumper bars",
    prompt: "A monster truck with a gorilla head sculpture as a hood ornament on the front center of the hood. The front bumper has two thick bars crossed over each other like gorilla arms folded. A single round spotlight on the roof shaped like a gorilla eye. Side view. Simple outlines. Big tires."
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
  const catId = "cat-gorilla-monster-truck-coloring-pages";
  if (!cats.find(c => c.id === catId)) {
    cats.push({ id: catId, slug: "gorilla-monster-truck-coloring-pages", name: "Gorilla Monster Truck Coloring Pages",
      description: "Free printable gorilla monster truck coloring pages for kids ages 2-8. Gorilla fist bumpers, silverback bodies, king kong cabs, knuckle wheels — every truck is built like a beast. Bold outlines, ready to print!",
      type: "theme" });
    fs.writeFileSync(catsPath, JSON.stringify(cats, null, 2));
    console.log("Created Gorilla category");
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
  console.log(`\n✅ Gorilla collection complete: ${PAGES.length} pages`);
}
main().catch(e => { console.error(e); process.exit(1); });
