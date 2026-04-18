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
    slug: "samurai-helmet-cab-truck",
    title: "Samurai Helmet Cab Truck",
    difficulty: "hard", ageRange: "6-8",
    description: "The entire cab of this incredible truck is shaped like a samurai kabuto helmet! A bold crescent moon crest rises from the top, and the side panels have the sweeping neck guard flaps of a real warrior's helmet. The most epic samurai truck ever built!",
    altText: "Black and white coloring page of a monster truck with the cab shaped like a samurai kabuto helmet with a crescent moon crest on top",
    prompt: "A monster truck where the entire cab is shaped like a samurai kabuto helmet. The roof of the cab has a large crescent moon crest rising up from the center top. The side panels of the cab flare outward at the bottom like the neck guard (shikoro) of a real samurai helmet with layered flaps. The front windshield sits recessed inside the face opening of the helmet. Side view. Four huge knobby monster truck tires."
  },
  {
    slug: "katana-blade-spoiler-truck",
    title: "Katana Blade Spoiler Truck",
    difficulty: "medium", ageRange: "4-6",
    description: "This truck has the most amazing spoiler you have ever seen — it is shaped exactly like a curved katana sword blade! The long sweeping rear spoiler curves upward at the tip just like a real katana, and the truck body is sleek and powerful.",
    altText: "Black and white coloring page of a monster truck with a rear spoiler shaped like a curved katana sword blade",
    prompt: "A monster truck with a rear spoiler shaped exactly like a long curved katana sword blade. The spoiler extends from the back of the cab and curves gracefully upward at the tip like a real katana. The blade has a visible edge detail along one side. The truck body is wide and muscular. Side view. Four oversized knobby tires."
  },
  {
    slug: "baby-samurai-truck",
    title: "Baby Samurai Truck",
    difficulty: "easy", ageRange: "2-4",
    description: "The cutest warrior truck around! This adorable little monster truck has a tiny samurai helmet shape on the roof, two small sword shapes as antennas sticking up, and big round friendly eyes. Perfectly simple and fun to color!",
    altText: "Black and white coloring page of a simple cute monster truck with a small samurai helmet on the roof and two tiny sword antennas",
    prompt: "A very simple cartoon monster truck with a small samurai helmet shape sitting on top of the cab roof. Two tiny straight sword shapes as antennas sticking up from the front corners of the cab. Big round friendly eyes as headlights. A simple wide smile grille. Side view. Only 5 to 6 large shapes total. Extra thick outlines. Very cute and friendly."
  },
  {
    slug: "samurai-armor-fender-truck",
    title: "Samurai Armor Fender Truck",
    difficulty: "hard", ageRange: "6-8",
    description: "Every fender on this truck is shaped like layered samurai shoulder armor! The overlapping plate segments of the sode shoulder guards wrap around each wheel arch, giving this monster truck the look of a fully armored samurai warrior ready for battle.",
    altText: "Black and white coloring page of a monster truck with fenders shaped like layered samurai shoulder armor plates with overlapping segments",
    prompt: "A monster truck where all four fenders are shaped like layered samurai shoulder armor plates called sode. Each fender has multiple overlapping horizontal plate segments stacked downward like real samurai armor. The plates have visible rivet detail along the edges. The fenders flare wide over the huge tires. Side view. Four massive knobby tires visible beneath the armored fenders."
  },
  {
    slug: "war-fan-bumper-truck",
    title: "War Fan Bumper Truck",
    difficulty: "medium", ageRange: "4-6",
    description: "The front bumper of this truck is spread open like a Japanese war fan! The tessen battle fan fans out wide across the entire front of the truck with all its folded ribs visible. A truly unique and powerful monster truck design!",
    altText: "Black and white coloring page of a monster truck with a front bumper shaped like an open Japanese war fan spread wide",
    prompt: "A monster truck with a front bumper shaped like a fully open Japanese war fan called a tessen. The fan spreads wide across the entire front of the truck with all the individual fan ribs radiating outward from the center pivot point. The fan edge forms a wide arc across the front. The cab sits behind the fan bumper. Side-front three-quarter view. Four huge knobby tires."
  },
  {
    slug: "samurai-mask-grille-truck",
    title: "Samurai Mask Grille Truck",
    difficulty: "medium", ageRange: "4-6",
    description: "Stare into the fierce face of this monster truck! The entire front grille is shaped like a menacing samurai war mask called a menpo. Angry eyes above the grille opening, a fierce nose bridge, and a grimacing expression make this truck look truly fearsome.",
    altText: "Black and white coloring page of a monster truck with the front grille shaped like a menacing samurai war mask with a fierce expression",
    prompt: "A monster truck where the entire front end is shaped like a samurai menpo war mask with a fierce and menacing expression. Angry furrowed brow ridges above the headlights. A prominent nose bridge shape in the center. The grille opening forms the grimacing mouth with visible teeth shapes. Fierce cheekbone shapes on the sides. Front three-quarter view. Four large knobby tires."
  },
  {
    slug: "dual-katana-exhaust-truck",
    title: "Dual Katana Exhaust Truck",
    difficulty: "medium", ageRange: "4-6",
    description: "Two exhaust pipes rise up behind the cab and cross each other in an X formation, shaped just like crossed katana swords! When the engine roars, smoke pours out from the tips of the crossed blades like the breath of a samurai warrior.",
    altText: "Black and white coloring page of a monster truck with two exhaust pipes shaped like crossed katana swords forming an X behind the cab",
    prompt: "A monster truck with two exhaust pipes rising up from behind the cab that are shaped like katana sword blades. The two blade-shaped exhausts cross each other to form a large X shape above the cab roof. Each exhaust has a distinct sword blade profile with a guard shape at the base where it meets the cab. Side view. Four huge knobby tires."
  },
  {
    slug: "samurai-banner-truck",
    title: "Samurai Banner Truck",
    difficulty: "easy", ageRange: "2-4",
    description: "This brave truck carries its battle flag into every arena! A tall straight pole stands in the truck bed and flies a rectangular samurai banner flag. The simple truck body is easy to color and the bold flag is the perfect place to add your own design!",
    altText: "Black and white coloring page of a simple monster truck with a tall flag pole in the truck bed flying a rectangular samurai banner",
    prompt: "A very simple cartoon monster truck with an open truck bed. A tall straight pole stands upright in the center of the truck bed. A rectangular flag or banner hangs from the top of the pole with a simple rectangular shape. The truck body is very simple with basic shapes. Side view. Only 5 to 6 large shapes total. Extra thick outlines. The flag panel is blank and ready to decorate."
  },
  {
    slug: "shogun-shield-truck",
    title: "Shogun Shield Truck",
    difficulty: "hard", ageRange: "6-8",
    description: "The entire front end of this massive truck is a giant round samurai shield! The large circular tate shield covers the whole front with a bold crest emblem in the very center. This truck is armored up and ready to charge into battle!",
    altText: "Black and white coloring page of a monster truck with the entire front end shaped like a large round samurai shield with a crest emblem in the center",
    prompt: "A monster truck where the entire front end is a large round samurai shield called a tate. The circular shield face is flat and extends wider than the truck body on both sides. In the center of the shield is a bold simple crest emblem shape such as a circular mon design. The cab peeks out behind the top edge of the shield. Front three-quarter view. Four massive knobby tires visible on the sides."
  },
  {
    slug: "rising-sun-wheels-truck",
    title: "Rising Sun Wheels Truck",
    difficulty: "easy", ageRange: "2-4",
    description: "This cheerful truck has special wheels where every spoke radiates outward like the rays of the rising sun! A small samurai helmet shape sits on the hood like a proud hood ornament. Simple, bold, and really fun to color!",
    altText: "Black and white coloring page of a simple monster truck with wheel spokes radiating like sun rays and a small helmet shape on the hood",
    prompt: "A very simple cartoon monster truck with four large wheels where the spokes radiate outward from the center hub like sun rays in all directions. Each wheel has 8 to 10 straight spokes radiating outward like a sunburst. A small simple samurai helmet shape sits as a hood ornament on the center of the hood. Simple boxy truck body. Side view. Extra thick outlines. Only 5 to 6 large shapes total."
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
  const catId = "cat-samurai-monster-truck-coloring-pages";
  if (!cats.find(c => c.id === catId)) {
    cats.push({ id: catId, slug: "samurai-monster-truck-coloring-pages", name: "Samurai Monster Truck Coloring Pages",
      description: "Free printable samurai monster truck coloring pages for kids ages 2-8. Kabuto helmet cabs, katana spoilers, war fan bumpers, samurai mask grilles — every truck is built like an ancient warrior. Bold outlines, ready to print!",
      type: "theme" });
    fs.writeFileSync(catsPath, JSON.stringify(cats, null, 2));
    console.log("Created Samurai category");
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
  console.log(`\n✅ Samurai collection complete: ${PAGES.length} pages`);
}
main().catch(e => { console.error(e); process.exit(1); });
