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
    slug: "battle-horn-bumper-truck",
    title: "Battle Horn Bumper Truck",
    difficulty: "hard", ageRange: "6-8",
    description: "This truck is built to charge! A massive spiral unicorn horn is mounted dead center on the front bumper like a battering ram. The horn is thick, twisted, and armored — ready to smash through anything on the track.",
    altText: "Black and white coloring page of a monster truck with a massive spiral unicorn horn mounted on the front bumper as a battering ram",
    prompt: "A monster truck with a massive thick spiral unicorn horn mounted on the center of the front bumper, pointing straight forward like a battering ram. The horn is heavily armored with spiral ridges. The bumper is massive and reinforced around the horn mount. Wide aggressive body. Side view. Four huge knobby tires."
  },
  {
    slug: "armored-unicorn-cab-truck",
    title: "Armored Unicorn Cab Truck",
    difficulty: "hard", ageRange: "6-8",
    description: "The cab is a fortress! Shaped like an armored unicorn head with a battle visor over the windshield and a long pointed horn jutting from the roof. This war unicorn truck is built for battle, not beauty.",
    altText: "Black and white coloring page of a monster truck with the cab shaped like an armored unicorn head with a visor and horn on top",
    prompt: "A monster truck where the entire cab is shaped like an armored unicorn head. A heavy battle visor covers the windshield area. A single long pointed horn rises from the top center of the cab roof. The cab sides have armored plate details. Side view. Four oversized off-road tires."
  },
  {
    slug: "baby-unicorn-truck",
    title: "Baby Unicorn Truck",
    difficulty: "easy", ageRange: "2-4",
    description: "The cutest little monster truck on four wheels! A small spiral horn on the hood, star-shaped hubcaps, and tiny wings on the fenders. Simple and adorable — perfect for little colorers.",
    altText: "Black and white coloring page of a simple cute monster truck with a small spiral horn on the hood, star hubcaps, and wings on the fenders",
    prompt: "A very simple cartoon monster truck with one small spiral unicorn horn on the center of the hood. Each wheel hub is shaped like a five-pointed star. Small stubby wings on each front fender. Big round friendly headlights. Side view. Only 5 to 6 large simple shapes. Extra thick outlines."
  },
  {
    slug: "spiral-horn-exhaust-truck",
    title: "Spiral Horn Exhaust Truck",
    difficulty: "medium", ageRange: "4-6",
    description: "Instead of a normal smokestack, this truck's exhaust pipe is a tall twisted spiral horn shape rising behind the cab! The spiral gets narrower toward the pointed tip — roaring fumes out the top like a battle unicorn.",
    altText: "Black and white coloring page of a monster truck with a tall twisted spiral unicorn horn shaped exhaust pipe behind the cab",
    prompt: "A monster truck with a single tall exhaust pipe behind the cab that is shaped exactly like a unicorn horn with spiral ridges twisting from base to pointed tip. The horn exhaust is very tall and tapers to a sharp point at the top. Side view. Aggressive wide body. Four large off-road tires."
  },
  {
    slug: "mane-spoiler-truck",
    title: "Mane Spoiler Truck",
    difficulty: "medium", ageRange: "4-6",
    description: "Check out that rear spoiler! It's shaped like a wild flowing mane with individual thick hair strands fanning out behind the truck like a war horse charging into battle. One horn on the hood seals the deal.",
    altText: "Black and white coloring page of a monster truck with a rear spoiler shaped like a flowing mane with individual hair strands fanning out",
    prompt: "A monster truck with a large rear spoiler shaped like a flowing mane. The spoiler has many individual thick wavy hair strands fanning out from the base in a dynamic sweeping pattern. A single unicorn horn on the front of the hood. Side view. Heavy duty body. Four massive tires."
  },
  {
    slug: "unicorn-hoof-wheels-truck",
    title: "Unicorn Hoof Wheels Truck",
    difficulty: "easy", ageRange: "2-4",
    description: "Every wheel hub on this truck is shaped like a unicorn hoof! A simple truck with a small horn on the hood and four hoof-hubcaps on the massive tires. Easy to color and totally awesome.",
    altText: "Black and white coloring page of a simple monster truck with unicorn hoof shaped wheel hubs and a horn on the hood",
    prompt: "A simple cartoon monster truck where each of the four wheel hub caps is shaped like a horseshoe hoof. The truck has a single short unicorn horn on the front center of the hood. Simple boxy body shape. Side view. Thick bold outlines. Big round tires with the hoof hub caps clearly visible."
  },
  {
    slug: "pegasus-wing-door-truck",
    title: "Pegasus Wing Door Truck",
    difficulty: "hard", ageRange: "6-8",
    description: "The doors on this beast swing open upward like giant feathered wings! When closed they fold tight against the cab and look like massive armored wings on a war pegasus. A sharp horn sits on the roof.",
    altText: "Black and white coloring page of a monster truck with doors shaped like large feathered wings that open upward, and a horn on the roof",
    prompt: "A monster truck with doors designed as large feathered wings hinged at the top that open upward. The wing doors are closed and visible against the cab sides, shaped like folded armored feathered wings with detailed feather outlines. A single sharp horn points up from the center of the roof. Side view. Four huge tires."
  },
  {
    slug: "star-burst-grille-truck",
    title: "Star Burst Grille Truck",
    difficulty: "medium", ageRange: "4-6",
    description: "The grille on this truck is a massive starburst explosion radiating from the center! At the very center where all the rays meet sits a sharp horn point like the eye of a star. Pure monster energy.",
    altText: "Black and white coloring page of a monster truck with a starburst pattern grille radiating from a center horn point",
    prompt: "A monster truck with a front grille shaped like a large starburst with bold rays radiating outward from a center horn point. The starburst grille covers the entire front of the truck. The center has a short sharp horn-shaped protrusion as the focal point. Front three-quarter view. Wide aggressive body. Four large tires."
  },
  {
    slug: "crystal-horn-crown-truck",
    title: "Crystal Horn Crown Truck",
    difficulty: "medium", ageRange: "4-6",
    description: "A row of crystal horn spikes runs along the entire roof ridge like a mohawk! Each horn is a different size, pointed and sharp, forming a crown of battle horns down the center of the truck's roofline.",
    altText: "Black and white coloring page of a monster truck with a row of crystal horn spikes along the roof ridge like a mohawk crown",
    prompt: "A monster truck with a row of pointed crystal horn spikes running along the entire length of the roof ridge from front to back, like a mohawk or crown of horns. Each spike is a different height with the tallest in the middle. Sharp triangular pointed tips. Side view. Aggressive truck body. Four big off-road tires."
  },
  {
    slug: "thunder-unicorn-truck",
    title: "Thunder Unicorn Truck",
    difficulty: "easy", ageRange: "4-6",
    description: "Simple and powerful! One big horn dominates the front hood, and lightning bolt shapes serve as the side mirrors. A bold star emblem on the door and a no-nonsense monster truck body. Thunder unicorn style!",
    altText: "Black and white coloring page of a simple monster truck with one big horn, lightning bolt side mirrors, and a star on the door",
    prompt: "A simple cartoon monster truck with one large unicorn horn on the center of the hood. Both side mirrors are shaped like lightning bolts. A large five-pointed star shape on the door panel. Simple clean truck body. Side view. Thick outlines easy for young kids. Four big round tires."
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
  const catId = "cat-unicorn-monster-truck-coloring-pages";
  if (!cats.find(c => c.id === catId)) {
    cats.push({ id: catId, slug: "unicorn-monster-truck-coloring-pages", name: "Unicorn Monster Truck Coloring Pages",
      description: "Free printable unicorn monster truck coloring pages for kids ages 2-8. Armored horn bumpers, battle cab trucks, crystal horn crowns, pegasus wing doors — every truck is a war unicorn built to dominate. Bold outlines, ready to print!",
      type: "theme" });
    fs.writeFileSync(catsPath, JSON.stringify(cats, null, 2));
    console.log("Created Unicorn category");
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
  console.log(`\n✅ Unicorn collection complete: ${PAGES.length} pages`);
}
main().catch(e => { console.error(e); process.exit(1); });
