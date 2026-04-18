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
    slug: "croc-jaw-bumper-truck",
    title: "Croc Jaw Bumper Truck",
    difficulty: "hard", ageRange: "6-8",
    description: "The front end of this monster truck IS a massive crocodile jaw! The hood forms the upper jaw with huge interlocking teeth along the bottom edge, and a giant lower jaw bumper snaps up to meet it. This is the most fearsome front bumper ever built!",
    altText: "Black and white coloring page of a monster truck with the entire front end shaped like a massive open crocodile jaw with interlocking teeth",
    prompt: "A monster truck where the entire front end is built as a massive open crocodile jaw. The hood forms the upper jaw with a row of large interlocking triangular teeth along its bottom edge. The front bumper is the lower jaw with matching interlocking teeth pointing upward. The jaw is wide open. Side view. Four huge knobby tires."
  },
  {
    slug: "tail-whip-exhaust-truck",
    title: "Tail Whip Exhaust Truck",
    difficulty: "medium", ageRange: "4-6",
    description: "Check out that exhaust! A long curved pipe snakes out from the rear of this truck, shaped exactly like a crocodile tail tapering to a sharp point. When the engine roars, the tail whips!",
    altText: "Black and white coloring page of a monster truck with a long curved crocodile tail shaped exhaust pipe extending from the rear",
    prompt: "A monster truck with a long exhaust pipe extending from the rear of the truck body, shaped and curved like a crocodile tail. The pipe curves upward then sweeps back down, tapering to a pointed tip at the end. The tail has segmented ridges along the top like a crocodile tail. Side view. Big tires."
  },
  {
    slug: "baby-croc-truck",
    title: "Baby Croc Truck",
    difficulty: "easy", ageRange: "2-4",
    description: "How cute is this little croc truck! It has a small rounded snout on the front bumper, two big round friendly eyes sitting on bumps on the hood, and a row of tiny cute teeth on the grille. Super easy and fun to color!",
    altText: "Black and white coloring page of a simple cute monster truck with a small snout on the front, round eyes on the hood, and tiny teeth on the bumper",
    prompt: "A very simple cartoon monster truck with a small rounded snout shape sticking out from the front bumper. Two large round friendly eyes sitting on raised bump shapes on top of the hood. A row of small rounded teeth on the front grille below the snout. Extra thick outlines. Side view. Only 5 to 6 large shapes. Big round tires."
  },
  {
    slug: "armored-croc-back-truck",
    title: "Armored Croc Back Truck",
    difficulty: "hard", ageRange: "6-8",
    description: "The roof and cab of this truck are totally covered in raised crocodile back ridge bumps running front to back in a line! Each bump is a different size — biggest in the middle, smaller at the front and back — just like a real croc spine. Awesome armor!",
    altText: "Black and white coloring page of a monster truck with raised crocodile spine ridge bumps running along the entire cab roof from front to back",
    prompt: "A monster truck where the entire cab roof is covered with a row of raised triangular ridge bumps running front to back down the center, shaped like crocodile back spine plates. The bumps vary in size with the largest in the middle. The bumps are detailed with ridged textures. Side view. Four oversized tires."
  },
  {
    slug: "croc-eye-headlight-truck",
    title: "Croc Eye Headlight Truck",
    difficulty: "medium", ageRange: "4-6",
    description: "This sneaky truck hides its headlights up on raised dome bumps above the hood — just like a crocodile's eyes poking above the water! You can see the lights but the truck stays low and mean.",
    altText: "Black and white coloring page of a monster truck with two headlights sitting on raised dome bumps above the hood like crocodile eyes",
    prompt: "A monster truck with two headlights mounted on top of raised dome-shaped bumps that sit up above the hood surface, like crocodile eyes protruding above the waterline. The main hood is flat and low. The eye-dome headlights are round and prominent. Side view. Wide flat body. Four big tires."
  },
  {
    slug: "snapping-jaw-door-truck",
    title: "Snapping Jaw Door Truck",
    difficulty: "medium", ageRange: "4-6",
    description: "The doors on this truck hinge open at the BOTTOM and swing down like a crocodile's lower jaw dropping! Each door has a row of teeth along the bottom edge. When both doors are open it looks like a croc snapping!",
    altText: "Black and white coloring page of a monster truck with doors that hinge open downward like crocodile lower jaws with teeth along the bottom",
    prompt: "A monster truck shown with both side doors hinged open at the bottom edge, swinging downward like a crocodile's lower jaw dropping open. Each open door has a row of triangular teeth along its bottom edge. The cab opening is wide where the doors have swung down. Side view. Large tires."
  },
  {
    slug: "croc-tooth-grille-truck",
    title: "Croc Tooth Grille Truck",
    difficulty: "easy", ageRange: "2-4",
    description: "This truck has the coolest grille around — a big row of chunky crocodile teeth right across the front! Two small eyes peek out from the hood above. Simple, bold, and totally awesome to color!",
    altText: "Black and white coloring page of a simple monster truck with a row of large crocodile teeth as the front grille and small eyes on the hood",
    prompt: "A very simple cartoon monster truck with a front grille made of a single row of large chunky triangular crocodile teeth pointing upward across the entire front. Two small simple round eyes on top of the hood. Thick clean outlines. Side view. Big simple tires. Easy shapes for young kids."
  },
  {
    slug: "swamp-snorkel-truck",
    title: "Swamp Snorkel Truck",
    difficulty: "medium", ageRange: "4-6",
    description: "This truck is built to cruise through the swamp! It has a super tall snorkel pipe on the roof shaped like a crocodile nostril at the top. The body is extra wide and flat like a croc gliding through the water.",
    altText: "Black and white coloring page of a wide flat monster truck with a tall roof snorkel pipe shaped like a crocodile nostril at the top",
    prompt: "A monster truck with a very wide flat low body shape. A tall vertical snorkel pipe rises from the cab roof, and at the very top the pipe flares open into a nostril shape like a crocodile nose tip. The body is wide and low. Side view. Four large tires."
  },
  {
    slug: "croc-claw-wheels-truck",
    title: "Croc Claw Wheels Truck",
    difficulty: "hard", ageRange: "6-8",
    description: "These wheels are unreal! Every wheel hub has four curved crocodile claw shapes radiating out as spokes. The claws are sharp and curved just like real croc claws. This truck grabs the ground with every spin!",
    altText: "Black and white coloring page of a monster truck with four curved crocodile claw shapes as spokes on each wheel hub",
    prompt: "A monster truck where each of the four wheel hubs has four large curved crocodile claw shapes extending outward as spokes. Each claw is curved, tapered, and detailed with ridges. The claws alternate direction. The tires are large knobby monster truck tires around each claw-spoke hub. Side view."
  },
  {
    slug: "log-jaw-truck",
    title: "Log Jaw Truck",
    difficulty: "easy", ageRange: "2-4",
    description: "This fun truck is shaped like a log with a crocodile head on the front! The long flat body looks like a log floating in the swamp, and the front has a simple croc head with a mouth slightly open. Silly and easy to color!",
    altText: "Black and white coloring page of a simple monster truck shaped like a log with a crocodile head on the front end and a mouth slightly open",
    prompt: "A simple cartoon monster truck with a long wide flat body shaped like a rounded log. The front end has a simple crocodile head shape with a slightly open mouth showing a few teeth. Two small eyes above the mouth. The log body is smooth and rounded. Side view. Four big round tires. Very thick simple outlines for young children."
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
  const catId = "cat-crocodile-monster-truck-coloring-pages";
  if (!cats.find(c => c.id === catId)) {
    cats.push({ id: catId, slug: "crocodile-monster-truck-coloring-pages", name: "Crocodile Monster Truck Coloring Pages",
      description: "Free printable crocodile monster truck coloring pages for kids ages 2-8. Croc jaw bumpers, armored spine roofs, claw-spoke wheels, snorkel pipes — every truck has crocodile design features built right into the body. Bold outlines, ready to print!",
      type: "theme" });
    fs.writeFileSync(catsPath, JSON.stringify(cats, null, 2));
    console.log("Created Crocodile category");
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
  console.log(`\n✅ Crocodile collection complete: ${PAGES.length} pages`);
}
main().catch(e => { console.error(e); process.exit(1); });
