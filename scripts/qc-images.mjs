import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const OUT_DIR = path.join(ROOT, "public/images/coloring-pages");

// --- Print-fit constants ---
// US Letter at 150 DPI (good quality for coloring pages, reasonable file size)
const TARGET_DPI = 150;
const LETTER_WIDTH_IN = 8;    // 8.5 minus 0.25in margins on each side
const LETTER_HEIGHT_IN = 10.5; // 11 minus 0.25in margins on each side
const TARGET_WIDTH = Math.round(LETTER_WIDTH_IN * TARGET_DPI);   // 1200px
const TARGET_HEIGHT = Math.round(LETTER_HEIGHT_IN * TARGET_DPI); // 1575px
const MIN_WIDTH = 1000;  // Reject images smaller than this
const MIN_HEIGHT = 1000;

// Load API key
const envFile = fs.readFileSync(path.join(ROOT, ".env.local"), "utf-8");
const apiKey = envFile.match(/GOOGLE_IMAGEN_API_KEY=(.+)/)?.[1]?.trim();
if (!apiKey) {
  console.error("Missing GOOGLE_IMAGEN_API_KEY in .env.local");
  process.exit(1);
}

const GEMINI_MODEL = "gemini-2.5-flash";

const QC_PROMPT = `You are a quality control expert for children's coloring book pages (ages 2-8).

Analyze this image and score it on the following criteria. Each score is 1-10.

1. **SIMPLICITY** (1=way too complex, 10=perfectly simple for kids)
   - Are outlines bold and clean?
   - Is the level of detail appropriate for ages 2-8?
   - Are there areas that are too busy, too many tiny details, or complex backgrounds (like detailed crowds, buildings, scenery)?
   - Would a 4-year-old be able to color most of this without frustration?

2. **ANATOMICAL_CORRECTNESS** (1=major errors, 10=everything looks right)
   - Are the wheels/tires in the correct position?
   - Does the truck body look structurally correct?
   - Are proportions reasonable for a monster truck?
   - Are there any weird AI artifacts like extra limbs, merged objects, floating parts?

3. **COLORING_FRIENDLINESS** (1=impossible to color, 10=perfect for coloring)
   - Are the enclosed areas large enough for small hands to color in?
   - Are outlines thick and well-defined?
   - Is the image mostly white space bounded by black lines?
   - Is there any gray shading or fill that shouldn't be there?

4. **ENGAGEMENT** (1=boring, 10=kids would love it)
   - Does the truck look cool/exciting?
   - Is there a sense of action or personality?
   - Would a monster-truck-loving kid be excited to color this?

5. **PRINT_QUALITY** (1=won't print well, 10=perfect for printing)
   - Clean white background?
   - No text or watermarks in the image?
   - Would this look good printed on a standard 8.5x11 page?

6. **FRAMING** (1=badly cut off, 10=perfectly framed) — THIS IS CRITICAL
   - Is the ENTIRE truck visible within the image? Check ALL of these:
     - Are all 4 tires/wheels FULLY visible and not cut off at the edges?
     - Is the top of the truck (roof, exhaust pipes, any decorations) FULLY visible and not cropped?
     - Is the front bumper/grille FULLY visible and not cut off at the left or right edge?
     - Is the rear of the truck FULLY visible and not cut off?
     - Are any parts of the truck touching or going past the edge of the image?
   - Is there a visible margin/padding of white space between the truck and ALL four edges of the image?
   - Score 1-4 if ANY part of the truck is cut off or touches an edge
   - Score 5-6 if the truck is fully visible but very close to an edge (less than 5% margin)
   - Score 7-8 if there is adequate margin on all sides
   - Score 9-10 if the truck is perfectly centered with generous white space margins on all sides

Respond in EXACTLY this JSON format and nothing else:
{
  "simplicity": <score>,
  "anatomical_correctness": <score>,
  "coloring_friendliness": <score>,
  "engagement": <score>,
  "print_quality": <score>,
  "framing": <score>,
  "overall": <average of all 6 scores rounded to 1 decimal>,
  "pass": <true if ALL individual scores >= 6 AND overall >= 7>,
  "issues": ["list of specific problems found"],
  "suggestions": ["specific prompt improvements to fix the issues"]
}`;

const BASE_PROMPT =
  "Black and white line art, coloring book style for young children ages 2-8, bold thick clean outlines only, very simple shapes, NO shading, NO gray fill, NO complex backgrounds, NO crowds, NO tiny details, NO text in image, pure white background, minimal background elements, large colorable areas. CRITICAL FRAMING RULE: The ENTIRE truck must be fully visible inside the image with generous white space margins on ALL four sides. Nothing should be cut off or touch any edge of the image. Leave at least 10% white space padding between the truck and every edge. The truck should be centered in the frame.";

const PAGES = [
  {
    name: "skull-crusher",
    prompt: `A simple monster truck with a big skull shape on the front of the hood. Huge round tires with basic tread pattern. Truck shown from a 3/4 front angle. Keep the design very simple with just the truck centered on white background, no other objects. The complete truck including all tires and the full roof must be visible with white space around it. ${BASE_PROMPT}`,
  },
  {
    name: "dirt-rampage",
    prompt: `A monster truck with big round tires driving through mud. A few simple mud splashes around the tires. Truck shown from the side. Very simple design, no background scenery, just the truck and a few mud splashes. The entire truck from front bumper to rear must be fully visible with margins on all sides. ${BASE_PROMPT}`,
  },
  {
    name: "bone-rattler",
    prompt: `A monster truck jumping in the air with all four wheels off the ground. Simple bone shapes decorating the side panels. The truck is the only element, no background, no stadium, no crowd. Just the truck in mid-air centered in the frame with plenty of white space around it on all sides. All four wheels must be fully visible. ${BASE_PROMPT}`,
  },
  {
    name: "thunder-flame",
    prompt: `A monster truck with simple flame designs along the sides. The truck is shown from the side, racing forward. Simple speed lines behind it. No track, no background, just the truck with flame decals. The entire truck from front to back must be fully visible and centered with white space margins. ${BASE_PROMPT}`,
  },
  {
    name: "mega-stomp",
    prompt: `A massive Bigfoot-style monster truck shown from a 3/4 side angle with enormously oversized round tires that are taller than a person. The truck is very tall and imposing, drawn small enough that the COMPLETE truck fits comfortably inside the image with lots of white space around it. Simple bold design, no background. Every single part of the truck including the very bottom of every tire and the very top of the roof must be fully visible with at least 15% white padding on every side. ${BASE_PROMPT}`,
  },
  {
    name: "night-terror",
    prompt: `A monster truck with headlights that look like angry eyes and a front grille that looks like monster teeth. Big knobby round tires. Simple spooky design, just the truck from a front-angled view. No background elements. The ENTIRE truck must be fully visible and centered in the frame with generous white space padding on all four sides. No part of the truck should be cut off or touch the edge. ${BASE_PROMPT}`,
  },
];

async function analyzeImage(imagePath) {
  const imageData = fs.readFileSync(imagePath);
  const base64 = imageData.toString("base64");

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            { text: QC_PROMPT },
            {
              inlineData: {
                mimeType: "image/png",
                data: base64,
              },
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.1,
        maxOutputTokens: 4096,
      },
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Gemini API error ${res.status}: ${err}`);
  }

  const data = await res.json();
  const text = data.candidates[0].content.parts.map((p) => p.text || "").join("");

  // Extract JSON from response (handle markdown code blocks)
  // Use a greedy match that finds the last closing brace to get the full object
  const cleaned = text.replace(/```json\s*/g, "").replace(/```\s*/g, "");
  const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error(`Could not parse QC response: ${text}`);

  try {
    return JSON.parse(jsonMatch[0]);
  } catch {
    throw new Error(`Invalid JSON in QC response: ${jsonMatch[0].slice(0, 200)}...`);
  }
}

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
    throw new Error(`Imagen API error ${res.status}: ${err}`);
  }

  const data = await res.json();
  return Buffer.from(data.predictions[0].bytesBase64Encoded, "base64");
}

// --- Print-fit check: resize image to fit US Letter portrait ---
function getImageDimensions(imagePath) {
  try {
    const out = execSync(`sips -g pixelWidth -g pixelHeight "${imagePath}" 2>/dev/null`, {
      encoding: "utf-8",
    });
    const w = parseInt(out.match(/pixelWidth:\s*(\d+)/)?.[1] || "0");
    const h = parseInt(out.match(/pixelHeight:\s*(\d+)/)?.[1] || "0");
    return { width: w, height: h };
  } catch {
    return { width: 0, height: 0 };
  }
}

function resizeForPrint(imagePath) {
  const { width, height } = getImageDimensions(imagePath);
  if (width === 0 || height === 0) {
    console.log(`    Could not read dimensions for ${imagePath}`);
    return false;
  }

  console.log(`    Current: ${width}x${height}`);

  if (width < MIN_WIDTH || height < MIN_HEIGHT) {
    console.log(`    WARN: Image too small (${width}x${height}), minimum is ${MIN_WIDTH}x${MIN_HEIGHT}`);
    return false;
  }

  // Calculate the fit: image should fit within TARGET_WIDTH x TARGET_HEIGHT
  // while maintaining aspect ratio and centering on a white canvas
  const scaleW = TARGET_WIDTH / width;
  const scaleH = TARGET_HEIGHT / height;
  const scale = Math.min(scaleW, scaleH);

  const newW = Math.round(width * scale);
  const newH = Math.round(height * scale);

  // Pad to exact letter-portrait dimensions with white background
  const padX = Math.round((TARGET_WIDTH - newW) / 2);
  const padY = Math.round((TARGET_HEIGHT - newH) / 2);

  // Use sips to resize, then use a canvas approach with sips padColor
  // Step 1: Resize image to fit
  execSync(`sips --resampleWidth ${newW} --resampleHeight ${newH} "${imagePath}" 2>/dev/null`);
  // Step 2: Pad to exact letter dimensions with white
  execSync(
    `sips --padToHeightWidth ${TARGET_HEIGHT} ${TARGET_WIDTH} --padColor FFFFFF "${imagePath}" 2>/dev/null`
  );

  const final = getImageDimensions(imagePath);
  console.log(`    Resized: ${final.width}x${final.height} (fits US Letter at ${TARGET_DPI} DPI)`);
  return true;
}

// Verify final image will print on exactly 1 page
function verifyPrintFit(imagePath) {
  const { width, height } = getImageDimensions(imagePath);

  // Image should be portrait or square (height >= width)
  // and should be exactly our target dimensions after processing
  if (width !== TARGET_WIDTH || height !== TARGET_HEIGHT) {
    console.log(`    Print-fit FAIL: ${width}x${height} (expected ${TARGET_WIDTH}x${TARGET_HEIGHT})`);
    return false;
  }

  // At target DPI, this prints at exactly LETTER_WIDTH_IN x LETTER_HEIGHT_IN inches
  const printW = (width / TARGET_DPI).toFixed(1);
  const printH = (height / TARGET_DPI).toFixed(1);
  console.log(`    Print-fit OK: prints at ${printW}" x ${printH}" on letter paper`);
  return true;
}

const MAX_ATTEMPTS = 3;
const MIN_SCORE = 7;

async function main() {
  const results = [];
  const onlyPage = process.argv[2]; // optional: pass a specific page name

  for (const page of PAGES) {
    if (onlyPage && page.name !== onlyPage) continue;

    const imagePath = path.join(OUT_DIR, `${page.name}.png`);
    const thumbPath = path.join(OUT_DIR, `${page.name}-thumb.png`);

    if (!fs.existsSync(imagePath)) {
      console.log(`\n[${page.name}] No image found, generating first...`);
      const buf = await generateImage(page.prompt);
      fs.writeFileSync(imagePath, buf);
      fs.writeFileSync(thumbPath, buf);
    }

    let attempt = 0;
    let passed = false;

    while (attempt < MAX_ATTEMPTS && !passed) {
      attempt++;
      console.log(`\n[${page.name}] QC check (attempt ${attempt}/${MAX_ATTEMPTS})...`);

      const qc = await analyzeImage(imagePath);

      console.log(`  Simplicity:     ${qc.simplicity}/10`);
      console.log(`  Anatomy:        ${qc.anatomical_correctness}/10`);
      console.log(`  Color-friendly: ${qc.coloring_friendliness}/10`);
      console.log(`  Engagement:     ${qc.engagement}/10`);
      console.log(`  Print quality:  ${qc.print_quality}/10`);
      console.log(`  Framing:        ${qc.framing}/10`);
      console.log(`  OVERALL:        ${qc.overall}/10 ${qc.pass ? "PASS" : "FAIL"}`);

      if (qc.issues.length > 0) {
        console.log(`  Issues: ${qc.issues.join("; ")}`);
      }

      if (qc.pass && qc.overall >= MIN_SCORE) {
        // Print-fit check: resize to US Letter portrait
        console.log(`  Print-fit check...`);
        resizeForPrint(imagePath);
        const printOk = verifyPrintFit(imagePath);
        if (!printOk) {
          console.log(`  Print-fit failed — image may not print on a single page`);
        }
        // Also resize the thumbnail copy
        fs.copyFileSync(imagePath, thumbPath);

        passed = true;
        results.push({ name: page.name, status: "PASS", attempts: attempt, score: qc.overall });
      } else if (attempt < MAX_ATTEMPTS) {
        console.log(`  Regenerating with tightened prompt...`);

        // Build a refined prompt incorporating the QC suggestions
        let refinedPrompt = page.prompt;
        if (qc.suggestions.length > 0) {
          const fixes = qc.suggestions
            .map((s) => s.replace(/[Aa]dd |[Uu]se |[Mm]ake /g, "").trim())
            .join(", ");
          refinedPrompt = `${page.prompt} IMPORTANT: ${fixes}.`;
        }

        const buf = await generateImage(refinedPrompt);
        fs.writeFileSync(imagePath, buf);
        fs.writeFileSync(thumbPath, buf);
        console.log(`  New image saved (${(buf.length / 1024).toFixed(0)} KB)`);
      } else {
        results.push({
          name: page.name,
          status: "FAIL",
          attempts: attempt,
          score: qc.overall,
          issues: qc.issues,
        });
      }
    }
  }

  // Summary
  console.log("\n" + "=".repeat(60));
  console.log("QC SUMMARY");
  console.log("=".repeat(60));

  for (const r of results) {
    const icon = r.status === "PASS" ? "OK" : "XX";
    console.log(
      `  [${icon}] ${r.name.padEnd(20)} Score: ${r.score}/10  (${r.attempts} attempt${r.attempts > 1 ? "s" : ""})`
    );
    if (r.issues) {
      for (const issue of r.issues) {
        console.log(`       - ${issue}`);
      }
    }
  }

  const passCount = results.filter((r) => r.status === "PASS").length;
  console.log(`\n${passCount}/${results.length} passed QC`);

  if (passCount < results.length) {
    console.log(
      "\nTip: You can re-run QC on a specific page: node scripts/qc-images.mjs bone-rattler"
    );
  }
}

main().catch(console.error);
