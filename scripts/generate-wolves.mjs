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

const SUFFIX = "Black and white line art ONLY, coloring book style for young children ages 2-8, bold thick clean outlines only, simple shapes, NO COLOR, NO shading, NO gray fill, strictly black outlines on white background, NO text in image. IMPORTANT: Do NOT draw any border, frame, box, or rectangle around the image. The artwork must have NO outline or border around the edges. Just the truck on a plain white background with nothing around it. The complete monster truck must be fully visible.";

const PAGES = [
  {
    slug: "howling-wolf-monster-truck",
    title: "Howling Wolf Monster Truck",
    difficulty: "medium", ageRange: "4-6",
    description: "This fierce monster truck has a giant wolf head on the hood, howling at the moon! The wolf's fur pattern covers the side panels while huge knobby tires tear up the dirt. Can you color the wolf's howl?",
    altText: "Black and white coloring page of a monster truck with a howling wolf head on the hood and a moon behind it",
    prompt: "A monster truck with a large wolf head sculpture on the hood, mouth open howling upward. A simple circle moon shape behind the truck. Fur texture pattern on the side panels. Side view on dirt ground. Four big knobby tires."
  },
  {
    slug: "wolf-pack-crusher-truck",
    title: "Wolf Pack Crusher Truck",
    difficulty: "hard", ageRange: "6-8",
    description: "The alpha of the pack! This powerful monster truck has wolf paw prints stamped all over the body, sharp wolf fang shapes on the front bumper, and wolf ears sticking up from the roof.",
    altText: "Black and white coloring page of a monster truck decorated with wolf paw prints, fangs on bumper, and wolf ears on roof",
    prompt: "A monster truck with wolf paw print shapes stamped all over the truck body panels. Two pointed wolf ear shapes sticking up from the roof of the cab. Sharp wolf fang shapes hanging down from the front bumper. Side view on flat ground. Big monster truck tires."
  },
  {
    slug: "baby-wolf-pup-truck",
    title: "Baby Wolf Pup Truck",
    difficulty: "easy", ageRange: "2-4",
    description: "The cutest wolf truck in the pack! This simple little monster truck has a friendly wolf puppy face with big round eyes, floppy ears, and a wagging tail on the back. Perfect for little ones!",
    altText: "Black and white coloring page of a simple cute cartoon monster truck with a friendly wolf puppy face",
    prompt: "A very simple cartoon monster truck with a cute friendly wolf puppy face on the front. Big round happy eyes, a black nose, floppy ears on top of the cab, and a wagging tail sticking out the back. Sitting still facing right. Only 5 to 6 large shapes. Extra thick outlines for toddlers."
  },
  {
    slug: "arctic-wolf-snow-truck",
    title: "Arctic Wolf Snow Truck",
    difficulty: "medium", ageRange: "4-6",
    description: "This arctic wolf monster truck is built for snow! It has thick wolf fur patterns all over, snowflake shapes on the doors, and massive snow-chain tires for driving through blizzards.",
    altText: "Black and white coloring page of a monster truck with wolf fur patterns and snowflake decorations driving through snow",
    prompt: "A monster truck covered in thick fluffy wolf fur texture patterns on the body. Simple snowflake shapes on each door panel. Snow chain patterns on all four tires. Simple snow mounds on the ground. Side view."
  },
  {
    slug: "wolf-fang-racer-truck",
    title: "Wolf Fang Racer Truck",
    difficulty: "medium", ageRange: "4-6",
    description: "Speed and fangs! This racing monster truck has a sleek wolf profile painted on each side with bared teeth. Speed lines trail behind as it races at full speed with its wolf-fang exhaust pipes roaring.",
    altText: "Black and white coloring page of a racing monster truck with wolf profile painted on the side and speed lines",
    prompt: "A sleek racing monster truck with a wolf head profile painted on the side panel showing bared teeth. Two exhaust pipes shaped like wolf fangs on the back. Simple speed lines behind the truck showing fast movement. Side view. Four racing tires."
  },
  {
    slug: "wolf-rider-monster-truck",
    title: "Wolf Rider Monster Truck",
    difficulty: "easy", ageRange: "2-4",
    description: "A friendly cartoon wolf is riding on top of this monster truck, standing up with its paws on the roof and tongue out in the wind! Simple and fun for the youngest monster truck fans.",
    altText: "Black and white coloring page of a simple monster truck with a cartoon wolf standing on top with tongue out",
    prompt: "A simple cartoon monster truck with a friendly cartoon wolf standing on top of the cab. The wolf has its tongue hanging out happily and paws resting on the roof edge. Side view. Thick outlines for young kids. Simple shapes."
  },
  {
    slug: "werewolf-transformation-truck",
    title: "Werewolf Transformation Truck",
    difficulty: "hard", ageRange: "6-8",
    description: "This monster truck is transforming into a werewolf! One side of the truck looks normal, but the other side is growing wolf claws, fur, and fangs. A full moon hangs in the sky above.",
    altText: "Black and white coloring page of a monster truck half-transforming into a werewolf with claws and fur on one side",
    prompt: "A monster truck where the left half looks like a normal truck and the right half is transforming with wolf claws growing out of the fenders, fur texture on the body, and a wolf snout forming on the hood. A full moon circle above. Side view."
  },
  {
    slug: "wolf-vs-monster-truck",
    title: "Wolf vs Monster Truck",
    difficulty: "hard", ageRange: "6-8",
    description: "The ultimate standoff! A giant cartoon wolf stands on one side, snarling and ready to pounce, while a massive monster truck revs its engine on the other side. Who's tougher?",
    altText: "Black and white coloring page of a giant wolf facing off against a monster truck in a standoff",
    prompt: "A big cartoon wolf standing on the left side snarling with fur bristled up. A monster truck on the right side facing the wolf with big tires. Both are the same size. They are staring each other down on flat ground."
  },
  {
    slug: "wolf-cave-monster-truck",
    title: "Wolf Cave Monster Truck",
    difficulty: "medium", ageRange: "4-6",
    description: "This monster truck is coming out of a wolf's cave! The cave entrance is shaped like a wolf's open mouth and the truck is bursting through with rocks flying everywhere.",
    altText: "Black and white coloring page of a monster truck bursting out of a cave shaped like a wolf mouth with rocks flying",
    prompt: "A monster truck driving out of a cave entrance that is shaped like a big wolf mouth with teeth at the top and bottom. Small rocks flying around the truck. The truck is mid-action bursting forward. Side view."
  },
  {
    slug: "alpha-wolf-champion-truck",
    title: "Alpha Wolf Champion Truck",
    difficulty: "easy", ageRange: "2-4",
    description: "The champion of the wolf pack! This simple monster truck has a big number 1 on the door, a wolf tail on the back, and a trophy sitting in the truck bed. A real winner!",
    altText: "Black and white coloring page of a simple monster truck with number 1, wolf tail, and trophy in the bed",
    prompt: "A simple cartoon monster truck with a large number 1 on the door panel. A wolf tail hanging off the rear bumper. A simple trophy cup sitting in the open truck bed. Side view facing right. Thick outlines, simple shapes for young kids."
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
        // Border check
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
"`,
          { encoding: "utf8" }
        ).trim();
        if (borderCheck === "clean") return buf;
        console.log(`  attempt ${attempt}: has built-in border, retrying...`);
      }
    }
  }
  throw new Error("Failed after 3 attempts (border or no image)");
}

async function main() {
  fs.mkdirSync(IMAGES, { recursive: true });

  for (let i = 0; i < PAGES.length; i++) {
    const p = PAGES[i];
    process.stdout.write(`[${i + 1}/10] ${p.title}... `);
    try {
      const buf = await generate(p.slug, p.prompt);
      console.log(`✓ ${(buf.length / 1024).toFixed(0)} KB`);
    } catch (e) {
      console.log(`✗ ${e.message}`);
    }
  }

  // Frame + watermark + thumb
  console.log("\nFraming + watermarking...");
  for (const p of PAGES) {
    const img = path.join(IMAGES, `${p.slug}.png`);
    if (!fs.existsSync(img)) continue;
    execSync(`python3 "${path.join(ROOT, "scripts", "frame-image.py")}" "${img}"`, { stdio: "pipe" });
    fs.copyFileSync(img, path.join(IMAGES, `${p.slug}-thumb.png`));
  }

  // Category + pages
  const catsPath = path.join(ROOT, "src/data/categories.json");
  const pagesPath = path.join(ROOT, "src/data/coloring-pages.json");
  const cats = JSON.parse(fs.readFileSync(catsPath, "utf8"));
  const pages = JSON.parse(fs.readFileSync(pagesPath, "utf8"));

  const catId = "cat-wolf-monster-truck-coloring-pages";
  if (!cats.find((c) => c.id === catId)) {
    cats.push({
      id: catId,
      slug: "wolf-monster-truck-coloring-pages",
      name: "Wolf Monster Truck Coloring Pages",
      description: "Free printable wolf monster truck coloring pages for kids ages 2-8. Howling wolves, wolf pack crushers, arctic wolves, and werewolf transformations — all on monster trucks with massive wheels. Bold outlines, ready to print and color!",
      type: "theme",
    });
    fs.writeFileSync(catsPath, JSON.stringify(cats, null, 2));
    console.log("Created Wolf category");
  }

  const now = new Date().toISOString();
  const today = now.split("T")[0];
  for (const p of PAGES) {
    if (pages.find((x) => x.slug === p.slug)) continue;
    pages.push({
      id: `page-${p.slug.slice(0, 8)}-${Date.now().toString(36).slice(-4)}`,
      slug: p.slug, title: p.title, description: p.description,
      metaDescription: `Free printable ${p.title} coloring page for kids. Bold outlines, easy to color. Download and print for free!`,
      altText: p.altText,
      imagePath: `/images/coloring-pages/${p.slug}.png`,
      thumbnailPath: `/images/coloring-pages/${p.slug}-thumb.png`,
      categoryIds: [catId], difficulty: p.difficulty, ageRange: p.ageRange,
      status: "published", featured: false, publishDate: today,
      createdAt: now, updatedAt: now,
    });
  }
  fs.writeFileSync(pagesPath, JSON.stringify(pages, null, 2));

  execSync("python3 scripts/generate-pdfs.py", { stdio: "pipe" });
  console.log(`\n✅ Wolf collection complete: ${PAGES.length} pages`);
}

main().catch((e) => { console.error(e); process.exit(1); });
