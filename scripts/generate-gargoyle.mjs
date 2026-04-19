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
    slug: "gargoyle-face-grille-truck",
    title: "Gargoyle Face Grille Truck",
    difficulty: "hard", ageRange: "6-8",
    description: "This terrifying truck has a front grille shaped exactly like a fierce gargoyle face! Two curved horns jut up from the top corners, long stone fangs hang down from the grille opening, and hollow eye sockets sit above the teeth. The most menacing front end ever built.",
    altText: "Black and white coloring page of a monster truck with a front grille shaped like a fierce gargoyle face with horns and fangs",
    prompt: "A monster truck with the entire front grille shaped like a fierce gargoyle face. Two curved stone horns jut upward from the top corners of the grille. Long stone fangs hang down from the grille opening like teeth. Deep hollow eye socket shapes above the fangs. The gargoyle face spans the full width of the front end. Side view. Four huge knobby tires."
  },
  {
    slug: "stone-wing-fender-truck",
    title: "Stone Wing Fender Truck",
    difficulty: "hard", ageRange: "6-8",
    description: "The fenders on this incredible truck are shaped like massive folded stone gargoyle wings! Each wing fender has carved feather-like stone segments fanning out over each wheel arch. When the truck moves, it looks like the wings are about to unfurl.",
    altText: "Black and white coloring page of a monster truck with fenders shaped like folded stone gargoyle wings",
    prompt: "A monster truck where both front and rear fenders are shaped like folded stone gargoyle wings. Each fender has layered stone wing feather segments carved in a fan shape covering the wheel arches. The wing fenders extend outward beyond the body width. Side view. Massive tires underneath the stone wings."
  },
  {
    slug: "baby-gargoyle-truck",
    title: "Baby Gargoyle Truck",
    difficulty: "easy", ageRange: "2-4",
    description: "This adorable little truck has two tiny rounded horns on the cab roof, cute little bat wings on the fenders, and big round stone eyes as headlights. The bumper has a small friendly gargoyle nose. Perfect for little colorers!",
    altText: "Black and white coloring page of a simple cute monster truck with small horns, bat wings on fenders, and round stone eyes",
    prompt: "A very simple cartoon monster truck with two small rounded horns on top of the cab roof. Small simple bat wing shapes attached to each front fender. Two large round friendly eyes as headlights with stone circle frames. A small stubby gargoyle nose on the center of the bumper. Side view. Only 5 to 6 large simple shapes. Extra thick outlines."
  },
  {
    slug: "gothic-spire-exhaust-truck",
    title: "Gothic Spire Exhaust Truck",
    difficulty: "medium", ageRange: "4-6",
    description: "This truck shoots exhaust through pipes shaped exactly like gothic cathedral spires! Four tall pointed spire pipes rise from the engine compartment, each with carved stone detail lines. It looks like a rolling gothic cathedral!",
    altText: "Black and white coloring page of a monster truck with exhaust pipes shaped like gothic cathedral spires pointing upward",
    prompt: "A monster truck with four tall exhaust pipes shaped like gothic cathedral spires rising from the engine compartment. Each spire pipe is tall, pointed at the top, and has carved stone segment lines along its length. The spires are arranged in a row and rise well above the cab roofline. Side view. Big tires."
  },
  {
    slug: "gargoyle-perch-cab-truck",
    title: "Gargoyle Perch Cab Truck",
    difficulty: "medium", ageRange: "4-6",
    description: "The cab of this truck is designed to look like a gargoyle crouching on a stone building ledge! The roofline has a ledge-like overhang, two stone gargoyle feet grip the front corners of the cab, and the whole cab has a hunched crouching shape.",
    altText: "Black and white coloring page of a monster truck with a cab shaped like a gargoyle crouching on a building ledge",
    prompt: "A monster truck where the cab is designed to look like a gargoyle crouching on a stone ledge. The cab roofline has a wide flat ledge-like overhang extending forward. Two stone claw feet shapes grip the front corners of the cab. The overall cab silhouette is hunched and crouching low. Stone texture block lines on the cab sides. Side view. Four oversized tires."
  },
  {
    slug: "stone-claw-bumper-truck",
    title: "Stone Claw Bumper Truck",
    difficulty: "medium", ageRange: "4-6",
    description: "The front bumper of this truck has four massive stone gargoyle claws gripping forward! Each claw has thick curved stone fingers spread wide, like a gargoyle's hand reaching out to grab. The bumper itself is built around the claw shapes.",
    altText: "Black and white coloring page of a monster truck with front bumper featuring gargoyle stone claws gripping forward",
    prompt: "A monster truck with the front bumper built around four large stone gargoyle claw hands gripping forward. Each claw has thick curved stone fingers spread wide pointing toward the viewer. The claws are integrated into the bumper structure. Side and slight front angle view. Big tires."
  },
  {
    slug: "cathedral-window-doors-truck",
    title: "Cathedral Window Doors Truck",
    difficulty: "hard", ageRange: "6-8",
    description: "Each door on this gothic truck is shaped like a tall pointed gothic arch window! The door panels have the classic pointed arch shape with carved stone tracery lines inside. The whole side of the truck looks like a rolling gothic cathedral wall.",
    altText: "Black and white coloring page of a monster truck with doors shaped like gothic pointed arch cathedral windows",
    prompt: "A monster truck where each door panel is shaped like a gothic pointed arch cathedral window. The door outlines have the tall pointed arch silhouette at the top. Inside each door panel are carved stone tracery lines in gothic arch patterns. The cab windows also follow pointed arch shapes. Side view. Four massive tires."
  },
  {
    slug: "waterspout-exhaust-truck",
    title: "Waterspout Exhaust Truck",
    difficulty: "medium", ageRange: "4-6",
    description: "This truck's exhaust pipe is shaped like the mouth of a classic gargoyle water spout! The pipe end is carved into an open gargoyle mouth with a wide jaw, hollow throat, and carved stone lips. Exhaust blasts out from the gargoyle's mouth.",
    altText: "Black and white coloring page of a monster truck with an exhaust pipe shaped like a gargoyle water spout mouth",
    prompt: "A monster truck with a large exhaust pipe that ends in the shape of a gargoyle water spout mouth. The pipe opening is carved into a wide open gargoyle jaw with stone lips curled back. The hollow throat opening is where exhaust exits. The gargoyle mouth pipe extends from the side of the engine. Side view. Big tires."
  },
  {
    slug: "demon-horn-roof-truck",
    title: "Demon Horn Roof Truck",
    difficulty: "easy", ageRange: "2-4",
    description: "Two big curved demon horns rise from the top of this truck's cab! Small simple bat wings fold down from the cab sides, and the headlights are shaped like diamond eyes. Simple and bold — easy and fun to color!",
    altText: "Black and white coloring page of a simple monster truck with two curved demon horns on the cab roof and small wings",
    prompt: "A very simple cartoon monster truck with two large curved demon horns on top of the cab roof pointing upward and slightly outward. Small simple bat wing shapes fold downward from each side of the cab. Diamond shaped headlights on the front. Thick bold outlines. Very simple design with few shapes. Side view. Four big tires."
  },
  {
    slug: "guardian-shield-truck",
    title: "Guardian Shield Truck",
    difficulty: "easy", ageRange: "4-6",
    description: "The entire front end of this truck is shaped like a classic stone guardian shield! The shield face has a simple gargoyle head in the center of the hood. Bold, simple, and built to protect — great for beginner colorers!",
    altText: "Black and white coloring page of a simple monster truck with a shield-shaped front end and gargoyle head on the hood",
    prompt: "A simple monster truck where the entire front end is shaped like a large flat stone shield with a pointed bottom edge and rounded top. A simple gargoyle head shape sits in the center of the hood as a raised ornament. The shield front spans the full width of the truck. Simple bold outlines. Side and slight front view. Four big tires."
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
  const catId = "cat-gargoyle-monster-truck-coloring-pages";
  if (!cats.find(c => c.id === catId)) {
    cats.push({ id: catId, slug: "gargoyle-monster-truck-coloring-pages", name: "Gargoyle Monster Truck Coloring Pages",
      description: "Free printable gargoyle monster truck coloring pages for kids ages 2-8. Stone wing fenders, gargoyle face grilles, gothic spire exhausts, cathedral window doors — every truck is a stone guardian on wheels. Bold outlines, ready to print!",
      type: "theme" });
    fs.writeFileSync(catsPath, JSON.stringify(cats, null, 2));
    console.log("Created Gargoyle category");
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
  console.log(`\n✅ Gargoyle collection complete: ${PAGES.length} pages`);
}
main().catch(e => { console.error(e); process.exit(1); });
