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
    slug: "grizzly-claw-bumper-truck",
    title: "Grizzly Claw Bumper Truck",
    difficulty: "medium", ageRange: "4-6",
    description: "This truck rolls in tough! Massive bear claw shapes form the entire front bumper — three huge curved claws pointing forward, ready to dig into anything. The front fenders have claw scratch marks etched into the metal.",
    altText: "Black and white coloring page of a monster truck with three giant grizzly bear claw shapes as the front bumper",
    prompt: "A monster truck with three massive curved bear claw shapes as the front bumper, claws pointing forward aggressively. The front fenders have claw scratch mark engravings in the metal. Wide muscular body. Side view. Four huge knobby tires."
  },
  {
    slug: "bear-jaw-hood-truck",
    title: "Bear Jaw Hood Truck",
    difficulty: "hard", ageRange: "6-8",
    description: "The hood of this beast is shaped like a giant bear's open mouth! Big bear teeth line the front edge of the hood, the air intake is a wide bear nose, and the headlights sit inside the open jaws like glowing eyes.",
    altText: "Black and white coloring page of a monster truck with a hood shaped like an open bear mouth with teeth",
    prompt: "A monster truck where the entire hood is sculpted into an open bear mouth. Large bear teeth line the front leading edge of the hood. A wide flat bear nose forms the center air intake on the hood. The headlights are set inside the open jaw area. Side and front three-quarter view. Four oversized tires."
  },
  {
    slug: "baby-bear-cub-truck",
    title: "Baby Bear Cub Truck",
    difficulty: "easy", ageRange: "2-4",
    description: "The cutest little monster truck! It has two round bear ears on top of the cab, a big round bear nose on the front, and tiny paw print shapes on the doors. Super simple and adorable for little kids to color!",
    altText: "Black and white coloring page of a simple cute monster truck with round bear ears and a big bear nose",
    prompt: "A very simple cartoon monster truck with two round bear ears on top of the cab roof. A large round bear nose on the center of the front. Small paw print shapes on the truck doors. Big friendly round headlight eyes. Side view. Only 5 to 6 large simple shapes. Extra thick outlines."
  },
  {
    slug: "polar-bear-plow-truck",
    title: "Polar Bear Plow Truck",
    difficulty: "medium", ageRange: "4-6",
    description: "This Arctic monster truck has a massive wide plow on the front shaped like a huge polar bear paw! Five rounded toe shapes line the top of the plow blade, and the cab has a polar bear round ear on each corner of the roof.",
    altText: "Black and white coloring page of a monster truck with a wide polar bear paw shaped snow plow on the front",
    prompt: "A monster truck with a very wide flat plow blade mounted on the front shaped like a polar bear paw. Five rounded toe shapes line the curved top edge of the plow. Two small round bear ears on the corners of the cab roof. Side view. Four large tires with deep tread."
  },
  {
    slug: "bear-hug-fender-truck",
    title: "Bear Hug Fender Truck",
    difficulty: "hard", ageRange: "6-8",
    description: "This wild truck has fenders shaped like giant bear arms wrapping around each wheel! Each fender has a paw at the end that grips the tire from above. The body looks like the truck is being hugged by a bear on all four sides.",
    altText: "Black and white coloring page of a monster truck with bear arm shaped fenders wrapping around all four wheels",
    prompt: "A monster truck where each fender is sculpted into a thick bear arm wrapping around the wheel. Each fender arm ends in a large bear paw gripping over the top of the tire. All four wheels have bear arm fenders. The truck body has a hugged compressed look. Side view showing both front and rear fenders."
  },
  {
    slug: "honey-pot-exhaust-truck",
    title: "Honey Pot Exhaust Truck",
    difficulty: "easy", ageRange: "2-4",
    description: "What a sweet truck! The exhaust stacks are shaped like little honey pots with drips running down the sides. The cab roof is shaped like a beehive with hexagon panels, and there is a cute bee hood ornament on the front. Easy and fun to color!",
    altText: "Black and white coloring page of a simple monster truck with honey pot shaped exhaust stacks and a beehive cab roof",
    prompt: "A simple cartoon monster truck with two exhaust stacks shaped like round honey pots with drip lines on the sides. The cab roof is shaped like a beehive dome with hexagonal panels. A small cute bee sculpture as a hood ornament on front. Side view. Thick bold outlines for young children."
  },
  {
    slug: "bear-trap-suspension-truck",
    title: "Bear Trap Suspension Truck",
    difficulty: "hard", ageRange: "6-8",
    description: "The suspension on this extreme truck is made of giant bear trap spring mechanisms! Saw-tooth jaw shapes frame each spring coil on all four corners. The undercarriage is exposed to show all the wild bear trap spring detail.",
    altText: "Black and white coloring page of a monster truck with bear trap shaped suspension springs on all four corners",
    prompt: "A monster truck with exposed suspension showing spring coils on all four wheel corners shaped like bear trap mechanisms. Jagged saw-tooth jaw shapes frame each spring assembly. The undercarriage is fully visible showing the mechanical bear trap spring detail. Side view. Four massive tires."
  },
  {
    slug: "kodiak-muscle-truck",
    title: "Kodiak Muscle Truck",
    difficulty: "medium", ageRange: "4-6",
    description: "Built like a Kodiak bear — massive! This truck has an extra wide body that is hunched forward at the front like a charging bear. The hood humps up high in the middle like a bear's shoulder hump, and the front sits low and heavy.",
    altText: "Black and white coloring page of a very wide muscular monster truck with a hunched bear shoulder hump on the hood",
    prompt: "A monster truck with an extremely wide muscular body shaped like a Kodiak bear's bulk. The hood has a high central hump like a grizzly bear shoulder hump. The front end is hunched forward aggressively low to the ground. Extra wide stance. Very beefy fenders. Side view. Enormous wide tires."
  },
  {
    slug: "cave-bear-cab-truck",
    title: "Cave Bear Cab Truck",
    difficulty: "hard", ageRange: "6-8",
    description: "This incredible truck has a cab shaped like the entrance to a bear cave! The windshield sits inside a rocky cave opening arch. Stone stalactites hang down from the cab roof edge. Rock texture covers the cab walls. Totally wild!",
    altText: "Black and white coloring page of a monster truck with the cab shaped like a rocky bear cave entrance with stalactites",
    prompt: "A monster truck where the entire cab is sculpted to look like a bear cave entrance. The windshield sits inside a rough rocky arch opening. Stone stalactites hang down from the front cab roof edge. The cab sides have rock texture and crevice lines. A dark cave shadow inside the windshield arch. Side view. Four massive off-road tires."
  },
  {
    slug: "bear-tooth-grille-truck",
    title: "Bear Tooth Grille Truck",
    difficulty: "easy", ageRange: "2-4",
    description: "Check out this truck's wild face! The front grille is made of rows of big bear teeth, and a wide bear nose sits right on top as the hood scoop. Two round headlights look like bear eyes. Simple shapes make it perfect for little artists!",
    altText: "Black and white coloring page of a simple monster truck with a bear tooth grille and bear nose hood scoop",
    prompt: "A simple cartoon monster truck with a front grille made of two rows of large rounded bear teeth. A wide flat bear nose shape as the center hood scoop on the hood above the grille. Two large round headlights like bear eyes. Side view. Simple bold shapes. Extra thick outlines for young children. Four big tires."
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
      name: "Bear Monster Truck Coloring Pages",
      description: "Free printable bear monster truck coloring pages for kids ages 2-8. Grizzly claw bumpers, bear jaw hoods, honey pot exhausts, cave bear cabs — every truck has bear features built into the design. Bold outlines, ready to print!",
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
  const catId = "cat-bear-monster-truck-coloring-pages";
  if (!cats.find(c => c.id === catId)) {
    cats.push({ id: catId, slug: "bear-monster-truck-coloring-pages", name: "Bear Monster Truck Coloring Pages",
      description: "Free printable bear monster truck coloring pages for kids ages 2-8. Grizzly claw bumpers, bear jaw hoods, honey pot exhausts, cave bear cabs — every truck has bear features built right into the design. Bold outlines, ready to print!",
      type: "theme" });
    fs.writeFileSync(catsPath, JSON.stringify(cats, null, 2));
    console.log("Created Bear category");
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
    execSync('git commit -m "Bear Monster Truck collection: 10 pages + Zippy pins"', { stdio: "inherit", cwd: ROOT });
    execSync("git push origin main", { stdio: "inherit", cwd: ROOT });
    console.log("  Pushed to origin main");
  } catch (e) {
    console.log(`  Git: ${e.message}`);
  }

  console.log(`\n✅ Bear collection complete: ${PAGES.length} pages`);
}
main().catch(e => { console.error(e); process.exit(1); });
