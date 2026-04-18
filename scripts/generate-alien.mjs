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
    slug: "flying-saucer-roof-truck",
    title: "Flying Saucer Roof Truck",
    difficulty: "medium", ageRange: "4-6",
    description: "This truck has a real flying saucer built right into the roof! A wide dome-shaped UFO disc sits on top of the cab as the roof, complete with a rounded top and a flat rim extending out to the sides. Out of this world!",
    altText: "Black and white coloring page of a monster truck with a flying saucer UFO dome shape as the cab roof",
    prompt: "A monster truck where the cab roof is a wide flat flying saucer UFO dome shape. The dome has a rounded top and a flat disc rim that extends outward on both sides past the cab walls. The body is a standard powerful monster truck with four huge knobby tires. Side view."
  },
  {
    slug: "alien-eye-headlights-truck",
    title: "Alien Eye Headlights Truck",
    difficulty: "medium", ageRange: "4-6",
    description: "Three huge oval alien eyes stare out from the front of this monster truck! Instead of normal headlights, three large teardrop-shaped alien eyes line the front end, each with a big iris and pupil inside.",
    altText: "Black and white coloring page of a monster truck with three large oval alien eye shapes as headlights across the front",
    prompt: "A monster truck with three large oval alien eye shapes across the entire front end as headlights. Each eye is a tall teardrop oval with a large circle iris and small circle pupil inside. The three eyes are evenly spaced across the front bumper area. Side-front three-quarter view. Four huge tires."
  },
  {
    slug: "baby-alien-truck",
    title: "Baby Alien Truck",
    difficulty: "easy", ageRange: "2-4",
    description: "A super cute little monster truck with big round alien eyes, a dome head shape on the hood, and two tiny wiggly antennas sticking up from the roof. Perfect for little kids who love aliens and trucks!",
    altText: "Black and white coloring page of a simple cute monster truck with big oval alien eyes, two small antennas on the roof, and a round head shape on the hood",
    prompt: "A very simple cartoon monster truck with two giant oval alien eyes as headlights on the front. A round smooth dome shape on top of the hood. Two small thin antennas with tiny round tips sticking up from the cab roof. Side view. Only 5 to 6 large shapes. Extra thick outlines for toddlers."
  },
  {
    slug: "tentacle-bumper-truck",
    title: "Tentacle Bumper Truck",
    difficulty: "hard", ageRange: "6-8",
    description: "The front bumper of this wild truck has alien tentacles! Multiple long curling tentacles reach forward and curl at the tips, replacing the standard bumper. Suction cup shapes line the underside of each tentacle.",
    altText: "Black and white coloring page of a monster truck with alien tentacles reaching forward from the front bumper",
    prompt: "A monster truck where the front bumper is replaced by four to five alien tentacles that reach forward and curl at their tips. Each tentacle has suction cup circles along the underside. The tentacles spread outward and upward from the front of the truck. Side view. Four large tires."
  },
  {
    slug: "raygun-exhaust-truck",
    title: "Raygun Exhaust Truck",
    difficulty: "medium", ageRange: "4-6",
    description: "This truck's exhaust pipes are shaped like sci-fi ray guns! Two big ray gun shapes point backward from the roof with flared muzzle ends, a trigger guard shape, and energy vents along the barrel.",
    altText: "Black and white coloring page of a monster truck with exhaust pipes shaped like sci-fi ray guns pointing backward",
    prompt: "A monster truck with two large sci-fi ray gun shaped exhaust pipes mounted on top of the cab pointing backward. Each exhaust has a wide flared muzzle end, a cylindrical barrel with vents cut into it, and a handle grip shape below. Side view. Four big knobby tires."
  },
  {
    slug: "alien-pod-cab-truck",
    title: "Alien Pod Cab Truck",
    difficulty: "hard", ageRange: "6-8",
    description: "This truck's cab is shaped like an alien escape pod! An oval egg-shaped pod forms the entire cab body with a single large bubble windshield dome on the front and seam lines running around it like a space capsule.",
    altText: "Black and white coloring page of a monster truck with the cab shaped like an oval alien escape pod with a bubble windshield",
    prompt: "A monster truck where the entire cab is shaped like an oval egg-shaped alien escape pod. A single large bubble dome protrudes from the front of the pod as the windshield. Horizontal seam lines and rivet shapes run around the pod body. The pod sits on a wide flat truck chassis. Four oversized tires. Side view."
  },
  {
    slug: "antenna-array-truck",
    title: "Antenna Array Truck",
    difficulty: "easy", ageRange: "2-4",
    description: "This simple truck is covered in antennas! Six different sized antennas stick straight up from the cab roof — tall ones, short ones, ones with ball tips, and ones with dish shapes on top. Fun and easy to color!",
    altText: "Black and white coloring page of a simple monster truck with multiple different antenna shapes sticking up from the roof",
    prompt: "A simple cartoon monster truck with six antennas of different sizes sticking straight up from the cab roof. Some antennas have round ball tips, some have small dish shapes on top, and some are plain thin rods. The antennas vary in height. Side view. Only a few large simple shapes. Thick outlines."
  },
  {
    slug: "ufo-beam-truck",
    title: "UFO Beam Truck",
    difficulty: "medium", ageRange: "4-6",
    description: "A UFO disc floats above this truck on a tall pole! The flying saucer is mounted on a pole rising from the cab roof, and a wide triangular tractor beam shape shines downward from the disc to the truck body below.",
    altText: "Black and white coloring page of a monster truck with a UFO disc on a pole above the cab and a triangular beam shape coming down from it",
    prompt: "A monster truck with a tall vertical pole rising from the center of the cab roof. A wide flat UFO disc sits on top of the pole. A wide triangular beam shape points downward from the disc to the truck roof below. The beam has horizontal lines inside it. Side view. Four large tires."
  },
  {
    slug: "alien-claw-wheels-truck",
    title: "Alien Claw Wheels Truck",
    difficulty: "hard", ageRange: "6-8",
    description: "These wheels are unlike anything on Earth! Each wheel has three long curved alien finger claw shapes as the spokes, reaching from the center hub outward to the rim, like alien hands gripping from inside.",
    altText: "Black and white coloring page of a monster truck where each wheel has three alien finger claw shapes as spokes",
    prompt: "A monster truck where each of the four wheels has three long curved alien claw finger shapes as spokes. Each claw reaches from the center hub out to the wheel rim and curves slightly. The claws look like alien hands gripping the inside of the wheel. Side view."
  },
  {
    slug: "space-bug-truck",
    title: "Space Bug Truck",
    difficulty: "easy", ageRange: "2-4",
    description: "This monster truck is shaped like a round space bug! The truck body is wide and round like a beetle, two giant alien eyes sit on top, and small wing shapes stick out from both sides. Cute and creepy at the same time!",
    altText: "Black and white coloring page of a simple monster truck shaped like a round bug with big alien eyes and small wings on the sides",
    prompt: "A very simple cartoon monster truck with a wide rounded body shaped like a fat beetle or bug. Two very large oval alien eyes on top of the rounded body. Two small stubby wing shapes sticking out from each side of the body. Side view. Only 5 large shapes total. Extra thick outlines."
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
  const catId = "cat-alien-ufo-monster-truck-coloring-pages";
  if (!cats.find(c => c.id === catId)) {
    cats.push({ id: catId, slug: "alien-ufo-monster-truck-coloring-pages", name: "Alien UFO Monster Truck Coloring Pages",
      description: "Free printable alien UFO monster truck coloring pages for kids ages 2-8. Flying saucer roofs, alien eye headlights, tentacle bumpers, ray gun exhausts — every truck is built with out-of-this-world alien features. Bold outlines, ready to print!",
      type: "theme" });
    fs.writeFileSync(catsPath, JSON.stringify(cats, null, 2));
    console.log("Created Alien UFO category");
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
  console.log(`\n✅ Alien UFO collection complete: ${PAGES.length} pages`);
}
main().catch(e => { console.error(e); process.exit(1); });
