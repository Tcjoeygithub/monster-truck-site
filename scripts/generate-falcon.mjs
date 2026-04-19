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
    slug: "falcon-beak-visor-truck",
    title: "Falcon Beak Visor Truck",
    difficulty: "medium", ageRange: "4-6",
    description: "This truck has a wild windshield visor shaped just like a curved falcon beak pointing straight down! The beak visor wraps over the top of the windshield, giving the truck a fierce bird-of-prey look.",
    altText: "Black and white coloring page of a monster truck with a curved falcon beak shaped windshield visor",
    prompt: "A monster truck with a curved beak-shaped visor over the windshield. The visor sticks out at the top of the windshield and curves downward at the tip like a falcon beak. Wide body monster truck. Side view. Four huge knobby tires."
  },
  {
    slug: "dive-falcon-stance-truck",
    title: "Dive Falcon Stance Truck",
    difficulty: "hard", ageRange: "6-8",
    description: "Built for speed! This truck has an extremely aerodynamic wedge shape angled steeply nose-down like a falcon mid-dive. Every surface sweeps back sharply — hood, roof, fenders — all pointing forward at attack angle.",
    altText: "Black and white coloring page of a monster truck with a steep nose-down wedge shape like a diving falcon",
    prompt: "A monster truck with an extremely aggressive wedge body shape, angled steeply nose-down with the front much lower than the rear. The hood slopes down sharply. The roofline sweeps back at a dramatic angle. Every panel swept back for aerodynamics. Side view. Large tires."
  },
  {
    slug: "baby-falcon-truck",
    title: "Baby Falcon Truck",
    difficulty: "easy", ageRange: "2-4",
    description: "The cutest truck around! A little beak shape on the front bumper, tiny wing-shaped side mirrors, and two big round friendly eyes as headlights. So easy and fun to color!",
    altText: "Black and white coloring page of a simple cute monster truck with a small beak on the front and tiny wing mirrors",
    prompt: "A very simple cartoon monster truck with a small cute beak shape on the center of the front bumper pointing forward. Tiny wing shapes as side mirrors. Two big round friendly eyes as headlights. Side view. Only 5 to 6 large simple shapes. Extra thick outlines. Big round tires."
  },
  {
    slug: "peregrine-speed-truck",
    title: "Peregrine Speed Truck",
    difficulty: "medium", ageRange: "4-6",
    description: "This ultra-sleek truck is built purely for speed! An extremely low profile body, swept-back windshield, swept-back fenders, and a long pointed hood. Everything flows backward like a peregrine falcon at full speed.",
    altText: "Black and white coloring page of an ultra sleek low profile monster truck with swept back lines",
    prompt: "A monster truck with an ultra low and sleek body profile. Long pointed swept-back hood. Windshield angled back sharply. Fenders swept rearward. Everything about the design flows backward for speed. Side view. Large tires contrasting with the sleek low body."
  },
  {
    slug: "falcon-talon-tow-hooks-truck",
    title: "Falcon Talon Tow Hooks Truck",
    difficulty: "hard", ageRange: "6-8",
    description: "The rear of this truck is wild! Instead of regular tow hooks, massive falcon talons grip backward from the rear bumper — curved claws reaching out like a falcon snatching prey from the air.",
    altText: "Black and white coloring page of a monster truck with falcon talon shaped tow hooks on the rear bumper",
    prompt: "A monster truck with two large curved falcon talon shapes on the rear bumper, pointing backward and curving downward like gripping claws. Each talon has three curved claw points. The rear bumper is thick and heavy. Side view showing rear clearly. Big tires."
  },
  {
    slug: "flight-feather-exhaust-truck",
    title: "Flight Feather Exhaust Truck",
    difficulty: "medium", ageRange: "4-6",
    description: "The exhaust pipes on this truck are shaped like long flight feathers fanned out! Several individual feather-shaped pipes stand up from the hood, each with a pointed tip and feather detail lines etched in.",
    altText: "Black and white coloring page of a monster truck with exhaust pipes shaped like long fanned flight feathers",
    prompt: "A monster truck with multiple exhaust pipes on the hood shaped like long flight feathers fanned out in a row. Each pipe is elongated and pointed at the tip with parallel lines etched into the surface like feather barbs. The feather pipes fan slightly outward. Side view. Large tires."
  },
  {
    slug: "falcon-hood-ornament-truck",
    title: "Falcon Hood Ornament Truck",
    difficulty: "easy", ageRange: "2-4",
    description: "A simple tough truck with a falcon bird sculpture perched right on the center of the hood, wings folded close to its body, looking straight ahead. Classic and cool!",
    altText: "Black and white coloring page of a simple monster truck with a falcon sculpture hood ornament wings folded",
    prompt: "A simple monster truck with a small falcon bird sculpture as a hood ornament sitting on the center of the hood. The falcon has its wings folded neatly against its body and faces forward. Simple blocky truck body. Side view. Extra thick outlines. Four big tires."
  },
  {
    slug: "hunting-eye-headlight-truck",
    title: "Hunting Eye Headlight Truck",
    difficulty: "medium", ageRange: "4-6",
    description: "One single massive round headlight sits dead center in the front of this truck, just like a falcon's large focused hunting eye. The headlight has a detailed iris ring and is surrounded by a heavy circular housing.",
    altText: "Black and white coloring page of a monster truck with one large round central headlight like a falcon hunting eye",
    prompt: "A monster truck with a single very large round headlight centered on the front grille, with a detailed circular iris pattern inside it. The headlight is surrounded by a heavy round housing that stands out prominently. The front end is otherwise simple and flat. Side view. Big tires."
  },
  {
    slug: "falcon-nest-cargo-truck",
    title: "Falcon Nest Cargo Truck",
    difficulty: "hard", ageRange: "6-8",
    description: "The truck bed is an incredible woven falcon nest with oval eggs nestled inside! A protective cage of thick bars arches over the entire bed to keep the eggs safe. Intricate and fascinating to color!",
    altText: "Black and white coloring page of a monster truck with a woven nest truck bed full of eggs under a protective cage",
    prompt: "A monster truck with an open truck bed redesigned as a large woven nest made of interlaced sticks and branches. Several oval eggs sit inside the nest. A heavy protective cage of thick bars arches over the entire truck bed. Side view showing nest and cage clearly. Large tires."
  },
  {
    slug: "talons-out-bumper-truck",
    title: "Talons Out Bumper Truck",
    difficulty: "easy", ageRange: "2-4",
    description: "Ready to grab! This simple truck has two big spread talon shapes on the front bumper, claws reaching forward like a falcon striking. Bold and easy to color!",
    altText: "Black and white coloring page of a simple monster truck with two spread falcon talon shapes on the front bumper",
    prompt: "A simple monster truck with two large spread falcon talon shapes on the front bumper, each with three curved claws pointing forward. The talons are bold and simple. Basic blocky truck body. Side view. Extra thick outlines. Four big tires."
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
  const catId = "cat-falcon-monster-truck-coloring-pages";
  if (!cats.find(c => c.id === catId)) {
    cats.push({ id: catId, slug: "falcon-monster-truck-coloring-pages", name: "Falcon Monster Truck Coloring Pages",
      description: "Free printable falcon monster truck coloring pages for kids ages 2-8. Beak visors, talon tow hooks, feather exhausts, falcon hood ornaments — every truck is built like a bird of prey. Bold outlines, ready to print!",
      type: "theme" });
    fs.writeFileSync(catsPath, JSON.stringify(cats, null, 2));
    console.log("Created Falcon category");
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
  console.log(`\n✅ Falcon collection complete: ${PAGES.length} pages`);
}
main().catch(e => { console.error(e); process.exit(1); });
