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
    slug: "phoenix-wing-fender-truck",
    title: "Phoenix Wing Fender Truck",
    difficulty: "hard", ageRange: "6-8",
    description: "These fenders are pure firebird! The rear fenders are shaped like swept-back phoenix wings with individual feather edges carved along every curve. When this truck rolls by, it looks like a bird in full flight.",
    altText: "Black and white coloring page of a monster truck with rear fenders shaped like swept-back phoenix wings with feather edges",
    prompt: "A monster truck with rear fenders sculpted into the shape of large swept-back phoenix wings. Each wing fender has rows of individual feather shapes carved along the trailing edge. The feathers are long and layered. Side view. Four huge knobby tires. Bold thick outlines."
  },
  {
    slug: "rising-phoenix-hood-truck",
    title: "Rising Phoenix Hood Truck",
    difficulty: "medium", ageRange: "4-6",
    description: "Right in the center of the hood stands a magnificent phoenix bird rising up with wings fully spread! The hood ornament is the star of the show — a firebird with wide open wings and a long tail stretching back.",
    altText: "Black and white coloring page of a monster truck with a rising phoenix bird hood ornament with spread wings",
    prompt: "A monster truck with a large phoenix bird sculpture mounted as a hood ornament on the center of the hood. The phoenix is rising upward with both wings spread wide and a long flowing tail streaming behind. The bird body is detailed with feathers. Side view. Four oversized tires."
  },
  {
    slug: "baby-phoenix-truck",
    title: "Baby Phoenix Truck",
    difficulty: "easy", ageRange: "2-4",
    description: "The cutest little firebird truck around! This adorable monster truck has two small flame-shaped tail feathers sticking up from the back, tiny cute wings on the sides of the cab, and big round friendly eyes on the front.",
    altText: "Black and white coloring page of a simple cute monster truck with small flame tail feathers and tiny wings on the sides",
    prompt: "A very simple cute cartoon monster truck with two small flame-shaped feather plumes on the back of the truck body. Tiny stubby wings on each side of the cab. Big round friendly eyes as headlights. Simple rounded body. Side view. Only 5 to 6 large shapes. Extra thick outlines for young kids."
  },
  {
    slug: "flame-tail-exhaust-truck",
    title: "Flame Tail Exhaust Truck",
    difficulty: "medium", ageRange: "4-6",
    description: "This truck's exhaust pipes fan out like a phoenix tail! Multiple pipes spread wide across the back of the truck, each one tipped with a flame-shaped end. From behind it looks just like a firebird spreading its tail.",
    altText: "Black and white coloring page of a monster truck with multiple exhaust pipes fanned out like phoenix tail feathers with flame tips",
    prompt: "A monster truck with five or six exhaust pipes mounted at the rear of the truck, fanned out in a wide arc like a phoenix tail. Each pipe end is shaped like an open flame tip. The pipes spread from a central point like tail feathers. Rear three-quarter view. Four big tires."
  },
  {
    slug: "phoenix-talon-bumper-truck",
    title: "Phoenix Talon Bumper Truck",
    difficulty: "medium", ageRange: "4-6",
    description: "Watch out — this truck has talons! The front bumper is shaped like two giant bird talons gripping the ground, with sharp curved claws dug in. It looks ready to grab and launch like a phoenix taking flight.",
    altText: "Black and white coloring page of a monster truck with a front bumper shaped like two bird talons with curved sharp claws",
    prompt: "A monster truck with the front bumper shaped like two large bird talons gripping forward. Each talon has three to four sharp curved claw tips pointing downward and forward. The talon shapes are thick and bold. Side view. Four massive knobby tires. Wide powerful body."
  },
  {
    slug: "firebird-cab-truck",
    title: "Firebird Cab Truck",
    difficulty: "hard", ageRange: "6-8",
    description: "The entire cab is built like a phoenix head! A curved beak visor arches over the windshield, the roofline sweeps back like a bird's crown of feathers, and the side windows sit inside the eye socket shapes. Pure firebird.",
    altText: "Black and white coloring page of a monster truck with the entire cab shaped like a phoenix head with beak visor and feathered crown",
    prompt: "A monster truck where the entire cab is sculpted to look like a phoenix bird head. A curved sharp beak shape forms a visor over the windshield. The roof sweeps back into a tall pointed feathered crown. The side windows are shaped like large bird eye sockets. Side view. Four huge tires."
  },
  {
    slug: "phoenix-egg-cargo-truck",
    title: "Phoenix Egg Cargo Truck",
    difficulty: "easy", ageRange: "2-4",
    description: "This special truck is on a very important delivery! The truck bed carries one large glowing egg surrounded by small simple flame shapes. The egg has lines on it that look like it is about to hatch something amazing!",
    altText: "Black and white coloring page of a simple monster truck with a large glowing egg in the bed surrounded by flame shapes",
    prompt: "A simple cartoon monster truck with a large oval egg sitting in the open truck bed. The egg has a few crack lines on it and radiating glow lines around it. Small simple flame shapes surround the base of the egg in the truck bed. Side view. Bold thick outlines. Big round tires."
  },
  {
    slug: "ash-rebirth-truck",
    title: "Ash Rebirth Truck",
    difficulty: "hard", ageRange: "6-8",
    description: "Born again from the ashes! This powerful truck is shown rising up from a pile of rubble beneath it, like a phoenix coming back to life. Large phoenix wings are unfolding from the sides of the truck body as it rises.",
    altText: "Black and white coloring page of a monster truck rising from rubble with large phoenix wings unfolding from the sides",
    prompt: "A monster truck that appears to be rising upward out of a pile of broken rubble and debris beneath it. Two large phoenix wings are unfolding and spreading outward from the sides of the truck body. The wings have detailed feather shapes. Side view. The truck body is powerful and wide. Big tires."
  },
  {
    slug: "phoenix-crest-roof-truck",
    title: "Phoenix Crest Roof Truck",
    difficulty: "medium", ageRange: "4-6",
    description: "This truck wears a crown! Mounted on top of the cab is a tall ornate phoenix crest shaped like a mohawk — a row of long upright feathers running front to back along the roofline. Regal and awesome.",
    altText: "Black and white coloring page of a monster truck with a tall ornate phoenix feather crest mounted on the cab roof like a mohawk",
    prompt: "A monster truck with a tall decorative phoenix crest mounted along the top of the cab roof like a mohawk fin. The crest is made of a row of long upright feather shapes arranged front to back. Each feather has detailed edges. Side view. Four large tires. Wide monster truck body."
  },
  {
    slug: "flame-feather-spoiler-truck",
    title: "Flame Feather Spoiler Truck",
    difficulty: "easy", ageRange: "4-6",
    description: "Check out that spoiler! The wide rear spoiler on this truck is divided into sections and each section is shaped like a flame-tipped feather. Simple, bold, and totally on fire — without any actual fire!",
    altText: "Black and white coloring page of a simple monster truck with a wide rear spoiler where each section looks like a flame-shaped feather",
    prompt: "A simple monster truck with a wide rear spoiler that spans the full width of the truck. The spoiler is divided into six sections and each section has the outline of a flame-shaped feather with a pointed tip and curved sides. Side view. Bold outlines. Four big round tires."
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
  const catId = "cat-phoenix-monster-truck-coloring-pages";
  if (!cats.find(c => c.id === catId)) {
    cats.push({ id: catId, slug: "phoenix-monster-truck-coloring-pages", name: "Phoenix Monster Truck Coloring Pages",
      description: "Free printable phoenix monster truck coloring pages for kids ages 2-8. Phoenix wing fenders, firebird cabs, talon bumpers, rising ash rebirths — every truck is built like a firebird. Bold outlines, ready to print!",
      type: "theme" });
    fs.writeFileSync(catsPath, JSON.stringify(cats, null, 2));
    console.log("Created Phoenix category");
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
  console.log(`\n✅ Phoenix collection complete: ${PAGES.length} pages`);
}
main().catch(e => { console.error(e); process.exit(1); });
