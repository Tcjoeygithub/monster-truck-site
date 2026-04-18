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
    slug: "bull-horn-hood-truck",
    title: "Bull Horn Hood Truck",
    prompt: "A monster truck with a massive set of Texas longhorn steer horns mounted horizontally across the front of the hood. The horns are very long, curving slightly upward, and extend far wider than the truck body on both sides. The horns are mounted on a sturdy bracket on the hood. Side view. Four enormous tires."
  },
  {
    slug: "revolver-exhaust-truck",
    title: "Revolver Exhaust Truck",
    prompt: "A monster truck with two large exhaust pipes shaped exactly like old western revolver barrels, rising up from the hood and pointing backward. Each pipe has the cylindrical barrel shape with the revolver cylinder drum detail visible near the base. Side view. Aggressive stance. Four huge tires."
  }
];

async function generate(slug, prompt) {
  const full = prompt + " " + SUFFIX;
  for (let attempt = 1; attempt <= 5; attempt++) {
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key=${KEY}`,
        { method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contents: [{ parts: [{ text: full }] }], generationConfig: { responseModalities: ["IMAGE", "TEXT"] } }) }
      );
      if (!res.ok) { console.log(`  attempt ${attempt}: HTTP ${res.status}, retrying...`); await new Promise(r=>setTimeout(r,5000)); continue; }
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
    } catch(e) { console.log(`  attempt ${attempt}: ${e.message}, retrying...`); await new Promise(r=>setTimeout(r,5000)); }
  }
  throw new Error("Failed 5 attempts");
}

async function main() {
  for (const p of PAGES) {
    process.stdout.write(`${p.title}... `);
    try {
      const buf = await generate(p.slug, p.prompt);
      console.log(`✓ ${(buf.length/1024).toFixed(0)} KB`);
      execSync(`python3 "${path.join(ROOT,"scripts","frame-image.py")}" "${path.join(IMAGES,p.slug+'.png')}"`, { stdio: "pipe" });
      fs.copyFileSync(path.join(IMAGES, `${p.slug}.png`), path.join(IMAGES, `${p.slug}-thumb.png`));
    } catch(e) { console.log(`✗ ${e.message}`); }
  }
  execSync("python3 scripts/generate-pdfs.py", { stdio: "pipe" });
  console.log("Done.");
}
main().catch(e => { console.error(e); process.exit(1); });
