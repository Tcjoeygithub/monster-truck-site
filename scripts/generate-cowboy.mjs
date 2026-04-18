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
    slug: "cowboy-hat-roof-truck",
    title: "Cowboy Hat Roof Truck",
    difficulty: "medium", ageRange: "4-6",
    description: "Yeehaw! This wild monster truck has a giant cowboy hat built right into the cab roof — the wide brim flares out over the sides like a real ten-gallon hat. It's the most stylish truck in the West!",
    altText: "Black and white coloring page of a monster truck with a large cowboy hat shape built into the cab roof",
    prompt: "A monster truck where the cab roof is shaped exactly like a large cowboy hat with a wide brim that extends out over the sides of the cab. The hat crown rises up tall above the windshield. The rest of the truck has a sturdy western style body. Side view. Four huge knobby tires."
  },
  {
    slug: "lasso-bumper-truck",
    title: "Lasso Bumper Truck",
    difficulty: "medium", ageRange: "4-6",
    description: "This truck ropes in the competition! Its front bumper is shaped like a giant coiled lasso with a big loop at the end. The rope detail wraps around the full bumper bar in classic cowboy style.",
    altText: "Black and white coloring page of a monster truck with a front bumper shaped like a coiled lasso rope loop",
    prompt: "A monster truck with a front bumper that is shaped like a large coiled lasso rope. The rope coils in a wide loop at the center of the bumper and the end of the rope forms a hanging loop on one side. Rope texture detail along the bumper. Side view. Four massive tires."
  },
  {
    slug: "baby-cowboy-truck",
    title: "Baby Cowboy Truck",
    difficulty: "easy", ageRange: "2-4",
    description: "Howdy, little partner! This cute little monster truck has a tiny cowboy hat on top of the cab, a big friendly sheriff star on the door, and round happy headlight eyes. The easiest, friendliest cowboy truck around!",
    altText: "Black and white coloring page of a simple cute monster truck with a small cowboy hat on the roof and a sheriff star on the door",
    prompt: "A very simple cute cartoon monster truck with a small cowboy hat on top of the cab roof. A large five-pointed sheriff star badge shape on the truck door panel. Big round friendly eyes as headlights. Side view. Only 5 to 6 large simple shapes. Extra thick outlines for young children."
  },
  {
    slug: "bull-horn-hood-truck",
    title: "Bull Horn Hood Truck",
    difficulty: "hard", ageRange: "6-8",
    description: "Everything is bigger in Texas! This monster truck has a massive set of Texas longhorn steer horns mounted across the front of the hood, spreading wide beyond the fenders. Pure western power!",
    altText: "Black and white coloring page of a monster truck with huge Texas longhorn steer horns mounted across the front hood",
    prompt: "A monster truck with a massive set of Texas longhorn steer horns mounted horizontally across the front of the hood. The horns are very long, curving slightly upward, and extend far wider than the truck body on both sides. The horns are mounted on a sturdy bracket on the hood. Side view. Four enormous tires."
  },
  {
    slug: "revolver-exhaust-truck",
    title: "Revolver Exhaust Truck",
    difficulty: "hard", ageRange: "6-8",
    description: "Firing on all cylinders! This outlaw truck has two exhaust pipes shaped like old western revolver barrels, pointing straight backward out of the engine bay. The cylinder shapes are detailed and dramatic.",
    altText: "Black and white coloring page of a monster truck with two exhaust pipes shaped like old western revolver barrels",
    prompt: "A monster truck with two large exhaust pipes shaped exactly like old western revolver barrels, rising up from the hood and pointing backward. Each pipe has the cylindrical barrel shape with the revolver cylinder drum detail visible near the base. Side view. Aggressive stance. Four huge tires."
  },
  {
    slug: "horseshoe-wheels-truck",
    title: "Horseshoe Wheels Truck",
    difficulty: "easy", ageRange: "2-4",
    description: "Lucky as can be! Every wheel hub on this friendly monster truck is shaped like a horseshoe. The truck also has a simple cowboy hat on the roof. Simple, fun, and full of western good luck!",
    altText: "Black and white coloring page of a simple monster truck with horseshoe shaped wheel hubs and a cowboy hat on the roof",
    prompt: "A simple cartoon monster truck where each of the four wheel hub caps is shaped like a horseshoe. A small cowboy hat sits on top of the cab roof. Simple friendly truck body. Side view. Thick bold outlines. Four large tires with horseshoe hubs clearly visible."
  },
  {
    slug: "saddle-cab-truck",
    title: "Saddle Cab Truck",
    difficulty: "medium", ageRange: "4-6",
    description: "Ride it like you own it! This wild truck has a full western saddle mounted on top of the cab roof — complete with stirrups hanging down the sides. The most rideable monster truck in the rodeo!",
    altText: "Black and white coloring page of a monster truck with a western saddle shape mounted on top of the cab roof",
    prompt: "A monster truck where a full western saddle is mounted on top of the cab roof. The saddle has a pommel at the front, a cantle at the back, and stirrups hanging down each side of the cab. The saddle detail includes fender flaps. Side view. Four big tires."
  },
  {
    slug: "sheriff-badge-grille-truck",
    title: "Sheriff Badge Grille Truck",
    difficulty: "medium", ageRange: "4-6",
    description: "The law has arrived! This truck's entire front grille is shaped like a giant sheriff's star badge — six points, bold lines, and full of authority. The most official monster truck in the county!",
    altText: "Black and white coloring page of a monster truck with the front grille shaped like a large sheriff star badge",
    prompt: "A monster truck where the entire front grille area is shaped like a large six-pointed sheriff star badge. The star points extend slightly beyond the truck body edges on each side. The star has a double ring border around a center circle, classic sheriff badge design. Side view. Four massive tires."
  },
  {
    slug: "wagon-wheel-truck",
    title: "Wagon Wheel Truck",
    difficulty: "easy", ageRange: "2-4",
    description: "Rolling into the sunset! This simple western monster truck has wheels that look like old wooden wagon wheels with big spokes. A classic western style truck that is easy and fun to color!",
    altText: "Black and white coloring page of a simple monster truck with old wooden wagon wheel spokes on each tire",
    prompt: "A simple cartoon monster truck where all four wheels look like old wooden wagon wheels with thick spokes radiating from a hub to the outer rim. The spokes are bold and clearly drawn. Simple friendly truck body. Side view. Extra thick outlines. Easy to color for young children."
  },
  {
    slug: "dynamite-bumper-truck",
    title: "Dynamite Bundle Bumper Truck",
    difficulty: "hard", ageRange: "6-8",
    description: "Watch out, partner! This wild outlaw truck has a bundle of dynamite sticks strapped to the front bumper with rope, and a long curling fuse hanging off the side. The most dangerous truck in the West!",
    altText: "Black and white coloring page of a monster truck with a bundle of dynamite sticks strapped to the front bumper with a fuse",
    prompt: "A monster truck with a bundle of thick cylindrical dynamite sticks strapped to the front bumper with rope. The bundle has five to six dynamite sticks tied together. A long curling fuse hangs off one side of the bundle. The rope wrapping is clearly detailed. Side view. Four huge tires. Outlaw western style."
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
  const catId = "cat-cowboy-monster-truck-coloring-pages";
  if (!cats.find(c => c.id === catId)) {
    cats.push({ id: catId, slug: "cowboy-monster-truck-coloring-pages", name: "Cowboy Monster Truck Coloring Pages",
      description: "Free printable cowboy monster truck coloring pages for kids ages 2-8. Cowboy hat roofs, lasso bumpers, bull horn hoods, sheriff badge grilles — every truck is built with wild west style. Bold outlines, ready to print!",
      type: "theme" });
    fs.writeFileSync(catsPath, JSON.stringify(cats, null, 2));
    console.log("Created Cowboy category");
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
  console.log(`\n✅ Cowboy collection complete: ${PAGES.length} pages`);
}
main().catch(e => { console.error(e); process.exit(1); });
