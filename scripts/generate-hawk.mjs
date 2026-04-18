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
    slug: "hawk-beak-ram-truck",
    title: "Hawk Beak Ram Truck",
    difficulty: "medium", ageRange: "4-6",
    description: "The front bumper of this monster truck tapers into a massive sharp curved hawk beak shape — built to ram through anything. The beak curves downward at the tip just like a real hawk's beak. This truck means serious business!",
    altText: "Black and white coloring page of a monster truck with a sharp curved hawk beak shape as the front bumper",
    prompt: "A monster truck where the front bumper tapers and curves into a large sharp hawk beak shape pointing forward and slightly downward. The beak is structural — built into the metal of the bumper like a battering ram. Side view. Four huge knobby tires. Wide truck body."
  },
  {
    slug: "dive-bomb-stance-truck",
    title: "Dive Bomb Stance Truck",
    difficulty: "hard", ageRange: "6-8",
    description: "This truck is angled nose-down just like a hawk diving at full speed! The front wheels sit lower than the rear wheels, and the cab has a swept-back profile that cuts through the air. Pure aerodynamic power built into the frame.",
    altText: "Black and white coloring page of a monster truck angled nose-down with front wheels lower than rear in a hawk dive pose",
    prompt: "A monster truck tilted nose-down at an aggressive downward angle like a hawk in a dive bomb. The front wheels and axle are lower than the rear wheels, giving the whole truck a nose-down stance. The cab profile is swept back aerodynamically. Side view. Huge tires. The truck frame itself is angled — not level."
  },
  {
    slug: "baby-hawk-truck",
    title: "Baby Hawk Truck",
    difficulty: "easy", ageRange: "2-4",
    description: "This adorable little monster truck has a small curved beak on the very front, tiny wing shapes built onto the fenders, and big round friendly eyes as headlights. Cute and easy to color for the littlest fans!",
    altText: "Black and white coloring page of a simple cute monster truck with a small curved beak on the front and tiny wing shapes on the fenders",
    prompt: "A very simple cute cartoon monster truck with a small rounded hawk beak shape on the center of the front bumper. Small simple wing shapes built into the top of each front fender. Big round friendly eyes as headlights. Side view. Only 5 to 6 large simple shapes. Extra thick outlines for young kids."
  },
  {
    slug: "talon-grab-bumper-truck",
    title: "Talon Grab Bumper Truck",
    difficulty: "hard", ageRange: "6-8",
    description: "Two enormous hawk talons reach down from the front bumper and grip the ground! Each talon has thick curved claws digging into the earth. This truck looks like it could pick up a car and carry it away.",
    altText: "Black and white coloring page of a monster truck with two massive hawk talons extending from the front bumper gripping the ground",
    prompt: "A monster truck with two massive hawk talons extending downward from the front bumper, each talon gripping the ground with thick curved claws. The talons are structural parts of the front end — like giant mechanical claws built into the bumper frame. Side view. Four enormous tires. Aggressive wide body."
  },
  {
    slug: "hawk-wing-spoiler-truck",
    title: "Hawk Wing Spoiler Truck",
    difficulty: "medium", ageRange: "4-6",
    description: "This truck's rear spoiler is shaped like a hawk's wings spread wide! The tips have feather-edge details built right into the metal. The wide wing spoiler stretches across the entire back of the truck.",
    altText: "Black and white coloring page of a monster truck with a wide rear spoiler shaped like spread hawk wings with feather-edge tips",
    prompt: "A monster truck with a very wide rear spoiler shaped like two hawk wings spread horizontally. The outer edges of the spoiler have feather-blade tip details built into the metal. The wing spoiler stretches wider than the truck body on both sides. Side view. Four huge tires."
  },
  {
    slug: "feather-blade-exhaust-truck",
    title: "Feather Blade Exhaust Truck",
    difficulty: "medium", ageRange: "4-6",
    description: "The exhaust pipes on this truck are shaped like sharp pointed feather quills! Each pipe is long and tapers to a point at the tip like a hawk feather, angled backward along the sides of the cab. Totally unique!",
    altText: "Black and white coloring page of a monster truck with exhaust pipes shaped like sharp pointed feather quills angled backward",
    prompt: "A monster truck with multiple exhaust pipes on each side shaped like long sharp pointed feather quills. Each pipe tapers to a sharp point at the tip like a hawk flight feather. The feather-shaped pipes are angled backward along the sides of the cab. Side view. Big tires."
  },
  {
    slug: "hawk-crest-hood-truck",
    title: "Hawk Crest Hood Truck",
    difficulty: "medium", ageRange: "4-6",
    description: "A tall hawk head crest runs along the center of this truck's hood like a mohawk! The raised crest is built right into the hood metal, running from the windshield all the way to the front edge. Sharp and fierce!",
    altText: "Black and white coloring page of a monster truck with a tall hawk head crest shape running along the center of the hood",
    prompt: "A monster truck with a tall fin-like hawk head crest running along the centerline of the hood from front to back, like a mohawk built into the hood sheet metal. The crest is a structural ridge that rises high above the hood surface and tapers to a point at the front. Side view. Huge tires."
  },
  {
    slug: "nest-truck-bed",
    title: "Nest Truck Bed",
    difficulty: "easy", ageRange: "2-4",
    description: "The bed of this monster truck is shaped like a hawk's nest made of woven sticks! Three big round eggs sit inside the cozy nest bed. The truck has simple lines and is perfect for little kids to color.",
    altText: "Black and white coloring page of a simple monster truck with a truck bed shaped like a hawk nest made of sticks with eggs inside",
    prompt: "A simple cartoon monster truck where the truck bed is shaped like a large bird's nest made of woven sticks and twigs. Three large round eggs sit inside the nest bed. Very simple shapes. Side view. Thick outlines. Extra simple design for young children."
  },
  {
    slug: "raptor-vision-headlights-truck",
    title: "Raptor Vision Headlights Truck",
    difficulty: "hard", ageRange: "6-8",
    description: "This truck's headlights are extremely narrow horizontal slits — just like a hawk's intensely focused hunting gaze! The slitted headlights run wide across the front of the truck, giving it a fierce predator stare that sees everything.",
    altText: "Black and white coloring page of a monster truck with extremely narrow horizontal slit headlights like a hawk's focused hunting gaze",
    prompt: "A monster truck with headlights that are extremely narrow horizontal slits — very thin and very wide across the front of the truck, like the focused eyes of a hunting hawk. The slit headlights span most of the truck's front width. The front end looks intense and predatory. Front three-quarter view. Massive tires."
  },
  {
    slug: "hawk-perch-truck",
    title: "Hawk Perch Truck",
    difficulty: "easy", ageRange: "4-6",
    description: "A small cartoon hawk is perched right on top of the cab roof, gripping the edge with its talons! The truck itself is simple and sturdy with big round tires. The hawk looks proud and ready to ride along for the adventure!",
    altText: "Black and white coloring page of a simple monster truck with a small cartoon hawk perched on the cab roof gripping the edge with talons",
    prompt: "A simple cartoon monster truck with a small cute cartoon hawk bird perched on top of the cab roof. The cartoon hawk grips the front edge of the roof with its talons. The hawk is in a proud sitting pose. Side view. Thick simple outlines. Big round tires. Simple body design for young children."
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
  const catId = "cat-hawk-monster-truck-coloring-pages";
  if (!cats.find(c => c.id === catId)) {
    cats.push({ id: catId, slug: "hawk-monster-truck-coloring-pages", name: "Hawk Monster Truck Coloring Pages",
      description: "Free printable hawk monster truck coloring pages for kids ages 2-8. Hawk beak bumpers, talon grab fronts, dive bomb stances, wing spoilers, feather exhaust pipes — every truck has hawk features built right into its structure. Bold outlines, ready to print!",
      type: "theme" });
    fs.writeFileSync(catsPath, JSON.stringify(cats, null, 2));
    console.log("Created Hawk category");
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
  console.log(`\n✅ Hawk collection complete: ${PAGES.length} pages`);
}
main().catch(e => { console.error(e); process.exit(1); });
