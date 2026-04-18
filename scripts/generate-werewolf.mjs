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
    slug: "werewolf-claw-bumper-truck",
    title: "Werewolf Claw Bumper Truck",
    difficulty: "medium", ageRange: "4-6",
    description: "This monster truck means business! The entire front bumper is shaped like two massive werewolf claws curling forward, ready to grab anything in its path. Thick curved talons jut out from each side of the grille.",
    altText: "Black and white coloring page of a monster truck with two large werewolf claw shapes forming the front bumper",
    prompt: "A monster truck with two huge werewolf claws curving forward as the front bumper, each claw has three long sharp curved talons gripping forward. The claws extend out from each side of the front grille. Wide aggressive body. Side view. Four massive knobby tires."
  },
  {
    slug: "full-moon-roof-light-truck",
    title: "Full Moon Roof Light Truck",
    difficulty: "medium", ageRange: "4-6",
    description: "This wild truck has a giant circular spotlight mounted on the roof shaped exactly like a full moon. Two pointed werewolf ear shapes stick up from the corners of the cab roof. It glows across the night sky!",
    altText: "Black and white coloring page of a monster truck with a full moon shaped roof spotlight and werewolf ears on the cab",
    prompt: "A monster truck with a large perfectly round spotlight mounted on top of the cab roof shaped like a full moon with surface craters on it. Two sharp pointed werewolf ear shapes rise up from the front corners of the cab roof. Powerful wide body. Side view. Four oversized tires."
  },
  {
    slug: "baby-werewolf-truck",
    title: "Baby Werewolf Truck",
    difficulty: "easy", ageRange: "2-4",
    description: "This cute little monster truck has fluffy rounded ear shapes on top, two little fangs poking out of the front bumper, big round friendly eyes as headlights, and tiny claw shapes used as side mirrors. So adorable!",
    altText: "Black and white coloring page of a simple cute monster truck with fluffy ears on roof, tiny fangs on bumper, and claw mirrors",
    prompt: "A very simple cartoon monster truck with two rounded fluffy ear shapes on top of the cab roof. Two small cute fang shapes sticking out from the front bumper. Big round friendly circle eyes as headlights. Tiny three-claw shapes as side mirrors. Only 5 to 6 large simple shapes total. Extra thick outlines. Side view. Big round tires."
  },
  {
    slug: "howling-hood-truck",
    title: "Howling Hood Truck",
    difficulty: "hard", ageRange: "6-8",
    description: "The entire hood of this truck is sculpted like a werewolf head tilted back in a full howl! The mouth opens upward toward the sky, rows of fangs visible inside. The brow ridge forms a built-in spoiler above the windshield.",
    altText: "Black and white coloring page of a monster truck with a hood shaped like a howling werewolf head tilted back",
    prompt: "A monster truck where the entire hood is sculpted like a werewolf head tilted back with the open mouth pointing upward howling. The open mouth shows two rows of sharp fangs pointing up toward the sky. A heavy fur-textured brow ridge flows back to form a spoiler just above the windshield. Side view. Four huge tires."
  },
  {
    slug: "werewolf-jaw-grille-truck",
    title: "Werewolf Jaw Grille Truck",
    difficulty: "medium", ageRange: "4-6",
    description: "The entire front grille of this truck is shaped like a wide open werewolf mouth! Long sharp fangs line the top and bottom of the grille opening, and the headlights are set into the upper jaw like glowing eyes.",
    altText: "Black and white coloring page of a monster truck with an open werewolf mouth grille with long fangs top and bottom",
    prompt: "A monster truck with the entire front grille shaped like a wide open werewolf mouth. Long sharp fangs along the top edge and bottom edge of the grille opening, top and bottom fangs facing each other. The headlights are built into the upper section like two glowing eyes above the open mouth. Front three-quarter view. Massive tires."
  },
  {
    slug: "shaggy-fender-truck",
    title: "Shaggy Fender Truck",
    difficulty: "hard", ageRange: "6-8",
    description: "This wild truck looks like it grew a fur coat! Each fender has thick jagged fur-like edges sticking outward in every direction, giving the whole truck a shaggy untamed silhouette. The roof line also has jagged fur tufts.",
    altText: "Black and white coloring page of a monster truck with jagged fur-like fender edges giving it a shaggy wild appearance",
    prompt: "A monster truck where all four fenders have thick jagged irregular edges sticking outward like wild shaggy fur. The roof has jagged fur-like tufts along the top edge. The body outline of the entire truck is rough and wild with fur-shaped protrusions. Side view. Four large tires visible beneath the shaggy fenders."
  },
  {
    slug: "werewolf-paw-wheels-truck",
    title: "Werewolf Paw Wheels Truck",
    difficulty: "easy", ageRange: "2-4",
    description: "Every single wheel hub on this truck is shaped like a werewolf paw! Five thick claw shapes extend outward from each hub like a spinning paw swipe. The truck itself is clean and simple so you can focus on those amazing wheels.",
    altText: "Black and white coloring page of a monster truck where each wheel hub is shaped like a werewolf paw with claws extending out",
    prompt: "A simple strong monster truck where each of the four wheel hubs is clearly shaped like a werewolf paw with five curved claw shapes extending outward from the hub center like a star. The claws are thick and bold. Clean simple truck body. Side view. Thick outlines."
  },
  {
    slug: "transformation-truck",
    title: "Transformation Truck",
    difficulty: "hard", ageRange: "6-8",
    description: "Half truck, half beast! The left side of this truck is a normal clean pickup, but the right side is mid-transformation with claws ripping through the fender metal, fangs pushing out through the front bumper edge, and fur ridges erupting from the body panels.",
    altText: "Black and white coloring page of a monster truck half normal half transforming into werewolf with claws and fangs emerging",
    prompt: "A monster truck split down the middle: the left half is a clean normal pickup truck side, the right half shows werewolf transformation mid-process with large claws tearing through and breaking the fender metal, three sharp fangs pushing out through the right side of the front bumper, and thick fur ridge shapes erupting through cracks in the body panels. Side view showing both halves clearly. Four huge tires."
  },
  {
    slug: "wolf-fang-exhaust-truck",
    title: "Wolf Fang Exhaust Truck",
    difficulty: "medium", ageRange: "4-6",
    description: "Four exhaust pipes rise behind the cab of this beast, but each pipe is curved and pointed just like a werewolf fang! They curve slightly inward at the tips, like four massive fangs biting at the sky.",
    altText: "Black and white coloring page of a monster truck with four curved fang-shaped exhaust pipes rising behind the cab",
    prompt: "A monster truck with four tall exhaust pipes mounted behind the cab, each pipe is shaped like a curved werewolf fang that tapers to a sharp point and curves slightly inward at the tip. The four fangs are arranged in a row, two taller in the center and two shorter on the outside. Powerful wide body. Side view. Four big knobby tires."
  },
  {
    slug: "moonlight-runner-truck",
    title: "Moonlight Runner Truck",
    difficulty: "easy", ageRange: "2-4",
    description: "A fast and simple truck built for moonlit runs! Two pointed ear shapes stick straight up from the roof, and a large round moon disc is mounted behind the cab like a satellite dish. Clean bold lines make this one super easy to color!",
    altText: "Black and white coloring page of a simple monster truck with pointed ear roof shapes and a large round moon disc mounted behind the cab",
    prompt: "A simple clean monster truck with two sharp pointed ear shapes rising up from the front of the cab roof. A large flat circle mounted behind the cab on a short post like a satellite dish, representing a full moon. Very clean simple body with minimal detail. Only 5 to 6 large bold shapes. Side view. Big round tires. Extra thick outlines."
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
  const catId = "cat-werewolf-monster-truck-coloring-pages";
  if (!cats.find(c => c.id === catId)) {
    cats.push({ id: catId, slug: "werewolf-monster-truck-coloring-pages", name: "Werewolf Monster Truck Coloring Pages",
      description: "Free printable werewolf monster truck coloring pages for kids ages 2-8. Werewolf claw bumpers, howling hoods, fang exhausts, shaggy fenders, paw wheels — every truck is a beast. Bold outlines, ready to print!",
      type: "theme" });
    fs.writeFileSync(catsPath, JSON.stringify(cats, null, 2));
    console.log("Created Werewolf category");
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
  console.log(`\n✅ Werewolf collection complete: ${PAGES.length} pages`);
}
main().catch(e => { console.error(e); process.exit(1); });
