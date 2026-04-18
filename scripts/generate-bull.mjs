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
    slug: "bull-horn-bumper-truck",
    title: "Bull Horn Bumper Truck",
    difficulty: "medium", ageRange: "4-6",
    description: "Two massive curved bull horns are mounted right on the front bumper, pointing outward like a charging bull! This powerful monster truck uses its horns to lead the charge. Wide and tough with huge tires to match.",
    altText: "Black and white coloring page of a monster truck with two large curved bull horns mounted on the front bumper pointing outward",
    prompt: "A monster truck with two massive curved bull horns mounted on the front bumper, one on each side, pointing outward and slightly forward like a charging bull. The horns are thick at the base and taper to a point. Wide muscular truck body. Side view. Four huge knobby tires. Bold clean outlines."
  },
  {
    slug: "charging-bull-hood-truck",
    title: "Charging Bull Hood Truck",
    difficulty: "hard", ageRange: "6-8",
    description: "The entire hood of this truck is shaped like a bull's lowered head in full charge mode! Two wide nostrils serve as the air intakes, the brow furrows into the windshield base, and the front profile looks exactly like a bull ready to charge.",
    altText: "Black and white coloring page of a monster truck with a hood shaped like a bull's lowered charging head with nostril air intakes",
    prompt: "A monster truck where the entire hood is sculpted to look like a bull's lowered charging head. Two wide circular nostril shapes serve as air intakes on the front of the hood. A thick brow ridge runs across the base of the windshield. The front profile mimics a bull's face with forehead lowered in a charging position. Side view. Four oversized tires. Highly detailed bold outlines."
  },
  {
    slug: "baby-bull-cub-truck",
    title: "Baby Bull Cub Truck",
    difficulty: "easy", ageRange: "2-4",
    description: "The most adorable little bull truck! Two tiny horns stick up from the roof, a round ring-shaped front bumper looks just like a bull nose ring, and big friendly round eyes make this truck the cutest on the track. Perfect for little colorers!",
    altText: "Black and white coloring page of a simple cute monster truck with two small horns on the roof, a ring-shaped bumper, and big round eyes",
    prompt: "A very simple cartoon monster truck with two tiny curved horn shapes sticking up from the top of the cab roof. A round ring shape in the center of the front bumper like a bull nose ring. Two big round friendly eyes as headlights. Simple chubby round body. Side view. Only 5 to 6 large simple shapes. Extra thick outlines for young kids."
  },
  {
    slug: "bull-ring-grille-truck",
    title: "Bull Ring Grille Truck",
    difficulty: "medium", ageRange: "4-6",
    description: "This truck's grille is one of a kind! A huge metal nose ring hangs from the center of the grille, and two wide nostril-shaped air scoops sit above it. It looks exactly like a bull's snout — and just as tough!",
    altText: "Black and white coloring page of a monster truck with a large nose ring hanging from the center grille and nostril air scoops above",
    prompt: "A monster truck with a large circular metal ring hanging from the center of the front grille like a bull nose ring. Two wide oval nostril-shaped air scoops built into the front above the ring. The front end is flat and wide. Side view. Four large knobby tires. Bold clean outlines."
  },
  {
    slug: "rodeo-bull-cab-truck",
    title: "Rodeo Bull Cab Truck",
    difficulty: "hard", ageRange: "6-8",
    description: "This wild truck is mid-buck! The entire front end is raised high off the ground like a bull rearing up on its hind legs, and the cab has a bucking bull silhouette built into its shape. This is the most extreme bull truck in the rodeo!",
    altText: "Black and white coloring page of a monster truck with the front end raised high like a bull rearing up on its hind legs",
    prompt: "A monster truck in a dramatic rearing pose with the front end lifted high into the air like a bull rearing up on its hind legs. The rear tires are on the ground bearing all the weight while the front tires are lifted. The cab has a rounded bucking shape. Two horns on the front corners. The truck is angled dramatically upward at the front. Highly detailed bold outlines."
  },
  {
    slug: "matador-shield-truck",
    title: "Matador Shield Truck",
    difficulty: "medium", ageRange: "4-6",
    description: "Built like a matador's cape! The entire front end of this truck is flat, wide, and curved like a matador's shield, with a horn on each front corner. This truck doesn't run from bulls — it IS the bull!",
    altText: "Black and white coloring page of a monster truck with a wide flat front end shaped like a matador's shield with horns on each corner",
    prompt: "A monster truck with a very wide flat front end shaped like a matador's cape or shield, wider than the rest of the truck body. A curved bull horn shape on each upper corner of the flat front. The shield face is smooth and flat. Wide low truck body. Side view. Four large tires. Bold clean outlines."
  },
  {
    slug: "bull-hoof-wheels-truck",
    title: "Bull Hoof Wheels Truck",
    difficulty: "easy", ageRange: "2-4",
    description: "Check out those wheels! Each wheel is shaped like a bull hoof, wide and rounded on the bottom. This simple truck also has two small horns on the hood and is ready to stomp its way to the finish line!",
    altText: "Black and white coloring page of a simple monster truck with bull hoof shaped wheels and two small horns on the hood",
    prompt: "A simple cartoon monster truck where each of the four wheels is shaped like a bull hoof — wide and rounded at the bottom with a slight split in the center. Two small curved horn shapes on the front of the hood. Simple blocky truck body. Side view. Thick clean outlines easy for young kids to color."
  },
  {
    slug: "longhorn-exhaust-truck",
    title: "Longhorn Exhaust Truck",
    difficulty: "medium", ageRange: "4-6",
    description: "These exhaust pipes stretch wide like Texas longhorn horns! Two extremely long curved exhaust pipes sweep outward from each side of the cab, curving just like the legendary longhorn's massive spread. The widest truck you've ever seen!",
    altText: "Black and white coloring page of a monster truck with two extremely long curved exhaust pipes shaped like Texas longhorn horns extending wide from the cab",
    prompt: "A monster truck with two extremely long curved exhaust pipes mounted on each side of the cab that sweep dramatically outward and upward like Texas longhorn horns. Each pipe is thick at the base and curves out very wide — nearly as wide as the truck is long. Side view. Four large tires. Bold clean outlines."
  },
  {
    slug: "stampede-muscle-truck",
    title: "Stampede Muscle Truck",
    difficulty: "hard", ageRange: "6-8",
    description: "Built like a stampeding bull! This monster truck has an extra wide muscular body with massive bulging fenders that look like a bull's powerful shoulders. The low aggressive stance and thick neck-shaped hood make this truck look unstoppable.",
    altText: "Black and white coloring page of a wide muscular monster truck with bulging fenders like bull shoulders and a low aggressive stance",
    prompt: "A monster truck with an extremely wide muscular body. Huge bulging rounded fenders on each side that look like a bull's powerful shoulder muscles — raised high and round. The hood is thick and low like a bull's neck. The truck sits with a very low aggressive stance. Extra wide stance with massive tires on each corner. Side view. Highly detailed bold outlines."
  },
  {
    slug: "bull-tail-spoiler-truck",
    title: "Bull Tail Spoiler Truck",
    difficulty: "easy", ageRange: "2-4",
    description: "This fun truck has a curvy bull tail as its rear spoiler! A thin curved tail rises from the back of the cab and curls at the tip just like a real bull's tail. Two small horns on the hood complete the look. Simple and fun to color!",
    altText: "Black and white coloring page of a simple monster truck with a curved bull tail as the rear spoiler and two small horns on the hood",
    prompt: "A simple cartoon monster truck with a thin curved bull tail shape rising from the rear of the cab roof and curling slightly at the tip, serving as a rear spoiler. Two small curved horn shapes on the front of the hood. Simple clean truck body. Side view. Four big round tires. Thick outlines easy for young kids to color."
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
      name: "Bull Monster Truck Coloring Pages",
      description: "Free printable bull monster truck coloring pages for kids ages 2-8. Bull horn bumpers, charging hood designs, longhorn exhausts, hoof wheels — every truck is built like a bull. Bold outlines, ready to print!",
      privacy: "PUBLIC"
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
  const catId = "cat-bull-monster-truck-coloring-pages";
  if (!cats.find(c => c.id === catId)) {
    cats.push({ id: catId, slug: "bull-monster-truck-coloring-pages", name: "Bull Monster Truck Coloring Pages",
      description: "Free printable bull monster truck coloring pages for kids ages 2-8. Bull horn bumpers, charging hood designs, longhorn exhausts, hoof wheels — every truck is built like a bull. Bold outlines, ready to print!",
      type: "theme" });
    fs.writeFileSync(catsPath, JSON.stringify(cats, null, 2));
    console.log("Created Bull category");
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

  // Git commit and push
  console.log("\nCommitting and pushing...");
  try {
    execSync("git add -A", { stdio: "inherit", cwd: ROOT });
    execSync('git commit -m "Bull Monster Truck collection: 10 pages + Zippy pins"', { stdio: "inherit", cwd: ROOT });
    execSync("git push origin main", { stdio: "inherit", cwd: ROOT });
    console.log("  Pushed to origin main");
  } catch (e) {
    console.log(`  Git: ${e.message}`);
  }

  console.log(`\n✅ Bull collection complete: ${PAGES.length} pages`);
}
main().catch(e => { console.error(e); process.exit(1); });
