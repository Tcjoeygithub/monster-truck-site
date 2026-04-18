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
    slug: "yeti-claw-bumper-truck",
    title: "Yeti Claw Bumper Truck",
    difficulty: "hard", ageRange: "6-8",
    description: "Watch out! Two massive yeti claws reach forward from the front bumper, each one tipped with long curved nails. This truck looks ready to swipe through anything that stands in its way!",
    altText: "Black and white coloring page of a monster truck with two massive yeti claw shapes as the front bumper",
    prompt: "A monster truck with two enormous yeti creature claws as the front bumper, each claw has three long curved nails pointing forward. The claws are wide and powerful, gripping the air in front of the truck. Muscular wide body. Side view. Four huge knobby tires."
  },
  {
    slug: "yeti-face-grille-truck",
    title: "Yeti Face Grille Truck",
    difficulty: "medium", ageRange: "4-6",
    description: "The front of this truck is a giant yeti face! A wide open mouth with big flat teeth forms the grille, and the headlights are two round angry yeti eyes glaring at everything ahead.",
    altText: "Black and white coloring page of a monster truck with a yeti face shaped front grille and angry eye headlights",
    prompt: "A monster truck where the entire front grille is shaped like a yeti abominable snowman face. The grille opening forms a wide mouth with large flat teeth. The headlights are two round angry eyes with heavy brow ridges above them. Side view. Four oversized tires."
  },
  {
    slug: "baby-yeti-truck",
    title: "Baby Yeti Truck",
    difficulty: "easy", ageRange: "2-4",
    description: "This little truck is as cute as a baby yeti! It has a round fluffy body shape, big friendly yeti eyes on the front, two tiny rounded horns on the roof, and little mitten shapes on the side mirrors.",
    altText: "Black and white coloring page of a simple cute monster truck with big yeti eyes, tiny horns on roof, and mitten shaped mirrors",
    prompt: "A very simple cartoon monster truck with a rounded fluffy body shape. Big round friendly eyes as headlights on the front. Two small rounded nub horns on top of the cab roof. Small mitten shapes on each side mirror. Side view. Only 5 to 6 large shapes. Extra thick outlines."
  },
  {
    slug: "frozen-fist-bumper-truck",
    title: "Frozen Fist Bumper Truck",
    difficulty: "hard", ageRange: "6-8",
    description: "Two giant yeti fists covered in jagged ice crystal shapes form the front bumper of this beast! Each knuckle is coated in sharp icicle spikes, making this the most dangerous front end on the track.",
    altText: "Black and white coloring page of a monster truck with two giant yeti fists covered in ice crystal shapes as the front bumper",
    prompt: "A monster truck with two massive clenched yeti fists as the front bumper, covered in sharp ice crystal and icicle shapes on the knuckles. The ice forms angular jagged shapes over each fist. Side view. Wide aggressive body. Four huge knobby tires."
  },
  {
    slug: "shaggy-roof-truck",
    title: "Shaggy Roof Truck",
    difficulty: "medium", ageRange: "4-6",
    description: "This truck has a wild yeti mane! Long shaggy fur hangs down from all four edges of the cab roof, draping over the windows like a yeti's wild hair. The longer it gets, the scarier it looks!",
    altText: "Black and white coloring page of a monster truck with long shaggy fur hanging down from the cab roof edges",
    prompt: "A monster truck where the cab roof has long thick shaggy fur or hair hanging down from all edges, like a yeti's wild mane. The strands hang in wavy clumps over the windows on all sides. Side view. Four oversized tires. Bold outlines."
  },
  {
    slug: "yeti-foot-wheels-truck",
    title: "Yeti Foot Wheels Truck",
    difficulty: "easy", ageRange: "2-4",
    description: "Instead of normal wheels, this truck rolls on four giant yeti footprints! Each wheel is shaped like a big flat yeti foot with five wide toes across the top. Simple and super fun to color!",
    altText: "Black and white coloring page of a simple monster truck with giant yeti footprint shaped wheels with big toes",
    prompt: "A simple cartoon monster truck where each of the four wheels is shaped like a giant flat yeti footprint with five wide rounded toes across the top. The feet point outward. Side view. Simple thick outlines for young kids. Plain cab and body."
  },
  {
    slug: "ice-crystal-exhaust-truck",
    title: "Ice Crystal Exhaust Truck",
    difficulty: "medium", ageRange: "4-6",
    description: "This truck's exhaust pipes end in sharp ice crystal and icicle shapes pointing upward! Each pipe splits into a cluster of jagged crystal spikes at the top, like frozen yeti breath shooting into the sky.",
    altText: "Black and white coloring page of a monster truck with exhaust pipes ending in sharp ice crystal and icicle shapes",
    prompt: "A monster truck with two tall exhaust pipes mounted behind the cab. Each pipe top splits into a cluster of sharp angular ice crystal and icicle shapes pointing upward, like frozen spikes. Side view. Standard truck body. Four big tires."
  },
  {
    slug: "yeti-roar-hood-truck",
    title: "Yeti Roar Hood Truck",
    difficulty: "hard", ageRange: "6-8",
    description: "The entire hood of this truck is shaped like a yeti's wide open roaring mouth! Sharp fangs line the front edge, and two large nostril holes on top act as air scoops. This truck screams wild power!",
    altText: "Black and white coloring page of a monster truck with a hood shaped like a yeti roaring mouth with fangs and nostril air scoops",
    prompt: "A monster truck where the hood is sculpted in the shape of a yeti's open roaring mouth seen from above. Sharp fang shapes line the front edge of the hood. Two oval nostril shapes on top of the hood serve as air scoops. Side view. Aggressive wide body. Four huge tires."
  },
  {
    slug: "snowball-cargo-truck",
    title: "Snowball Cargo Truck",
    difficulty: "medium", ageRange: "4-6",
    description: "This truck is hauling a full load of giant snowballs! The truck bed is packed with large round snowball shapes stacked on top of each other, and the cab has two rounded yeti ears on the roof.",
    altText: "Black and white coloring page of a monster truck bed filled with large round snowballs and yeti ears on the cab roof",
    prompt: "A monster truck with an open truck bed loaded with five or six large round snowball shapes piled up and stacked. Two rounded ear shapes on top of the cab roof like yeti ears. Side view. Four big knobby tires. Bold outlines."
  },
  {
    slug: "abominable-spoiler-truck",
    title: "Abominable Spoiler Truck",
    difficulty: "easy", ageRange: "4-6",
    description: "The rear spoiler on this truck is shaped like a giant yeti hand! Five wide fingers spread out across the back of the cab, grabbing the air and keeping this truck glued to the ground.",
    altText: "Black and white coloring page of a simple monster truck with a wide yeti hand shape as the rear spoiler with fingers spread out",
    prompt: "A simple monster truck with a rear spoiler shaped like a large flat yeti hand with five fingers spread wide apart. The hand spoiler sits on top of the back of the cab. Side view. Simple plain truck body. Four big tires. Thick outlines for young kids."
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
  const catId = "cat-yeti-monster-truck-coloring-pages";
  if (!cats.find(c => c.id === catId)) {
    cats.push({ id: catId, slug: "yeti-monster-truck-coloring-pages", name: "Yeti Monster Truck Coloring Pages",
      description: "Free printable yeti monster truck coloring pages for kids ages 2-8. Yeti claw bumpers, frozen fist fronts, shaggy fur roofs, roaring yeti hoods — every truck is built like an abominable snowman. Bold outlines, ready to print!",
      type: "theme" });
    fs.writeFileSync(catsPath, JSON.stringify(cats, null, 2));
    console.log("Created Yeti category");
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
  console.log(`\n✅ Yeti collection complete: ${PAGES.length} pages`);
}
main().catch(e => { console.error(e); process.exit(1); });
