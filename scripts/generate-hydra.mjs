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
    description: "This monster truck has three fierce serpent heads mounted on the hood, each facing a different direction! Built right into the metal, the heads snarl forward, left, and right — just like a real hydra ready to strike.",
    altText: "Black and white coloring page of a monster truck with three serpent heads mounted on the hood facing different directions",
    prompt: "A monster truck with three large serpent or dragon heads mounted on the hood as structural features. One head faces forward, one turns left, one turns right. Each head has open jaws with fangs, built into the hood metal like hood ornaments. Side view. Four huge knobby tires."
  },
  {
    slug: "hydra-neck-exhaust-truck",
    title: "Hydra Neck Exhaust Truck",
    difficulty: "medium", ageRange: "4-6",
    description: "Instead of straight pipes, this truck's three exhaust pipes curve and weave like hydra necks rising behind the cab! Each pipe curves differently, like three serpent necks reaching up toward the sky.",
    altText: "Black and white coloring page of a monster truck with three curving exhaust pipes shaped like hydra necks rising behind the cab",
    prompt: "A monster truck with three large exhaust pipes rising behind the cab. Each exhaust pipe curves and weaves like a serpent neck, bending in different directions. The pipes emerge from the engine area and curve upward behind the cab roof. Side view. Oversized tires."
  },
  {
    slug: "baby-hydra-truck",
    title: "Baby Hydra Truck",
    difficulty: "easy", ageRange: "2-4",
    description: "So cute! This little monster truck has two small friendly snake heads poking up from the hood with big round happy eyes. Easy to color and absolutely adorable — perfect for the youngest artists!",
    altText: "Black and white coloring page of a simple cute monster truck with two small friendly snake heads with big eyes on the hood",
    prompt: "A very simple cartoon monster truck with two small cute snake heads poking up from the top of the hood. Each snake head has big round friendly eyes and a small smile. The snake heads are simple and cartoon-like. Side view. Only 5 to 6 large shapes. Extra thick outlines."
  },
  {
    slug: "multi-fang-bumper-truck",
    title: "Multi Fang Bumper Truck",
    difficulty: "hard", ageRange: "6-8",
    description: "The entire front bumper of this monster truck is a wall of fangs from multiple hydra heads! Rows of sharp teeth line the bumper from side to side, like every hydra head bit down on the front of the truck at once.",
    altText: "Black and white coloring page of a monster truck with a front bumper covered in rows of fangs from multiple serpent heads",
    prompt: "A monster truck with a wide front bumper completely covered in multiple rows of large sharp fangs. The fangs form a solid wall of teeth across the entire front bumper width, like multiple serpent mouths biting into the bumper structure. Front three-quarter view. Huge tires."
  },
  {
    slug: "serpent-tail-spoiler-truck",
    title: "Serpent Tail Spoiler Truck",
    difficulty: "medium", ageRange: "4-6",
    description: "The rear spoiler on this truck splits into three separate snake tail tips fanning outward! Each tail tip has the classic pointed scales of a serpent tail, spreading wide across the back of the truck.",
    altText: "Black and white coloring page of a monster truck with a rear spoiler that splits into three snake tail tips fanning outward",
    prompt: "A monster truck with a rear spoiler that splits into three separate serpent tail tips at the ends, fanning outward like a hydra's tails. Each tail tip has pointed scale segments. The spoiler starts as one piece and branches into three tail tips. Side view. Big tires."
  },
  {
    slug: "hydra-scale-armor-cab-truck",
    title: "Hydra Scale Armor Cab Truck",
    difficulty: "hard", ageRange: "6-8",
    description: "This cab is built like serpent body armor! Thick overlapping plate segments cover the entire cab, each one shaped and layered just like the scales of a giant hydra. The ultimate armored monster truck.",
    altText: "Black and white coloring page of a monster truck with cab covered in thick overlapping scale-shaped armor plates",
    prompt: "A monster truck where the entire cab surface is covered with thick overlapping armor plates shaped like large serpent scales. Each plate is large and clearly defined, layered over each other like body armor. The scale plates cover the sides, top, and front of the cab. Side view. Massive tires."
  },
  {
    slug: "twin-head-mirror-truck",
    title: "Twin Head Mirror Truck",
    difficulty: "medium", ageRange: "4-6",
    description: "This truck's side mirrors are actually snake heads! Each mirror is a small serpent head facing backward with an open mouth. They watch everything behind the truck like guardian hydra sentinels.",
    altText: "Black and white coloring page of a monster truck where each side mirror is a small snake head with open mouth facing backward",
    prompt: "A monster truck where both side mirrors are replaced by small serpent or snake heads mounted on mirror arms. Each snake head faces backward with open jaws. The snake head mirrors are attached to the cab sides on mirror-mounting arms. Side view. Four large tires."
  },
  {
    slug: "regeneration-truck",
    title: "Regeneration Truck",
    difficulty: "medium", ageRange: "4-6",
    description: "Incredible! The left side of this truck looks battle-damaged and broken apart, but the right side looks completely brand new — like the truck is growing back just like a hydra regenerates! Two sides, one amazing truck.",
    altText: "Black and white coloring page of a monster truck with one damaged side and one brand new side showing hydra regeneration",
    prompt: "A monster truck seen from a front three-quarter view. The left half of the truck looks heavily damaged with bent panels, cracks, and broken parts. The right half looks completely pristine and brand new. The two halves meet down the center. The new side appears to be actively growing back. Four big tires."
  },
  {
    slug: "hydra-crown-truck",
    title: "Hydra Crown Truck",
    difficulty: "easy", ageRange: "2-4",
    description: "This truck wears a crown of five small snake heads rising from the roof! Each little head sits in a row along the roofline like a regal hydra crown. Simple, bold shapes make this easy for little ones to color.",
    altText: "Black and white coloring page of a simple monster truck with five small snake head shapes rising from the roof like a crown",
    prompt: "A very simple cartoon monster truck with five small snake heads rising up from the roof in a row, like a crown. Each snake head is a simple rounded shape with two small eyes and a tiny mouth. The heads are evenly spaced along the roofline. Side view. Thick outlines. Big round tires."
  },
  {
    slug: "venom-drip-bumper-truck",
    title: "Venom Drip Bumper Truck",
    difficulty: "easy", ageRange: "2-4",
    description: "This friendly monster truck has two big fangs on its front bumper with drip shapes hanging from the fang tips! The drips look like big round drops ready to fall. Super simple and fun to color!",
    altText: "Black and white coloring page of a simple monster truck with two fangs on the front bumper and drip shapes hanging from the fang tips",
    prompt: "A very simple cartoon monster truck with two large fangs pointing downward from the front bumper. From the tip of each fang hangs a big rounded drip shape like a cartoon drop. The fangs and drips are large and simple. Side view. Extra thick outlines. Large round tires."
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
  const catId = "cat-hydra-monster-truck-coloring-pages";
  if (!cats.find(c => c.id === catId)) {
    cats.push({ id: catId, slug: "hydra-monster-truck-coloring-pages", name: "Hydra Monster Truck Coloring Pages",
      description: "Free printable hydra monster truck coloring pages for kids ages 2-8. Three-headed hoods, serpent neck exhausts, fang bumpers, scale armor cabs, regenerating bodies — every truck is built with mythical hydra features. Bold outlines, ready to print!",
      type: "theme" });
    fs.writeFileSync(catsPath, JSON.stringify(cats, null, 2));
    console.log("Created Hydra category");
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
  console.log(`\n✅ Hydra collection complete: ${PAGES.length} pages`);
}
main().catch(e => { console.error(e); process.exit(1); });
