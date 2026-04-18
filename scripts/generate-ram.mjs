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
    slug: "curling-horn-bumper-truck",
    title: "Curling Horn Bumper Truck",
    difficulty: "hard", ageRange: "6-8",
    description: "This truck hits hard! Two massive curling bighorn ram horns spiral outward from each side of the front bumper, forming a wide sweeping pair of horns that wrap around the front end. Built to charge!",
    altText: "Black and white coloring page of a monster truck with two large curling bighorn ram horns on the front bumper",
    prompt: "A monster truck with two massive curling bighorn sheep ram horns mounted on each side of the front bumper, spiraling outward in wide loops. The horns wrap forward and curve out away from the truck body. Thick ridged horn texture on each horn. Wide aggressive body. Side view. Four huge knobby tires."
  },
  {
    slug: "ram-skull-hood-truck",
    title: "Ram Skull Hood Truck",
    difficulty: "medium", ageRange: "4-6",
    description: "The hood of this truck is shaped like a ram skull! Two large hollow eye sockets serve as air intakes, and a pair of thick curved horns sweep back along the sides of the hood. Totally fierce!",
    altText: "Black and white coloring page of a monster truck with a hood shaped like a ram skull with eye socket air intakes",
    prompt: "A monster truck where the hood is sculpted in the shape of a ram skull. Two large hollow eye socket shapes cut into the hood serve as air intakes. Two thick curved ram horns extend back along each side of the hood from the front edge. A wide snout shape at the very front of the hood. Side view. Four oversized tires."
  },
  {
    slug: "baby-ram-truck",
    title: "Baby Ram Truck",
    difficulty: "easy", ageRange: "2-4",
    description: "The cutest little monster truck ever! Two small curling horns sit on the cab roof, and fluffy rounded bumps line the fender edges like soft wool. Big round friendly eyes make it totally adorable!",
    altText: "Black and white coloring page of a simple cute monster truck with two small curling horns on the roof and fluffy fender edges",
    prompt: "A very simple cartoon monster truck with two small curling ram horns on top of the cab roof. The fender edges have a row of rounded fluffy bumps along them like woolly tufts. Big round friendly eyes as headlights. Chubby simple body shape. Side view. Only 5 to 6 large shapes. Extra thick outlines."
  },
  {
    slug: "battering-ram-bumper-truck",
    title: "Battering Ram Bumper Truck",
    difficulty: "hard", ageRange: "6-8",
    description: "The front of this truck IS the weapon! A wide flat reinforced steel battering ram plate covers the entire front end, braced by thick crossbars, with a single ram horn spiral emblem embossed in the center.",
    altText: "Black and white coloring page of a monster truck with a wide flat battering ram front plate and a spiral horn emblem",
    prompt: "A monster truck with the entire front end replaced by a massive wide flat reinforced steel battering ram plate. The plate is braced by thick horizontal and diagonal crossbars. A large ram horn spiral shape is embossed in the center of the plate as an emblem. The plate extends wider than the truck body. Side view. Huge aggressive tires."
  },
  {
    slug: "wool-cloud-exhaust-truck",
    title: "Wool Cloud Exhaust Truck",
    difficulty: "easy", ageRange: "2-4",
    description: "When this truck revs up, the exhaust pipes puff out big fluffy cloud shapes! The exhaust clouds look like puffy wool balls floating behind the cab. Two small curling horns sit on the hood up front.",
    altText: "Black and white coloring page of a simple monster truck with cloud shaped exhaust puffs and small curling horns",
    prompt: "A simple cartoon monster truck with two exhaust pipes rising behind the cab, each puffing out a large fluffy round cloud shape made of bumpy rounded lobes like a bundle of wool. Two small curling ram horns on the front of the hood. Simple blocky truck body. Side view. Thick outlines for young kids. Big tires."
  },
  {
    slug: "mountain-climber-truck",
    title: "Mountain Climber Truck",
    difficulty: "medium", ageRange: "4-6",
    description: "This truck is built for the steep stuff! Its body is angled sharply upward like it's scaling a cliff face, with an aggressive forward-leaning stance and a roll bar shaped like a curving horn arc over the cab.",
    altText: "Black and white coloring page of a monster truck angled steeply upward in a climbing stance with a horn-shaped roll bar",
    prompt: "A monster truck tilted at a steep upward angle as if climbing a vertical rock face, front end high and rear end low. The truck has an aggressive forward-leaning climbing stance with large suspension detail. A thick roll bar over the cab is shaped like a single curved horn arc. Side view. Huge knobby tires with deep tread."
  },
  {
    slug: "ram-charge-stance-truck",
    title: "Ram Charge Stance Truck",
    difficulty: "medium", ageRange: "4-6",
    description: "This truck is charging full speed! The body leans far forward with the hood dropped low like a ram lowering its head before a charge. The rear wheels are lifted slightly, all the weight pushing forward.",
    altText: "Black and white coloring page of a monster truck leaning far forward with the hood lowered in a charging ram stance",
    prompt: "A monster truck in an aggressive charging stance, body tilted sharply forward with the front end and hood dipped very low toward the ground. The rear wheels are lifted slightly off the ground. The front end points forward aggressively like a ram lowering its head to charge. Side view. Thick knobby tires."
  },
  {
    slug: "horn-spiral-wheels-truck",
    title: "Horn Spiral Wheels Truck",
    difficulty: "medium", ageRange: "4-6",
    description: "Check out those wild wheels! Every single wheel hub on this truck has a spiral ram horn shape as the center design, with the spiral curling inward from the rim. The whole truck looks ready to spin!",
    altText: "Black and white coloring page of a monster truck where each wheel hub has a spiral ram horn shape in the center",
    prompt: "A monster truck where each of the four large wheel hubs has a prominent spiral ram horn shape as the hub cap design. Each spiral curls inward from the outer rim toward the center axle point, with clear ridged horn texture. Wide aggressive truck body. Side view. Four massive tires each with the horn spiral hub."
  },
  {
    slug: "double-ram-hood-truck",
    title: "Double Ram Hood Truck",
    difficulty: "hard", ageRange: "6-8",
    description: "Double the ram power! Two full ram head sculptures are mounted side by side on the hood, each with its own set of thick curling horns sweeping outward in opposite directions. Pure unstoppable force!",
    altText: "Black and white coloring page of a monster truck with two ram head sculptures on the hood with horns curling outward",
    prompt: "A monster truck with two ram head sculptures mounted side by side on the hood surface. Each ram head faces forward and has a thick set of curling bighorn horns. The horns of the left head curl outward to the left and the horns of the right head curl outward to the right, creating a wide symmetrical wing of horns across the hood. Side view. Four large tires."
  },
  {
    slug: "ram-crown-truck",
    title: "Ram Crown Truck",
    difficulty: "easy", ageRange: "4-6",
    description: "King of the monster trucks! A ring of small pointed horn shapes circles the entire roof edge like a crown of horns. Simple and bold, this truck wears its crown proudly. Easy and fun to color!",
    altText: "Black and white coloring page of a simple monster truck with a ring of small horn shapes around the roof edge like a crown",
    prompt: "A simple monster truck with a ring of small pointed curved horn shapes running all around the edge of the cab roof like a crown. Each small horn curves slightly outward and upward. Simple blocky truck body. Side view. Bold thick outlines. Big tires. Clean simple design easy for young children."
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
  const catId = "cat-ram-monster-truck-coloring-pages";
  if (!cats.find(c => c.id === catId)) {
    cats.push({ id: catId, slug: "ram-monster-truck-coloring-pages", name: "Ram Monster Truck Coloring Pages",
      description: "Free printable ram monster truck coloring pages for kids ages 2-8. Curling horn bumpers, battering ram front plates, skull hoods, spiral horn wheels — every truck is built like a bighorn beast. Bold outlines, ready to print!",
      type: "theme" });
    fs.writeFileSync(catsPath, JSON.stringify(cats, null, 2));
    console.log("Created Ram category");
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
  console.log(`\n✅ Ram collection complete: ${PAGES.length} pages`);
}
main().catch(e => { console.error(e); process.exit(1); });
