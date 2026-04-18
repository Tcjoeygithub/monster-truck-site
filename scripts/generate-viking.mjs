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
    slug: "viking-horned-helmet-cab-truck",
    title: "Viking Horned Helmet Cab Truck",
    difficulty: "medium", ageRange: "4-6",
    description: "This tough truck has a cab shaped just like a viking helmet! Two huge curved horns sweep out from each side of the roof, curling upward. The cab body has a ridged dome shape like a real battle helmet.",
    altText: "Black and white coloring page of a monster truck with a cab shaped like a viking helmet with two large curved horns on the roof",
    prompt: "A monster truck where the cab is shaped like a viking helmet. Two large curved horns extend outward and upward from each side of the cab roof. The roof itself has a domed ridged helmet shape. Side view. Four huge knobby monster truck tires."
  },
  {
    slug: "battle-axe-bumper-truck",
    title: "Battle Axe Bumper Truck",
    difficulty: "hard", ageRange: "6-8",
    description: "The front bumper of this monster truck is a massive double-headed viking battle axe blade! Both axe heads sweep out wide from the center, with sharp curved blades on the top and bottom edges. Pure viking power!",
    altText: "Black and white coloring page of a monster truck with a front bumper shaped like a double-headed viking battle axe",
    prompt: "A monster truck with a front bumper shaped exactly like a double-headed viking battle axe blade. The axe head extends wide on both sides of the front of the truck, with large curved blade shapes sweeping up and down from a thick center bar. Side view. Massive knobby tires."
  },
  {
    slug: "baby-viking-truck",
    title: "Baby Viking Truck",
    difficulty: "easy", ageRange: "2-4",
    description: "The cutest little viking truck around! It has tiny little horn shapes on the roof, a round shield on the door, and big friendly eyes as headlights. Simple and perfect for little kids to color!",
    altText: "Black and white coloring page of a simple cute monster truck with tiny horns on the roof, a round shield on the door, and big friendly eyes",
    prompt: "A very simple cute cartoon monster truck with two small stubby horn shapes on the cab roof. A round shield shape on the side door with a simple cross pattern inside. Big round friendly eyes as headlights. Side view. Only 5 to 6 large shapes. Extra thick outlines. Suitable for toddlers."
  },
  {
    slug: "viking-shield-door-truck",
    title: "Viking Shield Door Truck",
    difficulty: "medium", ageRange: "4-6",
    description: "This truck's doors are actual viking shields! Each door is a round shield shape with a cross pattern dividing it into four sections and a raised boss in the very center. Decorated and ready for battle!",
    altText: "Black and white coloring page of a monster truck where each door is shaped like a round viking shield with a cross pattern and center boss",
    prompt: "A monster truck where each side door is shaped like a large round viking shield. Each shield door has a cross pattern dividing it into four sections and a round raised boss in the center. The doors are perfectly circular shapes set into the truck body. Side view. Four big monster truck tires."
  },
  {
    slug: "dragon-longship-hood-truck",
    title: "Dragon Longship Hood Truck",
    difficulty: "hard", ageRange: "6-8",
    description: "The hood of this incredible truck is carved into a viking longship dragon prow! The front curves up dramatically with an open-mouthed dragon head at the tip, just like the carved wooden prow of a real viking ship.",
    altText: "Black and white coloring page of a monster truck with a hood shaped like the carved dragon prow of a viking longship",
    prompt: "A monster truck where the hood is sculpted into the shape of a viking longship dragon prow. The front of the hood curves dramatically upward ending in a dragon head with an open mouth and carved scales along the top edge. Side view. The dragon head points forward and upward. Four massive knobby tires."
  },
  {
    slug: "viking-hammer-exhaust-truck",
    title: "Viking Hammer Exhaust Truck",
    difficulty: "medium", ageRange: "4-6",
    description: "Thor would approve! This truck has exhaust pipes shaped like Mjolnir — Thor's hammer. The short thick hammer head sits on top of a thick handle pipe mounted behind the cab. Smoke coming out the top!",
    altText: "Black and white coloring page of a monster truck with exhaust pipes shaped like Thor's hammer Mjolnir mounted behind the cab",
    prompt: "A monster truck with exhaust pipes behind the cab shaped exactly like Thor's hammer Mjolnir. The hammer has a short wide rectangular head on top of a thick handle pipe. Two of these hammer-shaped exhausts are mounted side by side behind the cab. Side view. Big monster truck tires."
  },
  {
    slug: "rune-wheel-truck",
    title: "Rune Wheel Truck",
    difficulty: "easy", ageRange: "2-4",
    description: "This simple truck has super cool wheel hub caps! Each one has a rune cross shape — a bold plus sign with a circle around it. There are also small simple horn shapes on the hood. Great for beginners!",
    altText: "Black and white coloring page of a simple monster truck with wheel hub caps featuring a cross rune shape and small horns on the hood",
    prompt: "A simple monster truck with four large wheels. Each wheel hub cap has a bold cross shape inside a circle, like a simple rune symbol. Two small stubby horn shapes sit on the front of the hood. Side view. Simple clean shapes with thick outlines. Easy for young children to color."
  },
  {
    slug: "viking-oar-spoiler-truck",
    title: "Viking Oar Spoiler Truck",
    difficulty: "medium", ageRange: "4-6",
    description: "Check out the rear spoiler on this beast! Two full-size viking oars are mounted crossing each other in an X shape behind the cab, forming a unique spoiler. The flat paddle blades angle outward at the top.",
    altText: "Black and white coloring page of a monster truck with a rear spoiler made of two crossed viking oars",
    prompt: "A monster truck with a rear spoiler made of two viking oars crossed in an X shape. Each oar has a long handle and a flat paddle blade at the end. The oars are mounted on the back of the cab so the blades angle outward at the top. Side view. Four huge knobby tires."
  },
  {
    slug: "chainmail-cab-truck",
    title: "Chainmail Cab Truck",
    difficulty: "hard", ageRange: "6-8",
    description: "This truck's cab is wrapped in chainmail! The entire cab surface has a woven ring mesh pattern built into the metalwork, with visible iron rivets along the edges. It looks like a warrior's armor on wheels!",
    altText: "Black and white coloring page of a monster truck with a cab covered in a chainmail mesh pattern with iron rivets along the edges",
    prompt: "A monster truck where the entire cab exterior has a chainmail mesh pattern built into the metal surface. The chainmail is a repeating interlocked ring pattern covering the doors and roof panels. Large iron rivets are visible along the edges and corners of the cab. Side view. Four massive tires."
  },
  {
    slug: "viking-longship-truck",
    title: "Viking Longship Truck",
    difficulty: "easy", ageRange: "4-6",
    description: "This truck carries a viking longship as its truck bed! The bed is shaped like a boat hull with a pointed front and curved wooden plank sides. Simple and fun to color for younger kids.",
    altText: "Black and white coloring page of a monster truck where the truck bed is shaped like a viking longship boat hull",
    prompt: "A monster truck where the truck bed is shaped like a viking longship boat hull. The bed has a pointed bow at the front, curved wooden plank sides, and a flat deck on top. The hull curves upward at each end. Side view. Simple clean shapes with thick outlines. Four big tires."
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
  const catId = "cat-viking-monster-truck-coloring-pages";
  if (!cats.find(c => c.id === catId)) {
    cats.push({ id: catId, slug: "viking-monster-truck-coloring-pages", name: "Viking Monster Truck Coloring Pages",
      description: "Free printable viking monster truck coloring pages for kids ages 2-8. Horned helmet cabs, battle axe bumpers, dragon longship hoods, chainmail armor — every truck is built for viking glory. Bold outlines, ready to print!",
      type: "theme" });
    fs.writeFileSync(catsPath, JSON.stringify(cats, null, 2));
    console.log("Created Viking category");
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
  console.log(`\n✅ Viking collection complete: ${PAGES.length} pages`);
}
main().catch(e => { console.error(e); process.exit(1); });
