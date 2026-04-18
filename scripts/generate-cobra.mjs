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
    slug: "baby-snake-truck",
    title: "Baby Snake Truck",
    difficulty: "easy", ageRange: "2-4",
    description: "A cute little monster truck with two small fangs on the front bumper, a forked tongue shape as the antenna, and big round friendly eyes as headlights. Simple and adorable — perfect for the youngest colorers!",
    altText: "Black and white coloring page of a simple cute monster truck with two small fangs on the bumper and a forked tongue antenna",
    prompt: "A very simple cartoon monster truck with two small curved fang shapes attached to the front bumper pointing downward. A forked tongue shape as the antenna sticking up from the roof. Two big round friendly eyes as headlights. Side view. Only 5 to 6 large shapes. Extra thick outlines."
  },
  {
    slug: "rattlesnake-tail-truck",
    title: "Rattlesnake Tail Truck",
    difficulty: "easy", ageRange: "2-4",
    description: "This fun truck has a rattlesnake rattle shape mounted on the rear bumper! The rattle is made of big chunky segments stacked together. Simple truck body, easy to color for little kids.",
    altText: "Black and white coloring page of a simple monster truck with a rattlesnake rattle shape on the rear bumper",
    prompt: "A simple monster truck with a large rattlesnake rattle shape mounted prominently on the rear bumper. The rattle is made of three to four big chunky rounded segments stacked vertically. The truck body is simple and blocky. Side view. Thick outlines. Big tires."
  },
  {
    slug: "cobra-eye-headlight-truck",
    title: "Cobra Eye Headlight Truck",
    difficulty: "easy", ageRange: "4-6",
    description: "Two narrow vertical slit-shaped cobra eye headlights give this truck a fierce stare! A small hood scoop shaped like a snake nose sits between them. Simple design, great for beginners.",
    altText: "Black and white coloring page of a monster truck with narrow slit cobra eye headlights and a snake nose hood scoop",
    prompt: "A monster truck with two tall narrow vertical slit-shaped headlights on the front that look like cobra eyes. A small rounded hood scoop centered on the hood shaped like a snake's blunt nose. Simple blocky truck body. Side view. Thick clean outlines. Big tires."
  },
  {
    slug: "cobra-fang-bumper-truck",
    title: "Cobra Fang Bumper Truck",
    difficulty: "medium", ageRange: "4-6",
    description: "Two long curved cobra fangs extend downward from the front bumper — this truck means business! The fangs are hollow and grooved just like real cobra fangs, built right into the steel bumper structure.",
    altText: "Black and white coloring page of a monster truck with two long curved cobra fang shapes as the front bumper",
    prompt: "A monster truck with two long curved hollow fang shapes built into the front bumper, pointing downward like cobra fangs ready to strike. The fangs are structural parts of the bumper, each with a groove down the center. Wide aggressive truck body. Side view. Four huge knobby tires."
  },
  {
    slug: "viper-strike-exhaust-truck",
    title: "Viper Strike Exhaust Truck",
    difficulty: "medium", ageRange: "4-6",
    description: "The exhaust pipes on this truck are shaped like striking snake heads with wide open mouths! Two viper-head exhausts rise from the hood, jaws open wide, ready to breathe fire.",
    altText: "Black and white coloring page of a monster truck with exhaust pipes shaped like open-mouthed striking viper heads",
    prompt: "A monster truck with two exhaust pipes rising from the hood, each pipe ending in a snake head shape with the mouth wide open and fangs visible, like a striking viper. The snake head exhausts face forward aggressively. Side view. Bold thick outlines. Massive tires."
  },
  {
    slug: "snake-jaw-grille-truck",
    title: "Snake Jaw Grille Truck",
    difficulty: "medium", ageRange: "4-6",
    description: "The entire front grille of this truck is shaped like a snake's open jaw! Long pointed fangs line the top and bottom of the grille opening, with a ribbed throat visible inside. Menacing and cool.",
    altText: "Black and white coloring page of a monster truck with a front grille shaped like a snake's open jaw with fangs top and bottom",
    prompt: "A monster truck where the entire front grille is shaped like a wide-open snake jaw. Long pointed fang shapes line both the top and bottom edges of the grille opening. Horizontal ribs inside the grille suggest the snake's throat. Wide truck body. Side view. Big tires."
  },
  {
    slug: "sidewinder-wheel-truck",
    title: "Sidewinder Wheel Truck",
    difficulty: "medium", ageRange: "4-6",
    description: "The wheels on this truck have S-shaped snake-body spokes radiating from the center hub! Each spoke curves in an S-shape like a sidewinder snake in motion. Unique and striking wheel design.",
    altText: "Black and white coloring page of a monster truck with wheels featuring S-shaped snake-body spokes radiating from the center",
    prompt: "A monster truck where each of the four wheels has S-shaped curved spokes radiating outward from the center hub, each spoke shaped like a sidewinder snake body in motion. The truck body is bold and simple. Side view. The S-curve spokes are clearly visible on all four wheels."
  },
  {
    slug: "cobra-hood-flare-truck",
    title: "Cobra Hood Flare Truck",
    difficulty: "hard", ageRange: "6-8",
    description: "The hood panels of this truck flare out dramatically wide on each side like a cobra spreading its hood! The wide flared panels sweep back from the front and frame the cab, giving the truck an unmistakable cobra spread silhouette.",
    altText: "Black and white coloring page of a monster truck with hood panels that flare wide like a cobra spreading its hood",
    prompt: "A monster truck with wide hood panels that flare outward dramatically on each side like a cobra's hood spreading wide. The flared panels are structural, extending well beyond the normal hood width and sweeping back along the sides of the cab. Front three-quarter view. Detailed panel lines. Massive tires."
  },
  {
    slug: "coiled-cobra-suspension-truck",
    title: "Coiled Cobra Suspension Truck",
    difficulty: "hard", ageRange: "6-8",
    description: "Look closely at the suspension — each spring is shaped like a coiled cobra ready to strike! Four visible coiled cobra suspension springs hold the massive body high off the ground, heads raised at the top.",
    altText: "Black and white coloring page of a monster truck with suspension springs shaped like coiled cobras",
    prompt: "A monster truck lifted high off the ground with four visible suspension springs, each one shaped like a coiled cobra with the snake's body forming the coils and a raised cobra head at the top of the spring. The coiled cobra springs are the focal point. Side view. Detailed coil and scale line work. Big tires."
  },
  {
    slug: "python-wrap-roll-cage-truck",
    title: "Python Wrap Roll Cage Truck",
    difficulty: "hard", ageRange: "6-8",
    description: "This truck's roll cage is made from bars bent and twisted to look like a giant python snake wrapping around the cab! The python's head rests on top of the cab roof, and the thick body winds around the entire cage structure.",
    altText: "Black and white coloring page of a monster truck with a roll cage shaped like a python snake wrapping around the cab",
    prompt: "A monster truck with a roll cage made of bars shaped like a giant python snake wrapping around the cab exterior. The python's head rests prominently on top of the cab roof with its body winding around all the roll cage bars. The snake wrap is structural and detailed. Side view. Scale texture on the python. Four large tires."
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
  const catId = "cat-cobra-monster-truck-coloring-pages";
  if (!cats.find(c => c.id === catId)) {
    cats.push({ id: catId, slug: "cobra-monster-truck-coloring-pages", name: "Cobra Monster Truck Coloring Pages",
      description: "Free printable cobra monster truck coloring pages for kids ages 2-8. Fang bumpers, cobra hood flares, snake jaw grilles, coiled suspension springs — every truck has real cobra snake features built into the design. Bold outlines, ready to print!",
      type: "theme" });
    fs.writeFileSync(catsPath, JSON.stringify(cats, null, 2));
    console.log("Created Cobra category");
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

  // Create Pinterest board
  console.log("\nCreating Pinterest board...");
  const zippyKey = (process.env.ZIPPY_SCHEDULER_API_KEY || "").trim();
  const boardRes = await fetch("https://www.zippyscheduler.com/api/v1/boards", {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${zippyKey}` },
    body: JSON.stringify({
      account_id: "0d697670-9c73-47a2-b2c8-7595958c9d6b",
      name: "Cobra Monster Truck Coloring Pages",
      description: "Free printable cobra monster truck coloring pages for kids. Fang bumpers, snake jaw grilles, coiled suspension, cobra hood flares and more. Bold outlines, print at home!",
      privacy: "PUBLIC"
    })
  });
  if (!boardRes.ok) {
    console.log(`  Pinterest board creation failed: HTTP ${boardRes.status}`);
  } else {
    const boardData = await boardRes.json();
    const boardId = boardData.id || boardData.board_id || boardData.data?.id;
    console.log(`  Pinterest board created: ${boardId}`);
    if (boardId) {
      const pbPath = path.join(ROOT, "src/data/pinterest-boards.json");
      const pb = JSON.parse(fs.readFileSync(pbPath, "utf8"));
      pb["cat-cobra-monster-truck-coloring-pages"] = boardId;
      fs.writeFileSync(pbPath, JSON.stringify(pb, null, 2));
      console.log("  Added board ID to pinterest-boards.json");
    }
  }

  console.log("\nGenerating pin descriptions...");
  execSync("node scripts/generate-pin-descriptions.mjs", { stdio: "inherit" });

  console.log("\nScheduling pins...");
  execSync("node scripts/schedule-pins.mjs --days=30", { stdio: "inherit" });

  console.log(`\n✅ Cobra collection complete: ${PAGES.length} pages`);
}
main().catch(e => { console.error(e); process.exit(1); });
