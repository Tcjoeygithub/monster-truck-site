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
    slug: "wolverine-claw-bumper-truck",
    title: "Wolverine Claw Bumper Truck",
    difficulty: "hard", ageRange: "6-8",
    description: "This truck means serious business! Three long curved wolverine animal claws extend forward from each side of the front bumper, like the real wolverine's powerful digging claws built right into the metal.",
    altText: "Black and white coloring page of a monster truck with three long curved wolverine animal claws extending from each side of the front bumper",
    prompt: "A monster truck with three long curved animal claws extending forward from each side of the front bumper, like wolverine animal digging claws built into the metal bumper. Six total claws spread wide. Heavy reinforced bumper frame. Side view. Four huge knobby tires."
  },
  {
    slug: "snarling-wolverine-hood-truck",
    title: "Snarling Wolverine Hood Truck",
    difficulty: "medium", ageRange: "4-6",
    description: "The hood of this truck is shaped like a wolverine animal's snarling face! You can see the bared teeth and small angry eyes sculpted right into the hood metal — fierce and ready to roll.",
    altText: "Black and white coloring page of a monster truck with a hood shaped like a snarling wolverine animal face with bared teeth",
    prompt: "A monster truck where the hood is shaped like a wolverine animal's snarling face with bared teeth and small angry eyes sculpted into the metal. The front edge of the hood shows the open snarling mouth with teeth. Small fierce eyes as hood scoops near the top. Side view. Big tires."
  },
  {
    slug: "baby-wolverine-truck",
    title: "Baby Wolverine Truck",
    difficulty: "easy", ageRange: "2-4",
    description: "A cute little monster truck inspired by a baby wolverine animal! It has small round ears on the roof, tiny claws on the bumper, and fuzzy-looking rounded fender edges. Adorable and easy to color!",
    altText: "Black and white coloring page of a simple cute monster truck with small round ears on the roof and tiny claws on the bumper",
    prompt: "A very simple cartoon monster truck with two small round animal ears on top of the cab roof. Two tiny short claw shapes sticking out from the front bumper. Rounded bumpy fender edges that look fuzzy. Big round friendly headlights. Side view. Only 5 to 6 large shapes. Extra thick outlines."
  },
  {
    slug: "burrowing-plow-truck",
    title: "Burrowing Plow Truck",
    difficulty: "medium", ageRange: "4-6",
    description: "Built like a wolverine animal digging a den! This truck has a low flat front end with a wide scoop-shaped bumper perfect for pushing through dirt, and oversized dirt-flap fenders all around.",
    altText: "Black and white coloring page of a monster truck with a wide scoop-shaped front bumper like a wolverine digging, with large dirt-flap fenders",
    prompt: "A monster truck with a very low flat front end and a wide angled scoop-shaped front bumper like an animal digging through dirt. Large wide mud flap fenders around all four wheels. The truck sits low and heavy to the ground. Side view. Massive chunky tires."
  },
  {
    slug: "wolverine-fury-exhaust-truck",
    title: "Wolverine Fury Exhaust Truck",
    difficulty: "medium", ageRange: "4-6",
    description: "Four short exhaust pipes blast out from each side of this truck, angled outward and spread like wolverine animal claws scratching the air! The engine roars and the claws spit fire.",
    altText: "Black and white coloring page of a monster truck with four short exhaust pipes on each side angled outward like wolverine animal claws",
    prompt: "A monster truck with four short exhaust pipes mounted on each side of the truck body, angled outward and spread apart like animal claws scratching through the air. Eight total pipes. The pipes splay out from the engine compartment. Side view. Large knobby tires."
  },
  {
    slug: "thick-hide-fender-truck",
    title: "Thick Hide Fender Truck",
    difficulty: "hard", ageRange: "6-8",
    description: "This truck's fenders are extra thick and chunky — just like the wolverine animal's stocky powerful body! The oversized fenders are way bigger than normal, making the whole truck look short and massively built.",
    altText: "Black and white coloring page of a monster truck with extra thick oversized chunky fenders like a wolverine animal's stocky body",
    prompt: "A monster truck with extremely thick and chunky oversized fenders on all four wheels. The fenders are much thicker and larger than normal truck fenders, making the truck look stocky and massively built like a powerful short animal. Very wide low body. Side view. Huge tires."
  },
  {
    slug: "claw-scratch-hood-truck",
    title: "Claw Scratch Hood Truck",
    difficulty: "easy", ageRange: "2-4",
    description: "Three deep claw scratch marks are gouged right through the hood metal, showing the engine underneath! The marks are wide and deep, just like a wolverine animal's powerful claws would make.",
    altText: "Black and white coloring page of a monster truck hood with three deep claw scratch gouge marks cut through the metal showing the engine",
    prompt: "A monster truck where the hood has three deep wide claw scratch gouge marks cut through the metal from front to back, showing the engine below through the gaps. The claw marks are large and dramatic. Simple truck body. Side view. Big round tires. Bold outlines."
  },
  {
    slug: "wolverine-stance-truck",
    title: "Wolverine Stance Truck",
    difficulty: "medium", ageRange: "4-6",
    description: "This truck has the famous wolverine animal stance — extra wide and very low to the ground, wider than it is tall! The whole truck looks stocky, powerful, and ready to charge.",
    altText: "Black and white coloring page of a monster truck with an extra wide low stance like a wolverine animal, wider than it is tall",
    prompt: "A monster truck with an extremely wide and very low stance, much wider than it is tall like a stocky low animal. The axles are stretched out very wide. The cab is short and low. The truck looks powerful and grounded. Side view. Wide-set enormous tires."
  },
  {
    slug: "snapping-jaw-grille-truck",
    title: "Snapping Jaw Grille Truck",
    difficulty: "hard", ageRange: "6-8",
    description: "The whole front grille of this truck is shaped like a wolverine animal's open jaws! Sharp teeth line the top and bottom of the grille opening, and the powerful jaw structure frames the entire front end.",
    altText: "Black and white coloring page of a monster truck with the front grille shaped like a wolverine animal's open jaw with sharp teeth",
    prompt: "A monster truck where the entire front grille is shaped like an animal's open jaw with rows of sharp teeth on the top and bottom edges of the grille opening. The jaw structure forms the whole front end frame. Powerful wide jaw bones on each side. Side view. Huge tires."
  },
  {
    slug: "wolverine-den-cab-truck",
    title: "Wolverine Den Cab Truck",
    difficulty: "easy", ageRange: "4-6",
    description: "The cab of this truck is shaped like a wolverine animal's cozy den cave entrance! The windshield sits inside a round cave-opening shape, and the roofline curves down on the sides like a low burrow.",
    altText: "Black and white coloring page of a monster truck with the cab shaped like a wolverine den cave entrance with a round windshield opening",
    prompt: "A monster truck where the cab is shaped like a small cave or den entrance. The windshield sits inside a round arched opening like a burrow entrance. The roofline is low and curves down on the sides like a den roof. Simple rounded cave-like cab shape. Side view. Big tires. Thick outlines."
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
  const catId = "cat-wolverine-monster-truck-coloring-pages";
  if (!cats.find(c => c.id === catId)) {
    cats.push({ id: catId, slug: "wolverine-monster-truck-coloring-pages", name: "Wolverine Monster Truck Coloring Pages",
      description: "Free printable wolverine animal monster truck coloring pages for kids ages 2-8. Claw bumpers, snarling hoods, burrowing plows, snapping jaw grilles — every truck is built with wolverine animal features. Bold outlines, ready to print!",
      type: "theme" });
    fs.writeFileSync(catsPath, JSON.stringify(cats, null, 2));
    console.log("Created Wolverine category");
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
  console.log(`\n✅ Wolverine collection complete: ${PAGES.length} pages`);
}
main().catch(e => { console.error(e); process.exit(1); });
