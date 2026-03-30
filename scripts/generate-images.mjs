import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const OUT_DIR = path.join(ROOT, "public/images/coloring-pages");

// Load API key from .env.local
const envFile = fs.readFileSync(path.join(ROOT, ".env.local"), "utf-8");
const apiKey = envFile.match(/GOOGLE_IMAGEN_API_KEY=(.+)/)?.[1]?.trim();
if (!apiKey) {
  console.error("Missing GOOGLE_IMAGEN_API_KEY in .env.local");
  process.exit(1);
}

const BASE_PROMPT =
  "Black and white line art, coloring book style, bold clean outlines, simple enough for children ages 2-8, monster truck theme, no text in image, no shading, no gray fill, white background.";

const pages = [
  {
    name: "skull-crusher",
    prompt: `A fearsome monster truck with a giant skull design on the hood, massive spiked tires, and an aggressive front grille. The truck is posed at a slight angle showing its powerful stance. ${BASE_PROMPT}`,
  },
  {
    name: "dirt-rampage",
    prompt: `A powerful monster truck racing through a mud pit, kicking up chunks of dirt and mud behind it. The truck has rugged off-road tires and a muscular body. Action pose with motion lines. ${BASE_PROMPT}`,
  },
  {
    name: "bone-rattler",
    prompt: `A monster truck doing a dramatic backflip in mid-air above a stadium. The truck body has bone and skeleton decorations on its panels. Large crowd-filled arena below. Dynamic freestyle trick pose. ${BASE_PROMPT}`,
  },
  {
    name: "thunder-flame",
    prompt: `A racing monster truck covered in flame decals along the sides and hood. The truck is speeding down a dirt track with dust trailing behind. Sleek racing design with number on the side. ${BASE_PROMPT}`,
  },
  {
    name: "mega-stomp",
    prompt: `A massive Bigfoot-style monster truck with enormously oversized tires crushing a small car beneath it. The truck towers over everything with a bold, simple design. Front-facing view showing its dominance. ${BASE_PROMPT}`,
  },
  {
    name: "night-terror",
    prompt: `A spooky monster truck with glowing headlight eyes, a menacing grille that looks like teeth, and huge knobby off-road tires. The truck has a dark haunted theme with bat wing decorations on the roof. ${BASE_PROMPT}`,
  },
];

async function generateImage(prompt) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-generate-001:predict?key=${apiKey}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      instances: [{ prompt }],
      parameters: { sampleCount: 1 },
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`API error ${res.status}: ${err}`);
  }

  const data = await res.json();
  return Buffer.from(data.predictions[0].bytesBase64Encoded, "base64");
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  for (const page of pages) {
    const outPath = path.join(OUT_DIR, `${page.name}.png`);
    const thumbPath = path.join(OUT_DIR, `${page.name}-thumb.png`);

    console.log(`Generating: ${page.name}...`);
    try {
      const imageBuffer = await generateImage(page.prompt);
      fs.writeFileSync(outPath, imageBuffer);
      // Use same image for thumbnail (Next.js Image component handles resizing)
      fs.writeFileSync(thumbPath, imageBuffer);
      console.log(`  Saved: ${outPath} (${(imageBuffer.length / 1024).toFixed(0)} KB)`);
    } catch (err) {
      console.error(`  FAILED: ${page.name} - ${err.message}`);
    }
  }

  console.log("\nDone! Updating coloring-pages.json to use .png extensions...");

  // Update the JSON data to point to .png files
  const dataPath = path.join(ROOT, "src/data/coloring-pages.json");
  let data = fs.readFileSync(dataPath, "utf-8");
  data = data.replace(/\.svg/g, ".png");
  fs.writeFileSync(dataPath, data);
  console.log("Updated coloring-pages.json");
}

main();
