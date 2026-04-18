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
    slug: "panther-claw-bumper-truck",
    title: "Panther Claw Bumper Truck",
    difficulty: "medium", ageRange: "4-6",
    description: "Four sharp panther claws extend forward from the front bumper of this fierce monster truck! Each claw is thick and curved, built right into the steel bumper like the truck is ready to swipe.",
    altText: "Black and white coloring page of a monster truck with four sharp panther claws extending from the front bumper",
    prompt: "A monster truck with four large sharp curved panther claws extending forward from the front bumper. The claws are thick structural metal pieces built into the bumper, pointing forward like a cat swipe. Wide muscular body. Side view. Four huge knobby tires."
  },
  {
    slug: "sleek-panther-hood-truck",
    title: "Sleek Panther Hood Truck",
    difficulty: "hard", ageRange: "6-8",
    description: "This truck has a long low hood shaped exactly like a panther's skull — sleek and aggressive. The front grille is a snarling panther mouth and the headlights are narrow slitted cat eyes. Pure predator!",
    altText: "Black and white coloring page of a monster truck with a long sleek hood shaped like a panther skull with snarling grille and slit headlights",
    prompt: "A monster truck with a very long low sleek hood shaped like a panther's skull, streamlined from above. The front grille is shaped like a snarling open panther mouth with visible teeth. The headlights are narrow horizontal slits like cat eyes. Side three-quarter view. Four oversized tires."
  },
  {
    slug: "baby-panther-truck",
    title: "Baby Panther Truck",
    difficulty: "easy", ageRange: "2-4",
    description: "How cute! This little monster truck has round panther ears on the roof, whisker lines on the bumper, big round eyes, and a long curved panther tail sweeping off the back. Easy and adorable to color!",
    altText: "Black and white coloring page of a simple cute monster truck with panther ears on the roof, whiskers on the bumper, and a long curved tail on the back",
    prompt: "A very simple cartoon monster truck with two round panther ears on top of the cab roof. Whisker lines on each side of the front bumper. Big round friendly eyes as headlights. A long curved panther tail attached to the rear of the truck sweeping back and up. Side view. Only 5 to 6 large shapes. Extra thick outlines."
  },
  {
    slug: "pouncing-stance-truck",
    title: "Pouncing Stance Truck",
    difficulty: "medium", ageRange: "4-6",
    description: "This truck looks like it's about to leap! The front end is dipped low to the ground while the rear is raised high, just like a panther crouching before a pounce. Ready to launch!",
    altText: "Black and white coloring page of a monster truck in a low aggressive pouncing stance with front dipped down and rear raised up",
    prompt: "A monster truck in an aggressive low pouncing stance. The front end is angled downward close to the ground. The rear of the truck is raised higher, like a cat about to pounce. The body is lean and muscular. Side view. Four massive tires, front tires smaller, rear tires tall."
  },
  {
    slug: "panther-jaw-grille-truck",
    title: "Panther Jaw Grille Truck",
    difficulty: "medium", ageRange: "4-6",
    description: "The entire front of this truck is a panther's open jaw! Long curved fangs hang down from the top of the grille opening, and the bumper forms the lower jaw. This truck bites!",
    altText: "Black and white coloring page of a monster truck with the front grille shaped like an open panther mouth with long curved fangs",
    prompt: "A monster truck where the entire front grille is shaped like an open panther mouth. Long curved fang shapes hang down from the top edge of the grille opening. The front bumper forms the lower jaw shape. The opening of the mouth is the grille vent. Side view. Four big tires."
  },
  {
    slug: "tail-whip-antenna-truck",
    title: "Tail Whip Antenna Truck",
    difficulty: "easy", ageRange: "2-4",
    description: "This truck has the coolest antenna ever — a long flexible panther tail that curves and whips back from the top of the roof! Simple and fun with extra thick lines perfect for little hands.",
    altText: "Black and white coloring page of a simple monster truck with a long curved panther tail as the roof antenna",
    prompt: "A simple cartoon monster truck with a long curved panther tail attached to the top of the cab roof, curving gracefully back and upward like a whipping tail serving as the radio antenna. Simple boxy truck body. Side view. Extra thick bold outlines. Four round tires."
  },
  {
    slug: "retractable-claw-wheels-truck",
    title: "Retractable Claw Wheels Truck",
    difficulty: "hard", ageRange: "6-8",
    description: "Look at those wheels! Each tire has curved claw blades extending outward from the sidewalls, like a cat's claws popping out all around. These wheels don't just roll — they rip!",
    altText: "Black and white coloring page of a monster truck where each wheel has curved claw blades extending outward from the tire sidewalls",
    prompt: "A monster truck where each of the four wheels has multiple curved claw blade shapes extending outward from the tire sidewalls like a cat extending its claws. The claws curve out symmetrically around each wheel rim. The truck body is heavy and muscular. Side view showing all four wheels with extended claws."
  },
  {
    slug: "panther-eye-visor-truck",
    title: "Panther Eye Visor Truck",
    difficulty: "medium", ageRange: "4-6",
    description: "This truck gives you the stare-down! A visor over the windshield is shaped like two narrow panther eyes, with an arched brow ridge above giving the cab a fierce squinting menacing look.",
    altText: "Black and white coloring page of a monster truck with a windshield visor shaped like narrow panther eyes giving the cab a menacing squint",
    prompt: "A monster truck with a structural visor above the windshield shaped like two narrow slanted panther eyes. The visor creates a fierce squinting shape over the cab windshield area. A raised brow ridge above the eye shapes. The cab looks like it is squinting with menace. Side view. Big tires."
  },
  {
    slug: "stealth-hunter-truck",
    title: "Stealth Hunter Truck",
    difficulty: "hard", ageRange: "6-8",
    description: "Built to hunt silently. This truck has an ultra-low flat profile with a wedge-shaped front end. Everything is streamlined and aerodynamic — hood flush to the body, no wasted angles, just pure predatory speed.",
    altText: "Black and white coloring page of an ultra low flat profile monster truck with a wedge-shaped front end streamlined like a stalking panther",
    prompt: "A monster truck with an ultra low flat body profile. The front is a sharp wedge shape that tapers to a point. The hood is flush and smooth with the body. Every line is aerodynamic and streamlined. The cab is set very low. Side view. Four wide flat performance tires. Looks like a cat stalking low to the ground."
  },
  {
    slug: "panther-roar-exhaust-truck",
    title: "Panther Roar Exhaust Truck",
    difficulty: "easy", ageRange: "2-4",
    description: "When this truck revs up, the exhaust pipe on the back is shaped like an open roaring panther mouth! Two small round panther ears sit on the cab roof. Simple fun shapes for easy coloring.",
    altText: "Black and white coloring page of a simple monster truck with the exhaust pipe shaped like an open panther mouth and small ears on the cab",
    prompt: "A simple cartoon monster truck with the rear exhaust pipe shaped like an open roaring panther mouth with teeth visible. Two small round ears on the top of the cab roof. Simple boxy truck design. Side view. Extra thick outlines for young kids. Four round tires."
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
  const catId = "cat-panther-monster-truck-coloring-pages";
  if (!cats.find(c => c.id === catId)) {
    cats.push({ id: catId, slug: "panther-monster-truck-coloring-pages", name: "Panther Monster Truck Coloring Pages",
      description: "Free printable panther monster truck coloring pages for kids ages 2-8. Panther claw bumpers, sleek panther hoods, jaw grilles, stealth hunters — every truck is built with fierce panther features. Bold outlines, ready to print!",
      type: "theme" });
    fs.writeFileSync(catsPath, JSON.stringify(cats, null, 2));
    console.log("Created Panther category");
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
  console.log(`\n✅ Panther collection complete: ${PAGES.length} pages`);
}
main().catch(e => { console.error(e); process.exit(1); });
