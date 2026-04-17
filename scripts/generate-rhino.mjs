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
const ZIPPY_KEY = (process.env.ZIPPY_SCHEDULER_API_KEY || "").trim();

const SUFFIX = "Black and white line art ONLY, coloring book style for young children ages 2-8, bold thick clean outlines only, simple shapes, NO COLOR, NO shading, NO gray fill, strictly black outlines on white background, NO text in image. IMPORTANT: Do NOT draw any border, frame, box, or rectangle around the image. Just the truck on a plain white background. The complete monster truck must be fully visible.";

const PAGES = [
  {
    slug: "baby-rhino-truck",
    title: "Baby Rhino Truck",
    difficulty: "easy", ageRange: "2-4",
    description: "Meet the cutest little monster truck! Baby Rhino Truck has one small stubby horn right on the hood, big round friendly eyes for headlights, and a chubby round body. Super simple and adorable to color!",
    altText: "Black and white coloring page of a simple cute monster truck with one small rhino horn on the hood and big friendly eyes",
    prompt: "A very simple cartoon monster truck with one small stubby rhino horn centered on the front of the hood pointing forward. Big round friendly eyes as headlights. A wide round chubby body shape. Side view. Only 5 to 6 large simple shapes. Extra thick outlines for young kids."
  },
  {
    slug: "rhino-stomp-wheels-truck",
    title: "Rhino Stomp Wheels Truck",
    difficulty: "easy", ageRange: "2-4",
    description: "Stomp stomp stomp! This fun truck rolls on extra wide flat wheels shaped just like rhino feet. Each big tire has toe shapes pressed into the tread. So cute and fun to color!",
    altText: "Black and white coloring page of a simple monster truck with extra wide flat rhino foot shaped wheels with toe treads",
    prompt: "A simple cartoon monster truck with four extra wide flat tires shaped like rhino feet. Each tire has three large rounded toe shapes pressed into the bottom tread. The truck body is simple and blocky. Side view. Very thick outlines. Simple design for young kids."
  },
  {
    slug: "rhino-tail-spoiler-truck",
    title: "Rhino Tail Spoiler Truck",
    difficulty: "easy", ageRange: "2-4",
    description: "This silly truck has a short thick spoiler on the back shaped exactly like a rhino tail! Two little rhino ears stick up from the roof of the cab. Too cute to not color!",
    altText: "Black and white coloring page of a simple monster truck with a rhino tail shaped spoiler and rhino ears on the cab roof",
    prompt: "A simple cartoon monster truck with a short thick spoiler on the rear shaped like a rhino tail curving slightly upward. Two small rounded rhino ears on the top corners of the cab roof. Simple blocky truck body. Side view. Thick outlines. Easy to color design for young kids."
  },
  {
    slug: "rhino-horn-ram-truck",
    title: "Rhino Horn Ram Truck",
    difficulty: "medium", ageRange: "4-6",
    description: "One massive single rhino horn is mounted dead center on the hood, pointing straight forward like a battering ram. This truck is built to charge through anything! Bold and powerful design.",
    altText: "Black and white coloring page of a monster truck with one massive rhino horn mounted on the center of the hood pointing forward",
    prompt: "A monster truck with one massive thick rhino horn mounted on the center of the hood pointing straight forward. The horn is larger than the headlights and tapers to a blunt point. Wide muscular truck body. Side view. Four large knobby tires. Bold outlines."
  },
  {
    slug: "double-horn-charger-truck",
    title: "Double Horn Charger Truck",
    difficulty: "medium", ageRange: "4-6",
    description: "Two rhino horns side by side on the front bumper make this truck look like it's always charging! The horns curve slightly upward from the bumper, just like a real rhino ready to charge.",
    altText: "Black and white coloring page of a monster truck with two rhino horns side by side on the front bumper",
    prompt: "A monster truck with two large rhino horns mounted side by side on the front bumper, both pointing forward and curving very slightly upward. Wide powerful truck body. Side view. Four large knobby tires. Aggressive forward-leaning stance. Bold clean outlines."
  },
  {
    slug: "armored-rhino-truck",
    title: "Armored Rhino Truck",
    difficulty: "medium", ageRange: "4-6",
    description: "The whole body of this truck is covered in thick overlapping armor plates shaped like rhino skin folds! Every panel has deep fold lines pressed into it. This truck is basically a rolling fortress.",
    altText: "Black and white coloring page of a monster truck with body panels covered in thick rhino skin fold armor shapes",
    prompt: "A monster truck where every body panel is covered in thick overlapping armor plate shapes with deep curved fold lines that look like rhino hide skin folds. The hood, doors, fenders, and cab all have this layered plate texture. Side view. Four huge tires. Bold outlines."
  },
  {
    slug: "rhino-tusk-exhaust-truck",
    title: "Rhino Tusk Exhaust Truck",
    difficulty: "medium", ageRange: "4-6",
    description: "The exhaust pipes on this wild truck curve upward behind the cab like giant rhino tusks! They sweep back and up in a graceful arc, making this one of the most unique looking trucks on the track.",
    altText: "Black and white coloring page of a monster truck with exhaust pipes curved upward like rhino tusks behind the cab",
    prompt: "A monster truck with two large exhaust pipes mounted on each side behind the cab that curve dramatically upward and outward like rhino tusks. Each pipe sweeps back and up in a graceful arc. The rest of the truck has a muscular build. Side view. Four big tires. Bold outlines."
  },
  {
    slug: "rhino-shield-front-truck",
    title: "Rhino Shield Front Truck",
    difficulty: "hard", ageRange: "6-8",
    description: "The entire front end of this beast is one massive thick flat rhino-hide shield! It's wider than the truck body, heavy and imposing. The shield surface has deep texture lines like rhino skin across the whole face.",
    altText: "Black and white coloring page of a monster truck with the entire front end as a thick flat rhino hide shield wider than the body",
    prompt: "A monster truck where the entire front end is one massive thick flat shield shape wider than the truck body. The shield surface is covered in deep texture lines like rhino skin. The headlights are barely visible behind the shield edges. Front three-quarter view. Huge tires. Detailed bold outlines."
  },
  {
    slug: "charging-rhino-stance-truck",
    title: "Charging Rhino Stance Truck",
    difficulty: "hard", ageRange: "6-8",
    description: "This truck leans hard forward in a charging stance! The front is pitched low, the rear is raised up, and the hood horn aims straight ahead like a rhino mid-charge. Every line of this truck screams forward motion.",
    altText: "Black and white coloring page of a monster truck leaning aggressively forward in a charging stance with front low and hood horn aimed forward",
    prompt: "A monster truck in a dramatic forward-charging stance with the front end pitched low to the ground and the rear raised up. A large rhino horn on the center of the hood aimed straight forward at ground level. The suspension is compressed in front. Side view. Four oversized tires at aggressive angles. Bold detailed outlines."
  },
  {
    slug: "rhino-battering-ram-truck",
    title: "Rhino Battering Ram Truck",
    difficulty: "hard", ageRange: "6-8",
    description: "The front of this ultimate monster truck IS a massive reinforced battering ram horn! The entire front structure is one enormous horn shape — wider at the base, thick reinforcing ribs running its length, tapering to a blunt tip.",
    altText: "Black and white coloring page of a monster truck where the entire front end is one massive reinforced battering ram horn shape",
    prompt: "A monster truck where the entire front end structure is one enormous single horn battering ram shape. The horn is very wide at the base where it connects to the frame, has multiple thick reinforcing ribs running along its length, and tapers to a heavy blunt tip. The horn is as large as the rest of the truck body. Front three-quarter view. Massive tires. Highly detailed bold outlines."
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

async function createZippyBoard() {
  if (!ZIPPY_KEY) { console.log("No ZIPPY_SCHEDULER_API_KEY found, skipping board creation"); return null; }
  console.log("\nCreating Pinterest board via Zippy API...");
  const res = await fetch("https://www.zippyscheduler.com/api/v1/boards", {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${ZIPPY_KEY}` },
    body: JSON.stringify({
      account_id: "0d697670-9c73-47a2-b2c8-7595958c9d6b",
      name: "Rhino Monster Truck Coloring Pages",
      description: "Free printable rhino monster truck coloring pages for kids ages 2-8. Rhino horn bumpers, armored hide bodies, tusk exhaust pipes, battering ram fronts — every truck is built like a rhino. Bold outlines, ready to print!",
      privacy: "public"
    })
  });
  if (!res.ok) {
    const txt = await res.text();
    console.log(`  Zippy board creation failed: HTTP ${res.status} — ${txt}`);
    return null;
  }
  const data = await res.json();
  const boardId = data.id || data.board_id || data.data?.id;
  console.log(`  Board created: ${boardId}`);
  return boardId;
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
  const catId = "cat-rhino-monster-truck-coloring-pages";
  if (!cats.find(c => c.id === catId)) {
    cats.push({ id: catId, slug: "rhino-monster-truck-coloring-pages", name: "Rhino Monster Truck Coloring Pages",
      description: "Free printable rhino monster truck coloring pages for kids ages 2-8. Rhino horn bumpers, armored hide bodies, tusk exhaust pipes, battering ram fronts — every truck is built like a rhino. Bold outlines, ready to print!",
      type: "theme" });
    fs.writeFileSync(catsPath, JSON.stringify(cats, null, 2));
    console.log("Created Rhino category");
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

  // Create Pinterest board via Zippy API
  const boardId = await createZippyBoard();
  if (boardId) {
    const boardsPath = path.join(ROOT, "src/data/pinterest-boards.json");
    const boards = JSON.parse(fs.readFileSync(boardsPath, "utf8"));
    boards.boards[catId] = boardId;
    fs.writeFileSync(boardsPath, JSON.stringify(boards, null, 2));
    console.log(`  Added board to pinterest-boards.json`);
  }

  // Generate pin descriptions
  console.log("\nGenerating pin descriptions...");
  try {
    execSync("node scripts/generate-pin-descriptions.mjs", { stdio: "inherit", cwd: ROOT });
  } catch (e) {
    console.log(`  Pin descriptions: ${e.message}`);
  }

  // Schedule pins
  console.log("\nScheduling pins...");
  try {
    execSync("node scripts/schedule-pins.mjs --days=30", { stdio: "inherit", cwd: ROOT });
  } catch (e) {
    console.log(`  Schedule pins: ${e.message}`);
  }

  // Wait 60 seconds before committing to avoid conflicts with parallel collections (e.g. Bear)
  console.log("\nWaiting 60 seconds before git commit (avoiding parallel collection conflicts)...");
  await new Promise(resolve => setTimeout(resolve, 60000));

  // Git commit and push
  console.log("\nCommitting and pushing...");
  try {
    execSync("git add -A", { stdio: "inherit", cwd: ROOT });
    execSync('git commit -m "Rhino Monster Truck collection: 10 pages + Zippy pins"', { stdio: "inherit", cwd: ROOT });
    execSync("git push origin main", { stdio: "inherit", cwd: ROOT });
    console.log("  Pushed to origin main");
  } catch (e) {
    console.log(`  Git: ${e.message}`);
  }

  console.log(`\n✅ Rhino collection complete: ${PAGES.length} pages`);
}
main().catch(e => { console.error(e); process.exit(1); });
