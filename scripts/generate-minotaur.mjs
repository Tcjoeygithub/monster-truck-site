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
    slug: "minotaur-horn-bumper-truck",
    title: "Minotaur Horn Bumper Truck",
    difficulty: "hard", ageRange: "6-8",
    description: "Two massive curved bull horns extend from the front bumper like a charging minotaur! The hood is shaped like a warrior helmet with a forged metal crest running down the center. This truck is built for battle!",
    altText: "Black and white coloring page of a monster truck with two large curved bull horns on the bumper and a warrior helmet shaped hood",
    prompt: "A monster truck with two massive curved bull horns mounted on the front bumper, horns curving outward and upward. The hood is shaped like a warrior helmet with a raised metal crest ridge running from front to back along the top. Heavy armored body. Side view. Four huge knobby tires."
  },
  {
    slug: "labyrinth-grille-truck",
    title: "Labyrinth Grille Truck",
    difficulty: "medium", ageRange: "4-6",
    description: "The front grille of this truck is carved into a maze of twisting labyrinth corridors! Two fierce minotaur eyes peer through the passages, daring anyone to find their way through. Built for mystery and power!",
    altText: "Black and white coloring page of a monster truck with a maze labyrinth pattern grille and minotaur eyes peering through",
    prompt: "A monster truck with a large front grille shaped like a maze or labyrinth with thick walls forming twisting passages. Two large fierce eyes are visible peering through the maze openings on the grille. Bold angular body. Side view. Four oversized knobby tires."
  },
  {
    slug: "baby-minotaur-truck",
    title: "Baby Minotaur Truck",
    difficulty: "easy", ageRange: "2-4",
    description: "The cutest little warrior on wheels! This adorable truck has two small curving horns on the roof, a big round nose ring hanging from the center of the bumper, and big friendly eyes as headlights. Easy and fun to color!",
    altText: "Black and white coloring page of a simple cute monster truck with small curving horns, a nose ring on the bumper, and big friendly eyes",
    prompt: "A very simple cartoon monster truck with two small curving bull horns on top of the cab roof. A large round nose ring hanging from the center of the front bumper. Big round friendly eyes as headlights. Side view. Only 5 to 6 large shapes. Extra thick outlines."
  },
  {
    slug: "battle-axe-exhaust-truck",
    title: "Battle Axe Exhaust Truck",
    difficulty: "hard", ageRange: "6-8",
    description: "This warrior truck is armed and ready! Two exhaust pipes rise behind the cab each shaped like a double-headed battle axe standing upright, blades gleaming at the top. When the engine roars, warriors scatter!",
    altText: "Black and white coloring page of a monster truck with two double-headed battle axe shaped exhaust pipes behind the cab",
    prompt: "A monster truck with two tall exhaust pipes behind the cab, each pipe topped with a double-headed battle axe shape with broad curved blades on each side at the top. The axe blades are detailed with sharp edges. Armored body. Side view. Four huge tires."
  },
  {
    slug: "minotaur-muscle-cab-truck",
    title: "Minotaur Muscle Cab Truck",
    difficulty: "medium", ageRange: "4-6",
    description: "This truck's cab is built like a minotaur's massive body! The roof is extra wide and rounded like broad muscular shoulders, the sides are thick and barrel-chested, and the whole cab looks like it could lift a boulder!",
    altText: "Black and white coloring page of a wide muscular monster truck cab shaped like a minotaur's broad shoulders and chest",
    prompt: "A monster truck with an extra wide muscular cab shaped like a minotaur's broad shoulders and barrel chest. The roofline is wide and rounded, tapering to a narrower front. The sides of the cab bulge out like muscles. Short powerful body. Side view. Massive wide tires."
  },
  {
    slug: "chain-flail-antenna-truck",
    title: "Chain Flail Antenna Truck",
    difficulty: "medium", ageRange: "4-6",
    description: "This truck carries a medieval weapon on its roof! The radio antenna is a long chain with a spiked iron ball at the top — a warrior's chain flail swinging in the wind as the truck roars past. Watch out!",
    altText: "Black and white coloring page of a monster truck with a radio antenna shaped like a medieval chain flail with a spiked ball on top",
    prompt: "A monster truck with a radio antenna mounted on the cab roof that is shaped like a medieval chain flail. The antenna shaft connects to a chain with a large spiked iron ball hanging at the top. The chain has several wide links. Bold body. Side view. Four big knobby tires."
  },
  {
    slug: "hoof-stomp-wheels-truck",
    title: "Hoof Stomp Wheels Truck",
    difficulty: "easy", ageRange: "2-4",
    description: "These wheels aren't round — they're hooves! Each of the four big wheels is shaped like a cloven bull hoof, and the truck has two small cute horns on the roof. Every time it drives it leaves hoof prints!",
    altText: "Black and white coloring page of a simple monster truck with cloven hoof shaped wheels and small horns on the roof",
    prompt: "A simple monster truck where each of the four wheels is shaped like a cloven bull hoof with a split at the bottom. Two small curved horns on the cab roof. Simple rounded body. Side view. Thick outlines for young kids."
  },
  {
    slug: "spartan-shield-door-truck",
    title: "Spartan Shield Door Truck",
    difficulty: "hard", ageRange: "6-8",
    description: "The doors of this warrior truck are round Spartan battle shields! Each shield door has a massive spike boss in the center, raised rim edges, and rivets around the border. Built for the arena and the road!",
    altText: "Black and white coloring page of a monster truck with round Spartan warrior shield shaped doors each with a spike boss in the center",
    prompt: "A monster truck where each door is replaced with a large round Spartan warrior shield. Each shield has a large conical spike boss in the center, a raised rim around the edge, and rows of rivets around the border. The truck has bull horns on the roof. Side view. Four massive tires."
  },
  {
    slug: "minotaur-breath-exhaust-truck",
    title: "Minotaur Breath Exhaust Truck",
    difficulty: "medium", ageRange: "4-6",
    description: "This powerful truck breathes like an angry minotaur! Two large nostril-shaped exhaust ports on the front of the hood blast out steam and smoke shapes. The hood curves up like a bull's snout ready to charge!",
    altText: "Black and white coloring page of a monster truck with two nostril shaped exhaust ports on the hood blowing steam shapes",
    prompt: "A monster truck with two large oval nostril-shaped exhaust ports built into the front of the hood, each blowing swirling steam or smoke shapes coming out. The hood curves upward at the front like a bull snout. Side view. Four big tires."
  },
  {
    slug: "arena-champion-truck",
    title: "Arena Champion Truck",
    difficulty: "easy", ageRange: "4-6",
    description: "This truck is the champion of the arena! The grille has a laurel wreath victory crown shape, two horns sit proudly on the roof, and a shiny trophy is standing up in the truck bed. The crowd goes wild!",
    altText: "Black and white coloring page of a simple monster truck with a laurel wreath grille, horns on the roof, and a trophy in the bed",
    prompt: "A simple cartoon monster truck with a laurel wreath shape on the front grille. Two straight horns on the cab roof. A trophy cup standing upright in the open truck bed. Simple rounded body. Side view. Thick outlines. Big tires."
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
  const catId = "cat-minotaur-monster-truck-coloring-pages";
  if (!cats.find(c => c.id === catId)) {
    cats.push({ id: catId, slug: "minotaur-monster-truck-coloring-pages", name: "Minotaur Monster Truck Coloring Pages",
      description: "Free printable minotaur monster truck coloring pages for kids ages 2-8. Bull horn bumpers, labyrinth grilles, battle axe exhausts, hoof wheels — every truck is built like a mythical warrior. Bold outlines, ready to print!",
      type: "theme" });
    fs.writeFileSync(catsPath, JSON.stringify(cats, null, 2));
    console.log("Created Minotaur category");
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
  console.log(`\n✅ Minotaur collection complete: ${PAGES.length} pages`);
}
main().catch(e => { console.error(e); process.exit(1); });
