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
    slug: "mammoth-tusk-bumper-truck",
    title: "Mammoth Tusk Bumper Truck",
    difficulty: "hard", ageRange: "6-8",
    description: "This truck charges forward with two massive curved mammoth tusks extending from the front bumper! Each tusk sweeps outward in a long arc, just like a real woolly mammoth. The front end is reinforced with heavy steel to hold the enormous tusks.",
    altText: "Black and white coloring page of a monster truck with two huge curved mammoth tusks as the front bumper",
    prompt: "A monster truck with two massive long curved mammoth tusks extending forward and outward from the front bumper. Each tusk is thick at the base and tapers to a point, curving upward and outward in a wide arc. The front bumper is a heavy reinforced steel bar from which both tusks mount. Side view. Four huge knobby tires."
  },
  {
    slug: "trunk-crane-truck",
    title: "Trunk Crane Truck",
    difficulty: "medium", ageRange: "4-6",
    description: "A long mammoth trunk is mounted right on the hood of this truck, curving upward like a crane arm! The trunk coils up toward the sky and looks like it could lift anything. Two short tusks poke out from the front bumper.",
    altText: "Black and white coloring page of a monster truck with a mammoth trunk shape on the hood curving up like a crane",
    prompt: "A monster truck with a long thick mammoth trunk shape mounted on the center of the hood. The trunk curves upward and forward like a crane arm, rising above the cab height. Two short blunt tusks stick out from the front bumper on each side. Side view. Big knobby tires."
  },
  {
    slug: "baby-mammoth-truck",
    title: "Baby Mammoth Truck",
    difficulty: "easy", ageRange: "2-4",
    description: "The cutest truck in the Ice Age! This little monster truck has small rounded tusks on the bumper, floppy ear-shaped fenders on each side, big round friendly eyes, and a short stubby trunk on the hood. So adorable and easy to color!",
    altText: "Black and white coloring page of a simple cute monster truck with small tusks, floppy ear fenders, big round eyes, and a short trunk",
    prompt: "A very simple cute cartoon monster truck with two small rounded tusks on the front bumper. The front fenders on each side are shaped like large floppy rounded mammoth ears. Two big round friendly eyes as headlights. A short stubby trunk shape on the center of the front hood. Side view. Only 5 to 6 large simple shapes. Extra thick outlines."
  },
  {
    slug: "woolly-fender-truck",
    title: "Woolly Fender Truck",
    difficulty: "medium", ageRange: "4-6",
    description: "This truck looks like it grew its own fur! The wheel fenders have long shaggy hanging fur texture along their bottom edges, making the truck look like it is covered in woolly mammoth hair. The fender skirts droop down in thick shaggy strands.",
    altText: "Black and white coloring page of a monster truck with shaggy woolly fur texture hanging from the fender edges",
    prompt: "A monster truck where all four wheel fenders have long shaggy hanging fur fringe along their lower edges. The fur strands hang down in thick clumps like woolly mammoth hair, draping below the fenders. The truck body itself is a standard cab-and-bed shape. Side view. Large tires visible below the shaggy fur edges."
  },
  {
    slug: "mammoth-foot-wheels-truck",
    title: "Mammoth Foot Wheels Truck",
    difficulty: "easy", ageRange: "2-4",
    description: "Look at those wild wheels! Each tire on this truck is shaped wide and round like a mammoth's enormous foot, complete with toenail shapes along the front. These prehistoric wheels look like they could stomp anything flat!",
    altText: "Black and white coloring page of a monster truck with wide round tires shaped like mammoth feet with toenail shapes",
    prompt: "A monster truck where each of the four wheels is wide, flat, and round shaped like a mammoth's foot. Each wheel has four or five simple toenail shapes along the front bottom edge. The wheels are extra wide and slightly oval. Side view. Simple truck cab and body above the round foot-shaped wheels."
  },
  {
    slug: "tusk-ram-hood-truck",
    title: "Tusk Ram Hood Truck",
    difficulty: "hard", ageRange: "6-8",
    description: "The entire hood of this truck tapers forward into one single massive tusk shape — a giant battering ram built right into the truck! The tusk hood narrows to a blunt point at the very front and is thick as armor all the way to the cab.",
    altText: "Black and white coloring page of a monster truck with the entire hood shaped as a single massive tusk battering ram",
    prompt: "A monster truck where the entire hood is shaped as one enormous single tusk, tapering from the wide cab down to a blunt rounded point at the very front of the truck. The tusk hood is thick and heavily built, taking up the full length of the front end. Thick cab behind it. Side view. Four large knobby tires."
  },
  {
    slug: "ice-age-armor-truck",
    title: "Ice Age Armor Truck",
    difficulty: "hard", ageRange: "6-8",
    description: "This truck rode out of the Ice Age covered head to toe in frozen armor! The cab is wrapped in thick angular ice plate shapes, and long icicle edges hang from the running boards and bumpers. It looks frozen solid and totally unstoppable.",
    altText: "Black and white coloring page of a monster truck covered in thick ice armor plates with icicles hanging from the edges",
    prompt: "A monster truck with the entire cab and body covered in thick angular ice plate armor shapes. The plates are irregular chunky polygons layered over the cab surfaces. Long pointed icicle shapes hang down from the running boards, rear bumper, and front bumper edges. Side view. Four massive tires."
  },
  {
    slug: "mammoth-ear-door-truck",
    title: "Mammoth Ear Door Truck",
    difficulty: "medium", ageRange: "4-6",
    description: "The doors on this truck are shaped just like a mammoth's giant floppy ears! Each door has a large rounded ear outline with the inner ear ridges visible. When the truck drives by, it looks like a mammoth flapping its ears.",
    altText: "Black and white coloring page of a monster truck with doors shaped like large floppy mammoth ears",
    prompt: "A monster truck where each side door panel is shaped like a large floppy rounded mammoth ear. The ear-shaped doors are wide and slightly irregular at the bottom, matching the rounded droop of a real mammoth ear. Simple inner ear curved ridge lines on each door. Side view showing one ear-shaped door clearly. Big tires."
  },
  {
    slug: "trunk-exhaust-truck",
    title: "Trunk Exhaust Truck",
    difficulty: "medium", ageRange: "4-6",
    description: "Instead of a regular exhaust pipe, this truck has a mammoth trunk! The trunk-shaped exhaust curls up from the engine, rises high above the cab, and sprays exhaust smoke right from the tip just like a real mammoth trumpeting. The tip flares open wide.",
    altText: "Black and white coloring page of a monster truck with an exhaust pipe shaped like a curling mammoth trunk",
    prompt: "A monster truck with a single large exhaust pipe shaped like a mammoth's trunk. The trunk pipe rises from the engine area, curves up above the cab, and the tip flares open wide like a trumpeting mammoth. Puff lines at the tip suggest exhaust coming out. Side view. Large knobby tires."
  },
  {
    slug: "prehistoric-king-truck",
    title: "Prehistoric King Truck",
    difficulty: "easy", ageRange: "4-6",
    description: "All hail the Prehistoric King! This bold truck has two short tusks sticking out from the bumper, a simple crown shape sitting on top of the cab roof, and a short round trunk bumper guard on the front. Simple shapes, big personality!",
    altText: "Black and white coloring page of a simple monster truck with two short tusks, a crown on the roof, and a short trunk bumper",
    prompt: "A simple monster truck with two short straight tusks sticking outward from the front bumper on each side. A flat crown shape sits centered on the top of the cab roof with three simple points. A short thick rounded trunk shape forms the center of the front bumper. Side view. Only 5 to 6 large shapes. Extra thick outlines. Big tires."
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
  const catId = "cat-mammoth-monster-truck-coloring-pages";
  if (!cats.find(c => c.id === catId)) {
    cats.push({ id: catId, slug: "mammoth-monster-truck-coloring-pages", name: "Mammoth Monster Truck Coloring Pages",
      description: "Free printable mammoth monster truck coloring pages for kids ages 2-8. Tusk bumpers, trunk cranes, woolly fenders, ice age armor — every truck is built like a prehistoric beast. Bold outlines, ready to print!",
      type: "theme" });
    fs.writeFileSync(catsPath, JSON.stringify(cats, null, 2));
    console.log("Created Mammoth category");
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
  console.log(`\n✅ Mammoth collection complete: ${PAGES.length} pages`);
}
main().catch(e => { console.error(e); process.exit(1); });
