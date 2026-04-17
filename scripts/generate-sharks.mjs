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

const SUFFIX = "Black and white line art ONLY, coloring book style for young children ages 2-8, bold thick clean outlines only, simple shapes, NO COLOR, NO shading, NO gray fill, strictly black outlines on white background, NO text in image, NO border, NO frame, NO rectangle around the artwork, NO drawn box or outline around the edges of the image. The truck floats on a plain white background. The complete monster truck must be fully visible with white margins on all sides.";

const PAGES = [
  {
    slug: "great-white-shark-truck",
    title: "Great White Shark Truck",
    difficulty: "medium", ageRange: "4-6",
    description: "This monster truck has a massive great white shark head as the front end — jaws wide open showing rows of sharp teeth! The truck body is shaped like a shark with a pointed nose and gills on the side panels.",
    altText: "Black and white coloring page of a monster truck shaped like a great white shark with open jaws and sharp teeth",
    prompt: "A monster truck with the front end shaped like a great white shark head with its mouth wide open showing rows of sharp teeth. Gills drawn on the side panels of the truck body. A shark tail fin sticking up from the truck bed. Side view on flat ground. Four big knobby tires."
  },
  {
    slug: "hammerhead-shark-crusher",
    title: "Hammerhead Shark Crusher",
    difficulty: "hard", ageRange: "6-8",
    description: "The wildest truck in the sea! This monster truck has a wide hammerhead shark shape on the hood with eyes on each side. It's crushing a pile of old cars underneath its massive tires!",
    altText: "Black and white coloring page of a monster truck with a hammerhead shark shaped hood crushing cars",
    prompt: "A monster truck with a wide hammerhead shark head mounted on the hood, eyes on the far left and right ends of the hammer shape. The truck is driving over and crushing two small cars underneath. Side view. Big monster truck tires with deep treads."
  },
  {
    slug: "baby-shark-monster-truck",
    title: "Baby Shark Monster Truck",
    difficulty: "easy", ageRange: "2-4",
    description: "The cutest shark truck ever! This simple little monster truck has a friendly shark face with big round eyes, a small fin on top, and a happy smile. Perfect for little hands!",
    altText: "Black and white coloring page of a simple cute cartoon monster truck with a friendly baby shark face",
    prompt: "A very simple cartoon monster truck with a cute friendly shark face on the front. Big round happy eyes, a small smile showing a few teeth, and one small shark fin on the roof. Sitting still facing slightly left. Only 5 to 6 large shapes. Extra thick outlines for toddlers."
  },
  {
    slug: "megalodon-monster-truck",
    title: "Megalodon Monster Truck",
    difficulty: "hard", ageRange: "6-8",
    description: "The biggest shark that ever lived meets the biggest truck on the road! This Megalodon monster truck is absolutely massive with a prehistoric shark jaw as the front bumper and ancient teeth decorations everywhere.",
    altText: "Black and white coloring page of a massive Megalodon prehistoric shark themed monster truck with huge jaws",
    prompt: "A very large monster truck with a massive prehistoric Megalodon shark jaw as the front bumper. Giant ancient shark teeth decorating the sides of the truck body. The truck looks enormous and powerful. Side view on rocky ground. Oversized monster truck tires."
  },
  {
    slug: "shark-fin-racer-truck",
    title: "Shark Fin Racer Truck",
    difficulty: "medium", ageRange: "4-6",
    description: "This sleek racing monster truck has a giant shark fin slicing through the air from the roof! Speed lines trail behind as it races forward with shark stripe patterns on the body.",
    altText: "Black and white coloring page of a racing monster truck with a large shark fin on the roof and speed lines",
    prompt: "A sleek racing monster truck with one large shark dorsal fin on the roof cutting through the air. Shark stripe patterns painted on the side panels. Simple speed lines behind the truck showing it is moving fast. Side view. Four racing-style monster truck tires."
  },
  {
    slug: "shark-jaw-monster-truck",
    title: "Shark Jaw Monster Truck",
    difficulty: "medium", ageRange: "4-6",
    description: "Open wide! This monster truck has a giant shark jaw painted across the entire front and sides — when you look at it head-on, it looks like the truck is about to bite you! Rows of sharp teeth wrap around the body.",
    altText: "Black and white coloring page of a monster truck with shark jaw teeth painted across the front and sides",
    prompt: "A monster truck with a giant open shark mouth painted across the front grille and wrapping around both sides. Rows of sharp shark teeth painted along the bottom edge of the truck body. Front three-quarter view. Big knobby tires."
  },
  {
    slug: "shark-vs-monster-truck",
    title: "Shark vs Monster Truck",
    difficulty: "hard", ageRange: "6-8",
    description: "Epic battle! A giant cartoon shark is leaping out of the water on one side while a monster truck launches off a ramp on the other side. They're about to collide mid-air! Who wins?",
    altText: "Black and white coloring page of a cartoon shark jumping from water facing a monster truck jumping from a ramp",
    prompt: "A big cartoon shark jumping out of water on the left side with water splashing. A monster truck jumping off a dirt ramp on the right side. Both are mid-air facing each other about to collide. Simple waves below the shark."
  },
  {
    slug: "shark-bite-wheels-truck",
    title: "Shark Bite Wheels Truck",
    difficulty: "medium", ageRange: "4-6",
    description: "Check out these crazy wheels! Each tire on this monster truck has shark teeth around the rim, making them look like spinning shark mouths. The truck body has a shark eye painted on each door.",
    altText: "Black and white coloring page of a monster truck with shark teeth shapes around each wheel rim",
    prompt: "A monster truck where each of the four wheels has sharp shark teeth shapes around the outer rim of the tire like a ring of teeth. A shark eye painted on each door panel. Side view on flat ground."
  },
  {
    slug: "deep-sea-shark-truck",
    title: "Deep Sea Shark Truck",
    difficulty: "easy", ageRange: "2-4",
    description: "This fun monster truck is driving underwater! Simple bubble shapes float around it while a friendly shark swims alongside. The truck has a snorkel pipe sticking up from the roof.",
    altText: "Black and white coloring page of a simple monster truck driving underwater with bubbles and a shark friend",
    prompt: "A simple cartoon monster truck driving along the bottom of the ocean with round bubble shapes floating up around it. One friendly cartoon shark swimming next to the truck. A snorkel pipe sticking up from the truck roof. Simple seaweed on the ground. Thick outlines."
  },
  {
    slug: "shark-tooth-trophy-truck",
    title: "Shark Tooth Trophy Truck",
    difficulty: "easy", ageRange: "2-4",
    description: "This champion truck just won the big race! It has a single giant shark tooth mounted on the hood like a trophy, and a checkered flag sticking out the window. Simple and fun to color!",
    altText: "Black and white coloring page of a simple monster truck with a large shark tooth on the hood and a checkered flag",
    prompt: "A simple cartoon monster truck with one large pointed shark tooth standing up on the center of the hood like a trophy. A checkered racing flag sticking out of the driver window. Sitting still, facing right. Thick outlines, simple shapes for young kids."
  }
];

async function generate(prompt) {
  const full = prompt + " " + SUFFIX;
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key=${KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: full }] }],
        generationConfig: { responseModalities: ["IMAGE", "TEXT"] },
      }),
    }
  );
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  for (const p of data.candidates?.[0]?.content?.parts ?? []) {
    if (p.inlineData?.data) return Buffer.from(p.inlineData.data, "base64");
  }
  throw new Error("No image");
}

async function main() {
  fs.mkdirSync(IMAGES, { recursive: true });

  // Generate images
  for (let i = 0; i < PAGES.length; i++) {
    const p = PAGES[i];
    process.stdout.write(`[${i + 1}/10] ${p.title}... `);
    try {
      const buf = await generate(p.prompt);
      fs.writeFileSync(path.join(IMAGES, `${p.slug}.png`), buf);
      console.log(`✓ ${(buf.length / 1024).toFixed(0)} KB`);
    } catch (e) {
      console.log(`✗ ${e.message}`);
    }
  }

  // Frame + watermark + thumb
  console.log("\nFraming + watermarking...");
  for (const p of PAGES) {
    const img = path.join(IMAGES, `${p.slug}.png`);
    if (!fs.existsSync(img)) continue;
    execSync(`python3 "${path.join(ROOT, "scripts", "frame-image.py")}" "${img}"`, { stdio: "pipe" });
    fs.copyFileSync(img, path.join(IMAGES, `${p.slug}-thumb.png`));
  }
  console.log("Done framing");

  // Add category + pages
  const catsPath = path.join(ROOT, "src/data/categories.json");
  const pagesPath = path.join(ROOT, "src/data/coloring-pages.json");
  const cats = JSON.parse(fs.readFileSync(catsPath, "utf8"));
  const pages = JSON.parse(fs.readFileSync(pagesPath, "utf8"));

  const catId = "cat-shark-monster-truck-coloring-pages";
  if (!cats.find((c) => c.id === catId)) {
    cats.push({
      id: catId,
      slug: "shark-monster-truck-coloring-pages",
      name: "Shark Monster Truck Coloring Pages",
      description: "Free printable shark monster truck coloring pages for kids ages 2-8. Great whites, hammerheads, megalodons, and shark-toothed crushers — all on monster trucks with massive wheels. Bold outlines, ready to print and color!",
      type: "theme",
    });
    fs.writeFileSync(catsPath, JSON.stringify(cats, null, 2));
    console.log("Created Shark category");
  }

  const now = new Date().toISOString();
  const today = now.split("T")[0];
  for (const p of PAGES) {
    if (pages.find((x) => x.slug === p.slug)) continue;
    pages.push({
      id: `page-${p.slug.slice(0, 8)}-${Date.now().toString(36).slice(-4)}`,
      slug: p.slug,
      title: p.title,
      description: p.description,
      metaDescription: `Free printable ${p.title} coloring page for kids. Bold outlines, easy to color. Download and print for free!`,
      altText: p.altText,
      imagePath: `/images/coloring-pages/${p.slug}.png`,
      thumbnailPath: `/images/coloring-pages/${p.slug}-thumb.png`,
      categoryIds: [catId],
      difficulty: p.difficulty,
      ageRange: p.ageRange,
      status: "published",
      featured: false,
      publishDate: today,
      createdAt: now,
      updatedAt: now,
    });
  }
  fs.writeFileSync(pagesPath, JSON.stringify(pages, null, 2));

  // Generate PDFs
  console.log("Generating PDFs...");
  execSync("python3 scripts/generate-pdfs.py", { stdio: "pipe" });

  console.log(`\n✅ Shark collection complete: ${PAGES.length} pages`);
}

main().catch((e) => { console.error(e); process.exit(1); });
