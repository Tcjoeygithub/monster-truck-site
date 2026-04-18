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
    slug: "baby-scorpion-truck",
    title: "Baby Scorpion Truck",
    difficulty: "easy", ageRange: "2-4",
    description: "The cutest little scorpion truck around! This adorable monster truck has a small curved tail on the back, tiny pincers on the front bumper, and big round friendly eyes. Super simple and perfect for little colorers!",
    altText: "Black and white coloring page of a simple cute monster truck with a small curved scorpion tail on back and tiny pincers on bumper",
    prompt: "A very simple cartoon monster truck with a small curved scorpion tail on the rear of the truck bed arching slightly upward. Two tiny pincer shapes on the front bumper. Big round friendly eyes as headlights. Simple round chubby body. Side view. Only 5 to 6 large simple shapes. Extra thick outlines for young kids."
  },
  {
    slug: "desert-scorpion-truck",
    title: "Desert Scorpion Truck",
    difficulty: "easy", ageRange: "2-4",
    description: "A big bold truck inspired by the desert scorpion! This simple truck has a wide flat body like a scorpion, one large curving tail sweeping up from the back, and thick outlines that are easy and fun to color!",
    altText: "Black and white coloring page of a simple wide flat monster truck with a single large curving scorpion tail at the rear",
    prompt: "A simple cartoon monster truck with a very wide flat body shaped low and broad like a desert scorpion. One large thick curved tail rising from the center rear and arching upward. Thick clean outlines. Side view. Four big round tires. Simple shapes easy for young kids to color."
  },
  {
    slug: "scorpion-king-crown-truck",
    title: "Scorpion King Crown Truck",
    difficulty: "easy", ageRange: "4-6",
    description: "All hail the Scorpion King! This awesome truck wears a crown shape on the roof, has two pincer shapes as side mirrors sticking out from the doors, and a small curved tail on the back. Fit for royalty!",
    altText: "Black and white coloring page of a monster truck with a crown shape on the roof, pincer side mirrors, and a small scorpion tail on back",
    prompt: "A cartoon monster truck with a crown shape built into the top of the cab roof with pointed tips. Two pincer claw shapes as side mirrors sticking outward from each door. A small curved scorpion tail on the rear of the truck. Side view. Simple bold outlines. Four large tires."
  },
  {
    slug: "scorpion-claw-bumper-truck",
    title: "Scorpion Claw Bumper Truck",
    difficulty: "medium", ageRange: "4-6",
    description: "Watch out — this truck can grab! Two huge scorpion pincers form the entire front bumper, each claw open wide and ready to clamp down. This truck charges into anything with claws first!",
    altText: "Black and white coloring page of a monster truck with two large open scorpion pincer claw shapes as the front bumper",
    prompt: "A monster truck with two large scorpion pincer claw shapes as the entire front bumper. Each pincer is open wide with two thick curved claw fingers facing forward. Wide muscular truck body. Side view. Four large knobby tires. Bold clean outlines."
  },
  {
    slug: "stinger-exhaust-truck",
    title: "Stinger Exhaust Truck",
    difficulty: "medium", ageRange: "4-6",
    description: "That exhaust pipe is no ordinary exhaust! A single massive exhaust pipe shaped like a scorpion stinger curves up and over from the rear, the pointed tip aimed forward just like a real scorpion ready to strike!",
    altText: "Black and white coloring page of a monster truck with a single exhaust pipe shaped like a curved scorpion stinger arching over from the rear",
    prompt: "A monster truck with a single large exhaust pipe shaped like a scorpion stinger rising from the rear of the truck bed and curving up and over toward the front, the pointed stinger tip aimed slightly downward. Muscular truck body. Side view. Four large tires. Bold outlines."
  },
  {
    slug: "double-pincer-door-truck",
    title: "Double Pincer Door Truck",
    difficulty: "medium", ageRange: "4-6",
    description: "Every door on this wild truck is shaped like an open scorpion pincer! The curved claw shape is built right into each door panel, making this truck look like it has claws on both sides. Totally unique design!",
    altText: "Black and white coloring page of a monster truck where each door panel is shaped like an open scorpion pincer claw",
    prompt: "A monster truck where each door panel is sculpted in the shape of an open scorpion pincer claw. The curved claw fingers are visible as raised features on each door surface. Wide truck body with two doors per side. Side view. Four large knobby tires. Bold detailed outlines."
  },
  {
    slug: "scorpion-shield-hood-truck",
    title: "Scorpion Shield Hood Truck",
    difficulty: "medium", ageRange: "4-6",
    description: "The hood of this beast is shaped like a flat scorpion head! Two small eyes sit on the front edge corners, and mandible shapes jut out from the front of the hood like a scorpion's mouth parts. Fierce and detailed!",
    altText: "Black and white coloring page of a monster truck with a hood shaped like a flat scorpion head with two eyes and mandibles at the front edge",
    prompt: "A monster truck with a hood shaped like a wide flat scorpion head. Two small raised eye shapes sit on the front corners of the hood. Two mandible shapes jut outward from the front edge of the hood like scorpion mouth parts. Wide truck body. Side view. Four large tires. Bold clean outlines."
  },
  {
    slug: "scorpion-tail-crane-truck",
    title: "Scorpion Tail Crane Truck",
    difficulty: "hard", ageRange: "6-8",
    description: "This is the most extreme scorpion truck of all! A massive curved scorpion tail is mounted on the truck bed, arching high over the cab with a sharp stinger at the tip. The tail is segmented like a real scorpion and towers over everything!",
    altText: "Black and white coloring page of a monster truck with a massive curved segmented scorpion tail mounted on the truck bed arching over the cab with a stinger tip",
    prompt: "A monster truck with a massive curved scorpion tail structure mounted on the truck bed. The segmented tail has five to six armored segments and arches dramatically up and over the cab of the truck, with a sharp curved stinger tip hanging above the front hood. The tail is as large as the truck itself. Side view. Four massive tires. Highly detailed bold outlines."
  },
  {
    slug: "scorpion-armor-shell-truck",
    title: "Scorpion Armor Shell Truck",
    difficulty: "hard", ageRange: "6-8",
    description: "The entire cab of this monster truck is shaped like a scorpion's armored body segment! Every surface has thick ridged plates layered over it like scorpion exoskeleton armor. This truck is basically a rolling tank.",
    altText: "Black and white coloring page of a monster truck with the cab shaped like a scorpion armored body segment covered in thick ridged plates",
    prompt: "A monster truck where the entire cab is shaped like a scorpion's armored thorax body segment. Every surface of the cab is covered in thick overlapping ridged armor plates like scorpion exoskeleton. The hood and fenders have the same segmented plate armor texture. Side view. Four oversized tires. Detailed bold outlines."
  },
  {
    slug: "scorpion-leg-suspension-truck",
    title: "Scorpion Leg Suspension Truck",
    difficulty: "hard", ageRange: "6-8",
    description: "Instead of a normal suspension, this truck has eight small leg-shaped supports visible underneath! Each leg is jointed like a real scorpion leg, giving this truck the most unique and detailed undercarriage you've ever seen on a monster truck.",
    altText: "Black and white coloring page of a monster truck with eight scorpion leg shaped supports visible underneath instead of normal suspension",
    prompt: "A monster truck with eight small jointed scorpion leg shapes visible underneath the truck body serving as the suspension supports, four on each side. Each leg has two visible joints like a real scorpion leg and ends at the axle. The legs are visible from the side between the huge tires. Side view. Four massive tires. Highly detailed bold outlines."
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
      name: "Scorpion Monster Truck Coloring Pages",
      description: "Free printable scorpion monster truck coloring pages for kids ages 2-8. Scorpion tail cranes, claw bumpers, armor shell cabs, leg suspensions — every truck is built like a scorpion. Bold outlines, ready to print!",
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
  const catId = "cat-scorpion-monster-truck-coloring-pages";
  if (!cats.find(c => c.id === catId)) {
    cats.push({ id: catId, slug: "scorpion-monster-truck-coloring-pages", name: "Scorpion Monster Truck Coloring Pages",
      description: "Free printable scorpion monster truck coloring pages for kids ages 2-8. Scorpion tail cranes, claw bumpers, armor shell cabs, leg suspensions — every truck is built like a scorpion. Bold outlines, ready to print!",
      type: "theme" });
    fs.writeFileSync(catsPath, JSON.stringify(cats, null, 2));
    console.log("Created Scorpion category");
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

  // Wait 120 seconds before committing to avoid conflicts with parallel collections (e.g. Cobra)
  console.log("\nWaiting 120 seconds before git commit (avoiding parallel collection conflicts)...");
  await new Promise(resolve => setTimeout(resolve, 120000));

  // Git commit and push
  console.log("\nCommitting and pushing...");
  try {
    execSync("git add -A", { stdio: "inherit", cwd: ROOT });
    execSync('git commit -m "Scorpion Monster Truck collection: 10 pages + Zippy pins"', { stdio: "inherit", cwd: ROOT });
    execSync("git push origin main", { stdio: "inherit", cwd: ROOT });
    console.log("  Pushed to origin main");
  } catch (e) {
    console.log(`  Git: ${e.message}`);
  }

  console.log(`\n✅ Scorpion collection complete: ${PAGES.length} pages`);
}
main().catch(e => { console.error(e); process.exit(1); });
