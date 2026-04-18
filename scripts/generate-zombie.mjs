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
    slug: "zombie-hand-hood-truck",
    title: "Zombie Hand Hood Truck",
    difficulty: "medium", ageRange: "4-6",
    description: "A large cartoon zombie hand reaches up right out of the hood of this monster truck, fingers spread wide! The hand is part of the truck's body design, rising from the center of the hood like it's bursting through. Silly and spooky fun!",
    altText: "Black and white coloring page of a monster truck with a large cartoon zombie hand reaching up from the hood",
    prompt: "A monster truck with a large cartoon zombie hand built into the hood, fingers spread wide and reaching upward from the center of the hood as if bursting through. The hand is a structural design feature of the truck body. Cartoon style, kid-friendly, not scary. Side view. Four huge knobby tires."
  },
  {
    slug: "zombie-jaw-grille-truck",
    title: "Zombie Jaw Grille Truck",
    difficulty: "medium", ageRange: "4-6",
    description: "This truck's front grille is shaped like a zombie's open mouth! Crooked cartoon teeth line the top, and a big blocky jaw forms the bottom bumper. It looks like the truck is ready to take a big chompy bite. Perfectly silly zombie style!",
    altText: "Black and white coloring page of a monster truck with a front grille shaped like an open zombie mouth with crooked teeth",
    prompt: "A monster truck where the entire front grille is shaped like a wide open zombie mouth. Crooked uneven cartoon teeth line the top of the grille opening. A thick blocky jaw shape forms the lower bumper. Silly cartoon zombie expression, kid-friendly. Side view. Four oversized tires."
  },
  {
    slug: "baby-zombie-truck",
    title: "Baby Zombie Truck",
    difficulty: "easy", ageRange: "2-4",
    description: "This cute little zombie truck is friendly and silly! It has one big eye and one smaller eye on the cab, a crooked grin bumper full of goofy teeth, and a bolt sticking out of each fender like a classic cartoon monster. Easy and adorable to color!",
    altText: "Black and white coloring page of a simple cute monster truck with mismatched zombie eyes, crooked grin bumper, and bolts on fenders",
    prompt: "A very simple cute cartoon monster truck with one large round eye and one smaller round eye on the front cab giving it a silly zombie look. A big crooked grin bumper with uneven cartoon teeth. A round bolt sticking out of each front fender like a cartoon Frankenstein neck bolt. Side view. Only 5 to 6 large simple shapes. Extra thick outlines."
  },
  {
    slug: "brain-dome-cab-truck",
    title: "Brain Dome Cab Truck",
    difficulty: "hard", ageRange: "6-8",
    description: "The cab roof of this monster truck is shaped like a giant cartoon brain! Wrinkles and fold lines texture the dome from front to back. It's a wild design that makes the truck look like it's thinking really hard about crushing everything in its path.",
    altText: "Black and white coloring page of a monster truck with a cab roof shaped like a giant cartoon brain with wrinkle textures",
    prompt: "A monster truck where the cab roof is shaped like a large cartoon brain dome. The top of the cab has deep wrinkle lines and fold textures flowing front to back like a brain surface. The rest of the truck body is a standard powerful monster truck. Side view. Four massive tires."
  },
  {
    slug: "tombstone-spoiler-truck",
    title: "Tombstone Spoiler Truck",
    difficulty: "medium", ageRange: "4-6",
    description: "Check out that spoiler! The rear wing on this monster truck is shaped like a classic rounded tombstone or gravestone. It stands tall above the truck bed, ready to haunt the race track. Spooky and cool at the same time!",
    altText: "Black and white coloring page of a monster truck with a rear spoiler shaped like a rounded tombstone gravestone",
    prompt: "A monster truck with a large rear spoiler shaped exactly like a classic rounded-top tombstone or gravestone. The tombstone spoiler stands tall on the back of the truck above the truck bed. Simple cartoon style. Side view. Four huge knobby tires."
  },
  {
    slug: "zombie-arm-exhaust-truck",
    title: "Zombie Arm Exhaust Truck",
    difficulty: "medium", ageRange: "4-6",
    description: "This truck has exhaust pipes shaped like zombie arms reaching up into the air! Two cartoon zombie arms rise from behind the cab, fingers outstretched, like they're trying to grab the sky. It's goofy and great!",
    altText: "Black and white coloring page of a monster truck with exhaust pipes shaped like zombie arms reaching upward behind the cab",
    prompt: "A monster truck with two exhaust pipes shaped like cartoon zombie arms, one on each side behind the cab. Each arm reaches upward with a hand and outstretched fingers at the top. Cartoon style, silly and kid-friendly. Side view. Big knobby tires."
  },
  {
    slug: "bone-frame-truck",
    title: "Bone Frame Truck",
    difficulty: "hard", ageRange: "6-8",
    description: "Look underneath this monster truck — the whole chassis and frame is made of bones! Instead of metal rails and crossbars, you can see cartoon bone shapes forming the entire undercarriage structure. The ultimate skeleton truck design!",
    altText: "Black and white coloring page of a monster truck with a visible chassis frame made entirely of cartoon bone shapes",
    prompt: "A monster truck with a clearly visible undercarriage where the entire chassis frame and structural rails are made of cartoon bone shapes instead of metal. Long bones form the side rails, shorter bones form the crossmembers. The cab and body sit on top of the bone frame. Side view showing the full chassis detail. Four massive tires."
  },
  {
    slug: "frankenstein-bolt-truck",
    title: "Frankenstein Bolt Truck",
    difficulty: "easy", ageRange: "2-4",
    description: "It's a Frankenstein monster truck! This simple truck has a flat-top squared-off cab just like Frankenstein's head, and two giant round bolts sticking straight out from each fender. Easy to color and instantly recognizable!",
    altText: "Black and white coloring page of a simple monster truck with a flat-top squared cab like Frankenstein's head and large bolts on each fender",
    prompt: "A very simple cartoon monster truck with a flat-top squared-off rectangular cab shaped like Frankenstein's head. Two large round-headed bolts sticking straight out horizontally from each front fender, one bolt per side. Simple thick outlines. Side view. Big round tires. Easy for young children to color."
  },
  {
    slug: "coffin-truck-bed",
    title: "Coffin Truck Bed",
    difficulty: "hard", ageRange: "6-8",
    description: "The truck bed on this monster truck is shaped like an open coffin! The six-sided coffin shape has a hinged lid leaning to one side, open and ready. It's spooky in a fun cartoon way and has tons of great detail lines to color.",
    altText: "Black and white coloring page of a monster truck with a truck bed shaped like an open coffin casket with hinged lid",
    prompt: "A monster truck where the truck bed is shaped like an open coffin or casket. The classic six-sided coffin shape is built into the truck bed area. A hinged coffin lid leans to one side, open. Cartoon style, not scary. Side view. Four huge knobby tires."
  },
  {
    slug: "eyeball-wheel-truck",
    title: "Eyeball Wheel Truck",
    difficulty: "easy", ageRange: "2-4",
    description: "Every single wheel hub on this monster truck is shaped like a giant eyeball! Big round irises with pupils stare out from each tire center. The truck body is simple and bold, making those eyeball wheels really pop when you color them!",
    altText: "Black and white coloring page of a monster truck where each wheel hub is shaped like a big round eyeball with a pupil",
    prompt: "A simple cartoon monster truck where each of the four wheel hubs is shaped like a large round eyeball with a clearly drawn iris circle and pupil dot in the center. The truck body is simple and bold. Side view. The eyeball wheel hubs are the main design feature. Extra thick outlines for easy coloring."
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
  const catId = "cat-zombie-monster-truck-coloring-pages";
  if (!cats.find(c => c.id === catId)) {
    cats.push({ id: catId, slug: "zombie-monster-truck-coloring-pages", name: "Zombie Monster Truck Coloring Pages",
      description: "Free printable zombie monster truck coloring pages for kids ages 2-8. Zombie hand hoods, jaw grilles, brain dome cabs, coffin truck beds, eyeball wheels — every truck has cartoon zombie features built right into the body. Bold outlines, ready to print!",
      type: "theme" });
    fs.writeFileSync(catsPath, JSON.stringify(cats, null, 2));
    console.log("Created Zombie category");
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
  console.log(`\n✅ Zombie collection complete: ${PAGES.length} pages`);
}
main().catch(e => { console.error(e); process.exit(1); });
