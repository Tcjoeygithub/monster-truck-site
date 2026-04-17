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
    slug: "tiger-fang-bumper-truck",
    title: "Tiger Fang Bumper Truck",
    difficulty: "medium", ageRange: "4-6",
    description: "This mean machine has two massive tiger fangs as its front bumper — curved, sharp, and ready to smash! The hood has a big tiger nose and snarling mouth built right into the metal.",
    altText: "Black and white coloring page of a monster truck with two large curved tiger fang shapes as the front bumper",
    prompt: "A monster truck with two large curved saber-tooth tiger fangs as the front bumper sticking forward. The hood is shaped like a snarling tiger face with a nose and angry eyes built into the metal bodywork. Big knobby tires. Side view."
  },
  {
    slug: "tiger-claw-hood-scoop-truck",
    title: "Tiger Claw Hood Scoop Truck",
    difficulty: "hard", ageRange: "6-8",
    description: "Three huge tiger claw shapes rip through the hood of this monster truck like a tiger scratched right through the metal! The cab has a roll cage shaped like a tiger's ribcage.",
    altText: "Black and white coloring page of a monster truck with three tiger claw scratch shapes cut through the hood",
    prompt: "A monster truck with three large tiger claw scratch shapes cut through the hood metal, showing the engine underneath. The cab has a roll cage that looks like curved tiger ribs. Aggressive low stance. Side view. Four oversized tires."
  },
  {
    slug: "baby-tiger-cub-truck",
    title: "Baby Tiger Cub Truck",
    difficulty: "easy", ageRange: "2-4",
    description: "A cute little monster truck shaped like a baby tiger cub! It has round tiger ears on the roof, a little nose on the front, and a long curvy tail coming off the back bumper.",
    altText: "Black and white coloring page of a simple cute monster truck shaped like a baby tiger with round ears and a tail",
    prompt: "A very simple cartoon monster truck shaped like a baby tiger cub. Two round tiger ears on top of the cab roof. A cute small nose on the front of the hood. A long curving tiger tail attached to the rear bumper. Big round friendly eyes as headlights. Only 5 to 6 large shapes. Extra thick outlines."
  },
  {
    slug: "tiger-tail-exhaust-truck",
    title: "Tiger Tail Exhaust Truck",
    difficulty: "medium", ageRange: "4-6",
    description: "The exhaust pipes on this truck are shaped like two curving tiger tails! They stick up from the back of the cab and curl forward. The wheels have claw-shaped lugs instead of normal treads.",
    altText: "Black and white coloring page of a monster truck with tiger tail shaped exhaust pipes and claw-shaped wheel lugs",
    prompt: "A monster truck with two exhaust pipes shaped like curving tiger tails sticking up from behind the cab and curling forward. Each wheel has claw-shaped lugs instead of normal tire treads. The front grille has tiger whisker shapes. Side view."
  },
  {
    slug: "saber-tooth-monster-truck",
    title: "Saber-Tooth Monster Truck",
    difficulty: "hard", ageRange: "6-8",
    description: "Inspired by the prehistoric saber-tooth tiger! This truck has two enormous curved tusks coming down from the top of the front bumper, a low aggressive stance, and a massive jaw-shaped front end.",
    altText: "Black and white coloring page of a monster truck designed like a saber-tooth tiger with huge curved tusks",
    prompt: "A monster truck designed to look like a prehistoric saber-tooth tiger. Two enormous curved tusks hanging down from the top of the front grille. The whole front end is shaped like a big cat jaw. Low aggressive stance with the front end lower than the rear. Side view. Massive tires."
  },
  {
    slug: "tiger-eye-headlight-truck",
    title: "Tiger Eye Headlight Truck",
    difficulty: "easy", ageRange: "2-4",
    description: "This monster truck has big glowing tiger eyes as its headlights! The front grille looks like a tiger's grin, and the hood has a simple tiger nose bump on top. Easy to color and super cool!",
    altText: "Black and white coloring page of a simple monster truck with big tiger eye shaped headlights and a grinning grille",
    prompt: "A simple cartoon monster truck with two large oval tiger-eye shaped headlights on the front. The front grille is shaped like a wide tiger grin. A simple bump on the hood shaped like a tiger nose. Front-facing view, slightly angled. Thick outlines, simple shapes."
  },
  {
    slug: "tiger-cage-cab-truck",
    title: "Tiger Cage Cab Truck",
    difficulty: "hard", ageRange: "6-8",
    description: "Wild ride! The cab of this monster truck is built like a tiger cage with thick bars all around. A cartoon tiger is inside the cage, holding the steering wheel and driving! The truck body is muscular and wide.",
    altText: "Black and white coloring page of a monster truck with a cage-style cab and a cartoon tiger driving inside",
    prompt: "A monster truck where the cab is built like a cage with thick vertical bars all around it. A cartoon tiger is sitting inside the cage holding the steering wheel with its paws. The truck body is muscular and wide. Side view. Big tires."
  },
  {
    slug: "tiger-king-chrome-truck",
    title: "Tiger King Chrome Truck",
    difficulty: "medium", ageRange: "4-6",
    description: "The king of all tiger trucks! This one has a crown-shaped roof rack, tiger paw-shaped side mirrors, and a thick tiger tail spoiler across the back. Every detail is built for a champion.",
    altText: "Black and white coloring page of a monster truck with a crown roof rack, paw mirrors, and tiger tail spoiler",
    prompt: "A monster truck with a crown shape mounted on top of the cab roof. The side mirrors are shaped like tiger paws. A wide spoiler on the back shaped like a curved tiger tail. The front bumper has a medal or shield shape. Side view. Big knobby tires."
  },
  {
    slug: "pouncing-tiger-truck",
    title: "Pouncing Tiger Truck",
    difficulty: "medium", ageRange: "4-6",
    description: "This truck is built to pounce! The front wheels are higher than the rear, the hood slopes down like a tiger about to leap, and the rear fenders flare out like a tiger's haunches ready to spring.",
    altText: "Black and white coloring page of a monster truck in a pouncing stance with front raised and rear low",
    prompt: "A monster truck in a pouncing stance with the front end raised high and the rear end low like a tiger about to leap. The hood slopes downward aggressively. The rear fenders flare out wide like muscular haunches. The front wheels are bigger than the rear wheels. Side view."
  },
  {
    slug: "tiger-vs-monster-truck",
    title: "Tiger vs Monster Truck",
    difficulty: "easy", ageRange: "4-6",
    description: "Face-off! A big cartoon tiger stands on one side looking tough with its claws out, while a monster truck revs on the other side. They're the same size — who would you bet on?",
    altText: "Black and white coloring page of a cartoon tiger and a monster truck facing each other in a standoff",
    prompt: "A big cartoon tiger on the left side with claws out looking tough. A monster truck on the right side with big tires facing the tiger. Both are the same size. They face each other on flat ground. Simple outlines."
  }
];

async function generate(slug, prompt) {
  const full = prompt + " " + SUFFIX;
  for (let attempt = 1; attempt <= 3; attempt++) {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key=${KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: full }] }],
          generationConfig: { responseModalities: ["IMAGE", "TEXT"] },
        }),
      }
    );
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    for (const p of data.candidates?.[0]?.content?.parts ?? []) {
      if (p.inlineData?.data) {
        const buf = Buffer.from(p.inlineData.data, "base64");
        const imgPath = path.join(IMAGES, `${slug}.png`);
        fs.writeFileSync(imgPath, buf);
        const borderCheck = execSync(
          `python3 -c "
from PIL import Image
img = Image.open('${imgPath}').convert('L')
w, h = img.size
m = int(min(w,h) * 0.03)
edges = []
for x in range(w):
    for y in range(m): edges.append(img.getpixel((x,y)))
    for y in range(h-m, h): edges.append(img.getpixel((x,y)))
for y in range(h):
    for x in range(m): edges.append(img.getpixel((x,y)))
    for x in range(w-m, w): edges.append(img.getpixel((x,y)))
dark = sum(1 for p in edges if p < 128)
print('border' if dark / len(edges) > 0.03 else 'clean')
"`, { encoding: "utf8" }
        ).trim();
        if (borderCheck === "clean") return buf;
        console.log(`  attempt ${attempt}: built-in border, retrying...`);
      }
    }
  }
  throw new Error("Failed 3 attempts");
}

async function main() {
  fs.mkdirSync(IMAGES, { recursive: true });
  for (let i = 0; i < PAGES.length; i++) {
    const p = PAGES[i];
    process.stdout.write(`[${i + 1}/10] ${p.title}... `);
    try {
      const buf = await generate(p.slug, p.prompt);
      console.log(`✓ ${(buf.length / 1024).toFixed(0)} KB`);
    } catch (e) { console.log(`✗ ${e.message}`); }
  }
  console.log("\nFraming + watermarking...");
  for (const p of PAGES) {
    const img = path.join(IMAGES, `${p.slug}.png`);
    if (!fs.existsSync(img)) continue;
    execSync(`python3 "${path.join(ROOT, "scripts", "frame-image.py")}" "${img}"`, { stdio: "pipe" });
    fs.copyFileSync(img, path.join(IMAGES, `${p.slug}-thumb.png`));
  }
  const catsPath = path.join(ROOT, "src/data/categories.json");
  const pagesPath = path.join(ROOT, "src/data/coloring-pages.json");
  const cats = JSON.parse(fs.readFileSync(catsPath, "utf8"));
  const pages = JSON.parse(fs.readFileSync(pagesPath, "utf8"));
  const catId = "cat-tiger-monster-truck-coloring-pages";
  if (!cats.find((c) => c.id === catId)) {
    cats.push({ id: catId, slug: "tiger-monster-truck-coloring-pages", name: "Tiger Monster Truck Coloring Pages", description: "Free printable tiger monster truck coloring pages for kids ages 2-8. Saber-tooth fangs, tiger claw hood scoops, cage cabs, and pouncing stances — every truck has a unique tiger-inspired design. Bold outlines, ready to print!", type: "theme" });
    fs.writeFileSync(catsPath, JSON.stringify(cats, null, 2));
    console.log("Created Tiger category");
  }
  const now = new Date().toISOString();
  const today = now.split("T")[0];
  for (const p of PAGES) {
    if (pages.find((x) => x.slug === p.slug)) continue;
    pages.push({ id: `page-${p.slug.slice(0, 8)}-${Date.now().toString(36).slice(-4)}`, slug: p.slug, title: p.title, description: p.description, metaDescription: `Free printable ${p.title} coloring page for kids. Bold outlines, easy to color. Download and print for free!`, altText: p.altText, imagePath: `/images/coloring-pages/${p.slug}.png`, thumbnailPath: `/images/coloring-pages/${p.slug}-thumb.png`, categoryIds: [catId], difficulty: p.difficulty, ageRange: p.ageRange, status: "published", featured: false, publishDate: today, createdAt: now, updatedAt: now });
  }
  fs.writeFileSync(pagesPath, JSON.stringify(pages, null, 2));
  execSync("python3 scripts/generate-pdfs.py", { stdio: "pipe" });
  console.log(`\n✅ Tiger collection complete: ${PAGES.length} pages`);
}
main().catch((e) => { console.error(e); process.exit(1); });
