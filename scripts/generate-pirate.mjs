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
    slug: "cannon-barrel-exhaust-truck",
    title: "Cannon Barrel Exhaust Truck",
    difficulty: "medium", ageRange: "4-6",
    description: "This truck fires up in style! Two exhaust pipes shaped like old pirate ship cannons point backward from the cab, complete with round barrel ends and cannon rings. Smoke comes out the back like a real cannonball launcher!",
    altText: "Black and white coloring page of a monster truck with two pirate ship cannon shaped exhaust pipes pointing backward",
    prompt: "A monster truck with two large exhaust pipes shaped exactly like old pirate ship cannons pointing backward from each side of the cab. The cannon barrels are round and cylindrical with rings along the barrel. The cannon mouths point toward the rear of the truck. Side view. Four huge knobby tires."
  },
  {
    slug: "skull-crossbones-grille-truck",
    title: "Skull Crossbones Grille Truck",
    difficulty: "medium", ageRange: "4-6",
    description: "Ahoy! The front of this truck is a huge skull and crossbones grille! The eye sockets are the headlights, the nose is the air intake, and two crossed bones form the lower bumper. No pirate ship is scarier than this truck!",
    altText: "Black and white coloring page of a monster truck with a skull and crossbones shaped front grille and eye socket headlights",
    prompt: "A monster truck where the entire front grille is shaped like a skull and crossbones. The two headlights are set inside the skull eye socket holes. The nose area has a triangular nose hole. The teeth are visible along the lower grille. Two large crossed bones form the lower bumper area below the skull. Side view. Four oversized tires."
  },
  {
    slug: "baby-pirate-truck",
    title: "Baby Pirate Truck",
    difficulty: "easy", ageRange: "2-4",
    description: "This cute little truck is ready to sail the seas! It has a pirate hat shape on the roof, an eye patch over one headlight, and a small anchor decoration on the door. Easy to color and adorable!",
    altText: "Black and white coloring page of a simple cute monster truck with a pirate hat on the roof and eye patch over one headlight",
    prompt: "A very simple cartoon monster truck with a pirate hat shape built onto the top of the cab roof. One headlight has an eye patch shape over it. A small anchor shape on the side door. Side view. Only 5 to 6 large simple shapes. Extra thick outlines. Friendly and cute style."
  },
  {
    slug: "pirate-hook-bumper-truck",
    title: "Pirate Hook Bumper Truck",
    difficulty: "hard", ageRange: "6-8",
    description: "Watch out! This truck's front bumper is made of two giant curved pirate hooks! Each hook curves outward and forward, ready to snag anything in its path. The metal hooks gleam with detailed ridges and a sharp pointed tip.",
    altText: "Black and white coloring page of a monster truck with two large curved pirate hooks as the front bumper structure",
    prompt: "A monster truck where the front bumper is made of two large curved pirate captain hooks. Each hook is thick metal with ridges, curving outward from the bumper center and the tips point inward. The hooks are the main front bumper structure. Detailed hook hardware and mounting bolts visible. Side view. Massive tires."
  },
  {
    slug: "ship-wheel-steering-truck",
    title: "Ship Wheel Steering Truck",
    difficulty: "medium", ageRange: "4-6",
    description: "This truck keeps it nautical! A large wooden ship's steering wheel is mounted flat on the hood as a decoration. Eight spokes radiate from the center hub to the outer ring, just like a real pirate ship helm!",
    altText: "Black and white coloring page of a monster truck with a large wooden ship steering wheel mounted on the hood",
    prompt: "A monster truck with a large ship steering wheel mounted flat on top of the hood as a decoration. The wheel has eight spokes radiating from a center hub to the outer wooden ring. The wheel is detailed with wooden grain texture lines. Side view. Four big tires."
  },
  {
    slug: "treasure-chest-truck-bed",
    title: "Treasure Chest Truck Bed",
    difficulty: "easy", ageRange: "2-4",
    description: "X marks the spot — and the spot is the truck bed! The open cargo bed is shaped like an overflowing treasure chest, with coins and gems spilling out over the sides. The chest lid is propped open at the back. Easy and fun to color!",
    altText: "Black and white coloring page of a simple monster truck with a treasure chest shaped bed overflowing with coins and gems",
    prompt: "A simple monster truck where the open truck bed is shaped like an open treasure chest. The chest has a curved lid propped open at the rear. Coins and gem shapes spill over the sides and front edge of the chest. Large simple round coin shapes and diamond gem shapes visible. Side view. Thick outlines. Big tires."
  },
  {
    slug: "cutlass-spoiler-truck",
    title: "Cutlass Spoiler Truck",
    difficulty: "medium", ageRange: "4-6",
    description: "This truck cuts through the air with style! The rear spoiler is shaped exactly like a curved pirate cutlass sword blade — wide at the base, tapering to a curved point. The blade shape arcs up dramatically over the truck bed.",
    altText: "Black and white coloring page of a monster truck with a rear spoiler shaped like a curved pirate cutlass sword blade",
    prompt: "A monster truck with a rear spoiler shaped like a curved pirate cutlass sword blade. The blade is wide at the base where it mounts to the truck and curves upward and forward to a sharp curved tip. The blade has a slight curve like a real cutlass. A simple guard shape at the base where it meets the truck body. Side view. Four big tires."
  },
  {
    slug: "jolly-roger-sail-truck",
    title: "Jolly Roger Sail Truck",
    difficulty: "easy", ageRange: "2-4",
    description: "Sail away in this truck! A tall mast is mounted in the truck bed with a big rectangular flag flying from the top. The flag shows a big skull and crossbones — the famous Jolly Roger! Simple shapes make it fun for the youngest kids.",
    altText: "Black and white coloring page of a simple monster truck with a mast and Jolly Roger skull flag in the truck bed",
    prompt: "A simple cartoon monster truck with a tall vertical mast pole mounted in the center of the truck bed. A large rectangular flag flies from the top of the mast with a simple skull and crossbones symbol on it. The flag waves slightly. Side view. Extra thick simple outlines. Big round tires. Easy to color shapes."
  },
  {
    slug: "plank-walker-truck",
    title: "Plank Walker Truck",
    difficulty: "hard", ageRange: "6-8",
    description: "Walk the plank! This truck has a long wooden plank extending forward from the front bumper, just like on a pirate ship. The cab windows are round porthole shapes with bolted frames, and the wooden plank has visible plank boards and a railing.",
    altText: "Black and white coloring page of a monster truck with a wooden plank extending from the front bumper and porthole shaped cab windows",
    prompt: "A monster truck with a long wooden plank extending forward from the front bumper like a ship's plank. The plank has horizontal board lines and a simple rope railing on one side. The cab windows are round porthole shapes with thick bolted circular frames instead of normal windows. Detailed wood grain on the plank. Side view. Huge tires."
  },
  {
    slug: "kraken-anchor-truck",
    title: "Kraken Anchor Truck",
    difficulty: "hard", ageRange: "6-8",
    description: "This truck is an absolute beast! A massive ship anchor is mounted on the front as a battering ram, chain and all. The rear has two tentacle-shaped tow hooks curling outward. Built to drag anything to the bottom of the ocean!",
    altText: "Black and white coloring page of a monster truck with a massive ship anchor on the front and tentacle shaped tow hooks on the rear",
    prompt: "A monster truck with a massive ship anchor mounted on the front as a battering ram. The anchor has a thick shank, a ring at the top, and two flukes at the bottom. A heavy chain connects from the anchor to the truck body. The rear bumper has two thick curved tentacle-shaped tow hooks curling outward with suction cup details. Side view. Massive tires."
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
  const catId = "cat-pirate-monster-truck-coloring-pages";
  if (!cats.find(c => c.id === catId)) {
    cats.push({ id: catId, slug: "pirate-monster-truck-coloring-pages", name: "Pirate Monster Truck Coloring Pages",
      description: "Free printable pirate monster truck coloring pages for kids ages 2-8. Cannon exhausts, skull grilles, hook bumpers, treasure chest beds — every truck is built like a pirate ship on wheels. Bold outlines, ready to print!",
      type: "theme" });
    fs.writeFileSync(catsPath, JSON.stringify(cats, null, 2));
    console.log("Created Pirate category");
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
  console.log(`\n✅ Pirate collection complete: ${PAGES.length} pages`);
}
main().catch(e => { console.error(e); process.exit(1); });
