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
    slug: "tentacle-bumper-truck",
    title: "Tentacle Bumper Truck",
    difficulty: "hard", ageRange: "6-8",
    description: "Four thick octopus tentacles curl forward from the front bumper like battering rams! Each tentacle is covered in suction cup circles and curls at the tip. This truck crashes through anything in its path.",
    altText: "Black and white coloring page of a monster truck with four thick octopus tentacles as the front bumper",
    prompt: "A monster truck with four thick octopus tentacles extending forward from the front bumper, each tentacle covered in round suction cup shapes and curling at the tip. The tentacles act as battering rams. Side view. Four huge knobby tires. Muscular wide truck body."
  },
  {
    slug: "suction-cup-wheels-truck",
    title: "Suction Cup Wheels Truck",
    difficulty: "medium", ageRange: "4-6",
    description: "Check out those crazy tires! Instead of normal treads, every tire is covered in large round suction cup shapes. This monster truck could climb walls! Big bold suction cups cover every inch.",
    altText: "Black and white coloring page of a monster truck with large suction cup shapes covering all four tires",
    prompt: "A monster truck where all four large tires are covered in big round suction cup shapes instead of normal tire treads. Each suction cup is a large circle with a smaller circle inside. The tires look bumpy with suction cups all around. Side view. Standard truck cab and body."
  },
  {
    slug: "baby-octopus-truck",
    title: "Baby Octopus Truck",
    difficulty: "easy", ageRange: "2-4",
    description: "Meet the cutest little monster truck! The cab is shaped like a big round octopus head with two giant friendly eyes. Small stubby tentacles stick out from the front bumper. Simple shapes, perfect for little colorers!",
    altText: "Black and white coloring page of a simple cute monster truck with a round octopus head cab and small tentacle bumper",
    prompt: "A very simple cartoon monster truck with the cab shaped like a big round octopus head dome. Two very large round friendly eyes on the front of the cab. Four short stubby tentacle shapes sticking out from the front bumper. Side view. Only 5 to 6 large shapes total. Extra thick outlines for young kids."
  },
  {
    slug: "eight-exhaust-truck",
    title: "Eight Exhaust Truck",
    difficulty: "hard", ageRange: "6-8",
    description: "Eight exhaust pipes fan out behind the cab like octopus arms spreading in all directions! Each pipe curves and bends like a curling tentacle. When the engine roars, all eight blast smoke at once!",
    altText: "Black and white coloring page of a monster truck with eight exhaust pipes fanned out like octopus arms behind the cab",
    prompt: "A monster truck with eight exhaust pipes mounted behind the cab, fanned out in all directions like octopus arms spreading wide. Each pipe curves and bends like a tentacle. The pipes vary in angle pointing left, right, up, and diagonally outward. Side view. Four massive tires."
  },
  {
    slug: "octopus-wrap-truck",
    title: "Octopus Wrap Truck",
    difficulty: "hard", ageRange: "6-8",
    description: "Two giant tentacles wrap all the way around this truck from back to front! They coil around the body, grip the hood, and curl around the front fenders. The truck is locked in an octopus grip!",
    altText: "Black and white coloring page of a monster truck with two long octopus tentacles wrapping around the entire truck body",
    prompt: "A monster truck with two very long thick octopus tentacles wrapping around the entire truck body from the rear to the front. One tentacle wraps over the roof and grips the hood. The other wraps under the body and curls around the front fender. Both tentacles have suction cup shapes along them. Side view. Big tires visible."
  },
  {
    slug: "ink-jet-exhaust-truck",
    title: "Ink Jet Exhaust Truck",
    difficulty: "medium", ageRange: "4-6",
    description: "This truck has a wild exhaust system shaped like an octopus ink jet siphon! A wide flat nozzle on the rear blasts exhaust in a broad cone shape, just like how an octopus squirts ink to escape. Cool!",
    altText: "Black and white coloring page of a monster truck with a wide flat octopus ink jet siphon shaped exhaust nozzle on the rear",
    prompt: "A monster truck with a wide flat exhaust nozzle on the rear shaped like an octopus ink siphon tube, broad and funnel-shaped pointing backward. The exhaust nozzle is wide and flat like an octopus siphon. Side view. Four large tires. Standard truck cab and body with the unique rear exhaust feature."
  },
  {
    slug: "dome-head-cab-truck",
    title: "Dome Head Cab Truck",
    difficulty: "medium", ageRange: "4-6",
    description: "The cab on this truck is shaped like a smooth round octopus head dome — bulging, tall, and perfectly rounded on top! The windshield fits into the curved front face of the dome. Strangely awesome!",
    altText: "Black and white coloring page of a monster truck with a smooth round dome shaped cab like an octopus head",
    prompt: "A monster truck with the cab shaped like a smooth bulging round octopus head dome, very tall and rounded on top with no flat surfaces. The windshield is set into the curved front face of the dome. The dome cab is wide and smooth. Side view. Four big tires. The dome shape is the main feature."
  },
  {
    slug: "tentacle-tow-hook-truck",
    title: "Tentacle Tow Hook Truck",
    difficulty: "easy", ageRange: "2-4",
    description: "This truck has a curling tentacle as its rear tow hook! The tentacle curves back on itself like a hook ready to latch on. Two little octopus eyes glow as the taillights. Simple and fun to color!",
    altText: "Black and white coloring page of a simple monster truck with a curling tentacle tow hook and octopus eye taillights",
    prompt: "A simple cartoon monster truck with a single curling octopus tentacle shape as the rear tow hook, curving back on itself like a hook. Two small round octopus eye shapes as the taillights on the rear. Side view. Thick simple outlines for young kids. Standard large tires. Only a few large simple shapes."
  },
  {
    slug: "kraken-grip-truck",
    title: "Kraken Grip Truck",
    difficulty: "medium", ageRange: "4-6",
    description: "The Kraken grips the road! Two large thick tentacles extend down from the front bumper and grip the ground, as if the truck is pulling itself forward with pure octopus strength. What a beast!",
    altText: "Black and white coloring page of a monster truck with two large tentacles reaching down from the front bumper gripping the ground",
    prompt: "A monster truck with two large thick octopus tentacles extending downward from the front bumper, reaching the ground and gripping it with suction cups pressed flat on the ground surface. The tentacles look like they are pulling the truck forward. Side view. Four big tires. The gripping tentacles are the main front feature."
  },
  {
    slug: "octopus-crown-truck",
    title: "Octopus Crown Truck",
    difficulty: "easy", ageRange: "2-4",
    description: "This truck wears an octopus crown! Eight short stubby tentacle shapes stick straight up from the roof like a crown with eight points. Simple, bold, and perfect for little kids to color. The king of the mud pit!",
    altText: "Black and white coloring page of a simple monster truck with eight short tentacle shapes sticking up from the roof like a crown",
    prompt: "A simple cartoon monster truck with eight short stubby tentacle shapes sticking straight up from the roof of the cab, arranged in a row like a crown. Each tentacle is short and rounded. The truck is a simple basic shape. Side view. Extra thick outlines. Only a few large simple shapes. Big round tires."
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
  const catId = "cat-octopus-monster-truck-coloring-pages";
  if (!cats.find(c => c.id === catId)) {
    cats.push({ id: catId, slug: "octopus-monster-truck-coloring-pages", name: "Octopus Monster Truck Coloring Pages",
      description: "Free printable octopus monster truck coloring pages for kids ages 2-8. Tentacle bumpers, suction cup tires, dome head cabs, kraken grips — every truck is built with octopus features. Bold outlines, ready to print!",
      type: "theme" });
    fs.writeFileSync(catsPath, JSON.stringify(cats, null, 2));
    console.log("Created Octopus category");
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
  console.log(`\n✅ Octopus collection complete: ${PAGES.length} pages`);
}
main().catch(e => { console.error(e); process.exit(1); });
