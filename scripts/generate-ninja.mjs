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
    slug: "throwing-star-wheels-truck",
    title: "Throwing Star Wheels Truck",
    difficulty: "hard", ageRange: "6-8",
    description: "Check out these wild wheels! Every single hub cap is shaped exactly like a ninja throwing star (shuriken) with sharp pointed blades radiating outward. This truck spins its deadly star wheels across every track.",
    altText: "Black and white coloring page of a monster truck with shuriken throwing star shaped wheel hub caps",
    prompt: "A monster truck where each of the four wheel hub caps is shaped exactly like a ninja throwing star (shuriken) with eight sharp pointed blades radiating outward from the center. The pointed blades are clearly visible around each wheel hub. Wide aggressive monster truck body. Side view. Four huge knobby tires with throwing star hubs."
  },
  {
    slug: "katana-exhaust-truck",
    title: "Katana Exhaust Truck",
    difficulty: "medium", ageRange: "4-6",
    description: "This truck's exhaust pipes are shaped like katana sword blades! Two curved katana shapes extend from behind the cab, curving upward with the distinctive long blade shape of a Japanese sword.",
    altText: "Black and white coloring page of a monster truck with two katana sword shaped exhaust pipes behind the cab",
    prompt: "A monster truck with two exhaust pipes behind the cab that are shaped like curved katana sword blades. Each exhaust pipe has the distinctive long curved shape of a katana blade extending upward and back from the cab. The blade shapes are clearly detailed with the curved edge of a katana. Side view. Four large tires."
  },
  {
    slug: "baby-ninja-truck",
    title: "Baby Ninja Truck",
    difficulty: "easy", ageRange: "2-4",
    description: "The cutest little ninja truck around! This simple truck has a ninja mask shape covering the headlight area so only two eyes are showing, and a tiny sword shape sits on the roof. Simple and adorable!",
    altText: "Black and white coloring page of a simple cute monster truck with a ninja mask over the headlights and a small sword on the roof",
    prompt: "A very simple cute cartoon monster truck with a ninja mask shape built into the front of the truck covering the headlight area, with only two small round eye holes visible. A small simple sword shape sits flat on the cab roof. Very simple chunky shapes. Side view. Only 5 to 6 large shapes. Extra thick outlines. Four big round tires."
  },
  {
    slug: "ninja-mask-grille-truck",
    title: "Ninja Mask Grille Truck",
    difficulty: "medium", ageRange: "4-6",
    description: "This truck's entire front end is designed as a ninja face! The grille and headlights form a ninja mask with narrow horizontal eye slit openings — the whole front looks like a ninja staring you down.",
    altText: "Black and white coloring page of a monster truck with the front grille and headlights designed as a ninja face mask with narrow eye slits",
    prompt: "A monster truck where the entire front grille and headlight area is designed to look like a ninja face mask. Two narrow horizontal eye slit openings serve as the headlights. The grille below forms the covered lower face of the ninja mask. The mask shape is integrated into the truck body design. Front three-quarter view. Four large tires."
  },
  {
    slug: "smoke-bomb-exhaust-truck",
    title: "Smoke Bomb Exhaust Truck",
    difficulty: "medium", ageRange: "4-6",
    description: "This sneaky truck has exhaust pipes shaped like round ninja smoke bombs! The stealthy low sleek profile makes it look like it could vanish at any moment, with round smoke bomb shapes on top of the exhaust stacks.",
    altText: "Black and white coloring page of a low sleek monster truck with round smoke bomb shaped exhaust pipe tops",
    prompt: "A monster truck with a very low sleek stealthy body profile. The exhaust pipes have round sphere shapes at the top like ninja smoke bombs. The truck sits very low to the ground with a flat aggressive silhouette. Two exhaust pipes with round smoke bomb tops behind the cab. Side view. Four large tires."
  },
  {
    slug: "nunchuck-roll-bar-truck",
    title: "Nunchuck Roll Bar Truck",
    difficulty: "hard", ageRange: "6-8",
    description: "The roll cage on this truck is connected by chain links like nunchucks! Each roll bar section is joined by a thick chain link joint like nunchaku handles. A ninja headband is tied around the antenna.",
    altText: "Black and white coloring page of a monster truck with a roll cage connected by chain links like nunchucks and a headband on the antenna",
    prompt: "A monster truck with a roll cage where each bar section is connected at the joints by chain link sections like nunchaku (nunchucks). The roll cage bars are clearly connected by thick oval chain links at each joint. A ninja headband with tied ends is wrapped around the antenna on the cab roof. Side view. Four large tires."
  },
  {
    slug: "hidden-blade-door-truck",
    title: "Hidden Blade Door Truck",
    difficulty: "hard", ageRange: "6-8",
    description: "This truck has hidden blades built right into the doors! Retractable blade shapes slide out from the bottom edge of each door like hidden ninja weapons. The blades point outward at an angle.",
    altText: "Black and white coloring page of a monster truck with blade shapes sliding out from the bottom edges of the doors",
    prompt: "A monster truck where each door has a long thin blade shape extending outward from the bottom edge, like a retractable hidden ninja blade sliding out. The blades point downward and outward at an angle from each door. The blade shapes are clearly defined against the truck door panels. Side view. Four large tires."
  },
  {
    slug: "ninja-scroll-hood-truck",
    title: "Ninja Scroll Hood Truck",
    difficulty: "easy", ageRange: "2-4",
    description: "This truck carries a ninja scroll! A rolled-up scroll shape is mounted on top of the hood with the ends curled up. A simple headband shape wraps across the very front of the truck. Easy and fun!",
    altText: "Black and white coloring page of a simple monster truck with a rolled scroll on the hood and a headband shape across the front",
    prompt: "A simple cartoon monster truck with a rolled-up scroll shape mounted on top of the hood, with the two ends of the scroll curled upward. A simple headband shape with a tied bow wraps across the very front of the truck body. Simple chunky design. Side view. Extra thick outlines. Four big round tires."
  },
  {
    slug: "kunai-bumper-truck",
    title: "Kunai Bumper Truck",
    difficulty: "medium", ageRange: "4-6",
    description: "Three kunai knives point forward from this truck's front bumper like battering rams! The classic ring-topped kunai knife shapes are built right into the bumper, ready to charge.",
    altText: "Black and white coloring page of a monster truck with three kunai knife shapes pointing forward from the front bumper",
    prompt: "A monster truck with a front bumper that has three kunai knife shapes pointing straight forward, evenly spaced across the bumper. Each kunai has the classic pointed blade shape with a small ring at the base. The three kunai form battering ram points on the bumper. Side three-quarter front view. Four large tires."
  },
  {
    slug: "shadow-stealth-truck",
    title: "Shadow Stealth Truck",
    difficulty: "easy", ageRange: "4-6",
    description: "This truck is built to be invisible! Extra low and flat profile, a very pointed front end, and narrow squinting headlight slits like a ninja's eyes. This is the sneakiest truck around.",
    altText: "Black and white coloring page of an extra low flat monster truck with a pointed front and narrow squinting headlight slits",
    prompt: "A monster truck with an extremely low flat body profile that looks very sneaky and stealthy. The front end comes to a sharp pointed wedge shape. The headlights are very narrow horizontal slits like squinting ninja eyes. The overall silhouette is very low and flat compared to a normal monster truck. Side view. Four large tires visible beneath the low body."
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
  const catId = "cat-ninja-monster-truck-coloring-pages";
  if (!cats.find(c => c.id === catId)) {
    cats.push({ id: catId, slug: "ninja-monster-truck-coloring-pages", name: "Ninja Monster Truck Coloring Pages",
      description: "Free printable ninja monster truck coloring pages for kids ages 2-8. Shuriken wheels, katana exhausts, kunai bumpers, ninja mask grilles — every truck is built with ninja weapons and stealth features. Bold outlines, ready to print!",
      type: "theme" });
    fs.writeFileSync(catsPath, JSON.stringify(cats, null, 2));
    console.log("Created Ninja category");
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
  console.log(`\n✅ Ninja collection complete: ${PAGES.length} pages`);
}
main().catch(e => { console.error(e); process.exit(1); });
