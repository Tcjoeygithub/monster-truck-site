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
    slug: "bat-wing-fender-truck",
    title: "Bat Wing Fender Truck",
    difficulty: "hard", ageRange: "6-8",
    description: "The rear fenders on this monster truck stretch out and curve upward into full spread bat wings! You can see the individual finger bones running through each wing panel, just like a real bat's wing structure.",
    altText: "Black and white coloring page of a monster truck with rear fenders shaped like spread bat wings with finger bone details",
    prompt: "A monster truck where the rear fenders extend outward and upward into large spread bat wings with visible finger bone details running through the wing panels. The wing structure has membrane sections between the bones. Side view. Four huge knobby tires."
  },
  {
    slug: "bat-ear-cab-truck",
    title: "Bat Ear Cab Truck",
    difficulty: "medium", ageRange: "4-6",
    description: "This truck has two tall pointed bat ears rising straight up from the cab roof! The headlights are narrow slits, just like the sharp night-vision eyes of a bat on the hunt.",
    altText: "Black and white coloring page of a monster truck with two tall pointed bat ear shapes on the cab roof and narrow slit headlights",
    prompt: "A monster truck with two tall pointed bat ear shapes rising straight up from the top of the cab roof. The headlights are narrow horizontal slits. The cab roof has the ears positioned symmetrically near the front corners. Side view. Four oversized tires."
  },
  {
    slug: "baby-bat-truck",
    title: "Baby Bat Truck",
    difficulty: "easy", ageRange: "2-4",
    description: "This adorable little monster truck has small rounded bat wings on its fenders, big round friendly eyes, and two tiny fangs poking down from the front bumper. Super cute and easy to color!",
    altText: "Black and white coloring page of a simple cute monster truck with small rounded bat wings on the fenders, big round eyes, and tiny fangs on the bumper",
    prompt: "A very simple cartoon monster truck with small rounded bat wings on each side fender. Big round friendly eyes as headlights. Two small fang shapes hanging from the top of the front bumper. Side view. Only 5 to 6 large shapes. Extra thick outlines."
  },
  {
    slug: "sonar-dish-roof-truck",
    title: "Sonar Dish Roof Truck",
    difficulty: "medium", ageRange: "4-6",
    description: "A large round sonar dish sits on top of the cab, tilted forward like the cupped ear of a bat tuned in to every sound. This truck can sense what's coming from miles away!",
    altText: "Black and white coloring page of a monster truck with a large round sonar dish mounted on the cab roof angled forward",
    prompt: "A monster truck with a large round concave sonar dish mounted on top of the cab roof, angled forward at about 30 degrees. The dish has concentric ring details inside it. The cab is otherwise standard. Side view. Four big knobby tires."
  },
  {
    slug: "bat-claw-bumper-truck",
    title: "Bat Claw Bumper Truck",
    difficulty: "hard", ageRange: "6-8",
    description: "The front bumper of this beast is shaped like a bat's feet — with hooked curved claws hanging downward from the bumper bar. Those talons mean business!",
    altText: "Black and white coloring page of a monster truck with a front bumper shaped like bat feet with hooked claws hanging downward",
    prompt: "A monster truck with a front bumper shaped like bat feet. Several long hooked curved claw shapes hang downward from the bumper bar like bat talons gripping a perch. The claws are thick and sharply curved. Side view. Four huge tires."
  },
  {
    slug: "upside-down-exhaust-truck",
    title: "Upside Down Exhaust Truck",
    difficulty: "medium", ageRange: "4-6",
    description: "The exhaust pipes on this truck curve down and then hook back upward at the ends — just like a bat hanging upside down! Each pipe makes a perfect U-hook shape along the cab sides.",
    altText: "Black and white coloring page of a monster truck with exhaust pipes that curve downward and hook back up like upside-down bats",
    prompt: "A monster truck with two exhaust pipes mounted on the sides of the cab that curve sharply downward and then bend back upward at the tip, forming a U-hook shape like a bat hanging upside down. The pipes are thick and prominent. Side view. Big tires."
  },
  {
    slug: "bat-cave-cab-truck",
    title: "Bat Cave Cab Truck",
    difficulty: "hard", ageRange: "6-8",
    description: "The cab of this truck is built to look like the entrance to a bat cave! Jagged stalactite shapes hang from the roof edge all the way around, and the windshield sits inside the dark cave opening.",
    altText: "Black and white coloring page of a monster truck with a cab shaped like a cave entrance with stalactites hanging from the roof edge",
    prompt: "A monster truck where the cab is shaped like a cave entrance. Jagged stalactite shapes hang downward from the entire roof edge of the cab. The windshield is set inside the cave opening shape. The roofline has an arched cave-mouth profile. Side view. Four oversized tires."
  },
  {
    slug: "fang-grille-truck",
    title: "Fang Grille Truck",
    difficulty: "easy", ageRange: "2-4",
    description: "Check out that grille! Two huge vampire bat fangs hang down from the top of the front grille, making this simple monster truck look ready to bite. Bold, simple, and fun to color!",
    altText: "Black and white coloring page of a simple monster truck with two large vampire fangs hanging from the top of the front grille",
    prompt: "A simple monster truck with two large vampire bat fang shapes hanging down from the top of the front grille. The fangs are thick and pointed. The rest of the truck is a standard simple shape. Side view. Extra thick outlines. Four big tires."
  },
  {
    slug: "wing-wrap-doors-truck",
    title: "Wing Wrap Doors Truck",
    difficulty: "medium", ageRange: "4-6",
    description: "The doors on this truck are shaped like folded bat wings wrapped snugly around the cab body! The wing-fold lines run across the door panels, giving the truck a seriously cool wrapped look.",
    altText: "Black and white coloring page of a monster truck with doors shaped like folded bat wings wrapped around the cab",
    prompt: "A monster truck where the cab doors are shaped and styled like folded bat wings wrapped around the cab body. The door panels have wing-fold crease lines and layered membrane shapes across them. The cab appears wrapped in folded wings. Side view. Four large tires."
  },
  {
    slug: "echo-screech-truck",
    title: "Echo Screech Truck",
    difficulty: "easy", ageRange: "2-4",
    description: "This truck screams! The front bumper has a wide open mouth shape on it, and sound wave rings radiate outward from the mouth. Two small bat ears sit on top of the cab. Simple, loud, and fun!",
    altText: "Black and white coloring page of a simple monster truck with a wide open mouth on the front bumper and sound wave rings radiating out",
    prompt: "A simple cartoon monster truck with a wide open mouth shape on the front bumper. Curved sound wave ring lines radiate outward in front of the mouth. Two small pointed bat ears on top of the cab roof. Side view. Extra thick outlines. Four big tires."
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
  const catId = "cat-bat-monster-truck-coloring-pages";
  if (!cats.find(c => c.id === catId)) {
    cats.push({ id: catId, slug: "bat-monster-truck-coloring-pages", name: "Bat Monster Truck Coloring Pages",
      description: "Free printable bat monster truck coloring pages for kids ages 2-8. Bat wing fenders, fang grilles, sonar dish roofs, cave cabs — every truck is built with wild bat-inspired structural mods. Bold outlines, ready to print!",
      type: "theme" });
    fs.writeFileSync(catsPath, JSON.stringify(cats, null, 2));
    console.log("Created Bat category");
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
  console.log(`\n✅ Bat collection complete: ${PAGES.length} pages`);
}
main().catch(e => { console.error(e); process.exit(1); });
