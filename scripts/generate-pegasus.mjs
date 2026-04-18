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
    slug: "pegasus-wing-door-truck",
    title: "Pegasus Wing Door Truck",
    difficulty: "hard", ageRange: "6-8",
    description: "Both doors on this incredible truck open upward like massive feathered horse wings! Each door is shaped like a full wing with rows of individual feathers visible from tip to root. When the doors are open the truck looks ready to take flight.",
    altText: "Black and white coloring page of a monster truck with both doors open upward shaped like massive feathered horse wings",
    prompt: "A monster truck with both passenger and driver doors open upward like giant feathered horse wings. Each door is shaped like a large bird wing with rows of individual long feathers clearly outlined from the root to the tip. The wings extend high above the cab when open. Side view showing one fully open wing-door. Four huge knobby tires."
  },
  {
    slug: "horse-head-hood-truck",
    title: "Horse Head Hood Truck",
    difficulty: "medium", ageRange: "4-6",
    description: "The hood of this truck is shaped like a majestic horse's head and neck! The long mane flows back over the cab roof like a wild spoiler, and the horse's nose forms the front of the hood.",
    altText: "Black and white coloring page of a monster truck with a hood shaped like a horse head and neck with mane flowing over the cab",
    prompt: "A monster truck where the hood is sculpted into the shape of a horse head and neck. The horse nose forms the very front of the hood. A flowing mane runs from the top of the horse head back along the cab roof like a spoiler. The headlights are the horse eyes. Side view. Four oversized tires."
  },
  {
    slug: "baby-pegasus-truck",
    title: "Baby Pegasus Truck",
    difficulty: "easy", ageRange: "2-4",
    description: "This adorable little truck has small feathered wings on each front fender, a cute horse nose on the front bumper, big round friendly eyes as headlights, and a tiny horse tail wagging on the back. Super cute and easy to color!",
    altText: "Black and white coloring page of a simple cute monster truck with small wings on the fenders and a horse nose on the front",
    prompt: "A very simple cartoon monster truck with a small feathered wing on each front fender. A round cute horse nose on the center of the front bumper. Big round friendly eyes as the headlights. A small fluffy horse tail sticking out from the rear bumper. Side view. Only 5 to 6 large simple shapes. Extra thick outlines for young kids."
  },
  {
    slug: "feathered-exhaust-truck",
    title: "Feathered Exhaust Truck",
    difficulty: "medium", ageRange: "4-6",
    description: "The exhaust pipes on this truck fan out behind the cab like a spread of enormous flight feathers! Each pipe is shaped and sized like a long wing feather, arranged in a dramatic fan pattern behind the driver.",
    altText: "Black and white coloring page of a monster truck with exhaust pipes shaped like spread flight feathers behind the cab",
    prompt: "A monster truck with multiple exhaust pipes mounted behind the cab that fan out like a spread of long flight feathers. Each exhaust pipe is shaped like a large feather with the quill at the base and the feather tip curving outward. The pipes are arranged in a dramatic fan spread. Side view. Four big tires."
  },
  {
    slug: "hoof-wheel-truck",
    title: "Hoof Wheel Truck",
    difficulty: "easy", ageRange: "2-4",
    description: "Every wheel on this truck is shaped like a horse hoof with a horseshoe on the hub! The truck has small wings on each side and rolls along on four big hoof-shaped wheels. Fun and easy to color!",
    altText: "Black and white coloring page of a simple monster truck with hoof-shaped wheels each showing a horseshoe on the hub",
    prompt: "A simple monster truck where each of the four wheels is shaped like a horse hoof with a horseshoe shape clearly visible on the wheel hub. Small simple wings on each side of the truck body. Thick simple outlines. Side view. Easy shapes for young kids."
  },
  {
    slug: "cloud-runner-truck",
    title: "Cloud Runner Truck",
    difficulty: "medium", ageRange: "4-6",
    description: "This truck is launching off a ramp with all four wheels off the ground! Fixed metal wings are spread wide on each side of the body, making it look like it is flying through the air.",
    altText: "Black and white coloring page of a monster truck launching off a ramp with all wheels off the ground and fixed metal wings spread wide",
    prompt: "A monster truck launching off a ramp with all four wheels completely off the ground in mid-air. Large fixed rigid metal wings extend from each side of the truck body spread wide like an airplane wing. The truck body is angled upward slightly. A simple ramp visible below. Side view. Thick outlines."
  },
  {
    slug: "mane-spoiler-truck",
    title: "Mane Spoiler Truck",
    difficulty: "medium", ageRange: "4-6",
    description: "The rear spoiler on this truck is shaped like a flowing horse mane! Individual hair strands fan upward and outward from the spoiler base like a wild mane caught in the wind.",
    altText: "Black and white coloring page of a monster truck with a rear spoiler shaped like a flowing horse mane with individual hair strands",
    prompt: "A monster truck with a large rear spoiler shaped like a flowing horse mane. The spoiler base is mounted at the back of the cab roof and individual hair strands fan upward and outward dramatically like a mane blowing in the wind. The strands are clearly outlined individually. Side view. Four big tires."
  },
  {
    slug: "pegasus-armor-cab-truck",
    title: "Pegasus Armor Cab Truck",
    difficulty: "hard", ageRange: "6-8",
    description: "The cab of this war machine is completely covered in layered feather-shaped armor plates! Each armor plate is shaped like a large bird feather, overlapping like scales from a bird of war. Intimidating and detailed.",
    altText: "Black and white coloring page of a monster truck cab covered in overlapping feather-shaped armor plates",
    prompt: "A monster truck where the entire cab surface is covered in overlapping armor plates each shaped like a large individual bird feather. The feather plates layer over each other like scales or armor from a bird of war. Each plate has a visible quill line down the center. Side view. Four massive tires. Detailed hard design."
  },
  {
    slug: "lightning-hoof-truck",
    title: "Lightning Hoof Truck",
    difficulty: "hard", ageRange: "6-8",
    description: "The front bumper of this powerhouse is shaped like a giant horseshoe! From each end of the horseshoe, jagged lightning bolt shapes extend forward like battering rams, ready to smash through anything.",
    altText: "Black and white coloring page of a monster truck with a horseshoe-shaped bumper and lightning bolt battering rams extending from each end",
    prompt: "A monster truck with a massive horseshoe-shaped front bumper. From each end of the horseshoe, a large jagged lightning bolt shape extends forward as a battering ram. The lightning bolts are thick and angular pointing ahead aggressively. The horseshoe bumper is heavy and bold. Front three-quarter view. Huge tires."
  },
  {
    slug: "winged-crown-truck",
    title: "Winged Crown Truck",
    difficulty: "easy", ageRange: "2-4",
    description: "This royal little truck has a simple crown sitting on the roof with tiny wings on each side of the crown! A big star shape on the door makes it fit for a mythical king. Simple and perfect for little kids to color!",
    altText: "Black and white coloring page of a simple monster truck with a winged crown on the roof and a star on the door",
    prompt: "A very simple cartoon monster truck with a small crown sitting on top of the cab roof. Each side of the crown has a small simple wing shape attached to it. A large simple star shape on the truck door. Thick clean outlines. Side view. Simple shapes only. Four big round tires. Easy for very young children."
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
  const catId = "cat-pegasus-monster-truck-coloring-pages";
  if (!cats.find(c => c.id === catId)) {
    cats.push({ id: catId, slug: "pegasus-monster-truck-coloring-pages", name: "Pegasus Monster Truck Coloring Pages",
      description: "Free printable Pegasus monster truck coloring pages for kids ages 2-8. Wing doors, horse head hoods, feathered exhaust, hoof wheels, mane spoilers — every truck is built with mythical winged horse power. Bold outlines, ready to print!",
      type: "theme" });
    fs.writeFileSync(catsPath, JSON.stringify(cats, null, 2));
    console.log("Created Pegasus category");
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
  console.log(`\n✅ Pegasus collection complete: ${PAGES.length} pages`);
}
main().catch(e => { console.error(e); process.exit(1); });
