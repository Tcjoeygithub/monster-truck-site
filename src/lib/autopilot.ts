import Anthropic from "@anthropic-ai/sdk";
import { getAllPublishedPages, getAllCategories } from "./data";
import { ColoringPage, Category } from "./types";
import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { v4 as uuid } from "uuid";

const PAGES_FILE = path.join(process.cwd(), "src/data/coloring-pages.json");
const CATEGORIES_FILE = path.join(process.cwd(), "src/data/categories.json");
const IMAGES_DIR = path.join(process.cwd(), "public/images/coloring-pages");

const IMAGEN_API_KEY = process.env.GOOGLE_IMAGEN_API_KEY || "";
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || "";

// --- Topic Ideation via Claude ---

const TOPIC_SYSTEM_PROMPT = `You are a creative director for a children's monster truck coloring page website. Your audience is kids ages 2-8 and their parents.

Your job is to come up with fresh, exciting coloring page ideas that kids will love. Mix monster trucks with:
- Seasonal themes (Halloween, Christmas, Easter, summer, etc.)
- Kid favorites (dinosaurs, robots, sharks, dragons, space, pirates, superheroes)
- Action scenes (jumping, crushing, racing, mud bogs, freestyle tricks)
- Fun mashups (ice cream truck monster truck, fire truck monster truck, unicorn monster truck)
- Fan-inspired themes (skull trucks, flame trucks, graveyard trucks — inspired by famous trucks but ORIGINAL designs)
- Trending kid interests

Rules:
- Every idea must be an ORIGINAL monster truck design — never copy real trademarked trucks
- Names must be creative and original (e.g. "Skull Smasher" not "Grave Digger")
- If inspired by a real truck, note it but create something new
- Think about what would make a great Pinterest pin
- Consider seasonal timing (suggest holiday themes 4-6 weeks early)
- Vary difficulty levels (easy/medium/hard) across suggestions`;

export interface GeneratedTopic {
  title: string;
  slug: string;
  description: string;
  metaDescription: string;
  altText: string;
  imagenPrompt: string;
  difficulty: "easy" | "medium" | "hard";
  ageRange: "2-4" | "4-6" | "6-8";
  categoryIds: string[];
  inspiration: string;
}

export async function brainstormTopics(count: number): Promise<GeneratedTopic[]> {
  const anthropic = new Anthropic({ apiKey: ANTHROPIC_API_KEY });

  const existingPages = getAllPublishedPages();
  const existingTitles = existingPages.map((p) => p.title).join(", ");
  const categories = getAllCategories();
  const categoryList = categories
    .map((c) => `${c.id}: ${c.name} (${c.type})`)
    .join("\n");

  const today = new Date();
  const month = today.toLocaleString("en-US", { month: "long" });
  const upcomingHolidays = getUpcomingHolidays(today);

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 4096,
    system: TOPIC_SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: `Generate ${count} new monster truck coloring page ideas.

Current month: ${month}
Upcoming holidays/events: ${upcomingHolidays}

We already have these pages (don't repeat): ${existingTitles}

Available categories:
${categoryList}

For each idea, respond in this exact JSON array format:
[
  {
    "title": "Creative Page Title",
    "slug": "creative-page-title",
    "description": "2-3 sentence fun description for kids/parents. Mention what makes this truck special and why kids will love coloring it.",
    "metaDescription": "SEO meta description under 160 chars with 'free printable' and 'coloring page'",
    "altText": "Descriptive alt text for the black and white coloring page image",
    "imagenPrompt": "Detailed prompt for image generation (the monster truck design, pose, any accessories — but NOT the style instructions, those get added automatically)",
    "difficulty": "easy|medium|hard",
    "ageRange": "2-4|4-6|6-8",
    "categoryIds": ["cat-id-1", "cat-id-2"],
    "inspiration": "What inspired this idea (seasonal trend, kid trope mashup, fan-inspired, etc.)"
  }
]

Return ONLY the JSON array, no other text.`,
      },
    ],
  });

  const text =
    response.content[0].type === "text" ? response.content[0].text : "";
  const jsonMatch = text.match(/\[[\s\S]*\]/);
  if (!jsonMatch) throw new Error("Failed to parse topic ideas from Claude");

  return JSON.parse(jsonMatch[0]);
}

function getUpcomingHolidays(now: Date): string {
  const holidays = [
    { month: 1, day: 1, name: "New Year's Day" },
    { month: 2, day: 14, name: "Valentine's Day" },
    { month: 3, day: 17, name: "St. Patrick's Day" },
    { month: 4, day: 20, name: "Easter (approx)" },
    { month: 5, day: 11, name: "Mother's Day" },
    { month: 5, day: 26, name: "Memorial Day" },
    { month: 6, day: 15, name: "Father's Day" },
    { month: 7, day: 4, name: "4th of July" },
    { month: 9, day: 1, name: "Back to School" },
    { month: 10, day: 31, name: "Halloween" },
    { month: 11, day: 27, name: "Thanksgiving" },
    { month: 12, day: 25, name: "Christmas" },
  ];

  const upcoming: string[] = [];
  for (const h of holidays) {
    const hDate = new Date(now.getFullYear(), h.month - 1, h.day);
    if (hDate < now) hDate.setFullYear(hDate.getFullYear() + 1);
    const daysUntil = Math.ceil(
      (hDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (daysUntil <= 60) {
      upcoming.push(`${h.name} (in ${daysUntil} days)`);
    }
  }
  return upcoming.length > 0 ? upcoming.join(", ") : "None within 60 days";
}

// --- Image Generation + QC ---

const BASE_IMAGEN_PROMPT =
  "Black and white line art, coloring book style for young children ages 2-8, bold thick clean outlines only, very simple shapes, NO shading, NO gray fill, NO complex backgrounds, NO crowds, NO tiny details, NO text in image, pure white background, minimal background elements, large colorable areas. CRITICAL FRAMING RULE: The ENTIRE truck must be fully visible inside the image with generous white space margins on ALL four sides. Nothing should be cut off or touch any edge of the image. Leave at least 10% white space padding between the truck and every edge. The truck should be centered in the frame.";

async function generateImage(prompt: string): Promise<Buffer> {
  const fullPrompt = `${prompt} ${BASE_IMAGEN_PROMPT}`;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-generate-001:predict?key=${IMAGEN_API_KEY}`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      instances: [{ prompt: fullPrompt }],
      parameters: { sampleCount: 1 },
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Imagen error ${res.status}: ${err}`);
  }

  const data = await res.json();
  return Buffer.from(data.predictions[0].bytesBase64Encoded, "base64");
}

async function qcImage(imagePath: string): Promise<{ pass: boolean; score: number; issues: string[] }> {
  const imageData = fs.readFileSync(imagePath);
  const base64 = imageData.toString("base64");

  const qcPrompt = `Analyze this coloring page image for children ages 2-8. Score 1-10 on: simplicity, anatomical_correctness, coloring_friendliness, engagement, print_quality, framing. Framing is CRITICAL: is the ENTIRE truck visible with white space margins on all sides? Any cutoff = score 1-3. Respond in JSON only: {"overall": <avg>, "framing": <score>, "pass": <true if all >= 6 and overall >= 7 and framing >= 7>, "issues": ["list"]}`;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${IMAGEN_API_KEY}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: qcPrompt }, { inlineData: { mimeType: "image/png", data: base64 } }] }],
      generationConfig: { temperature: 0.1, maxOutputTokens: 1024 },
    }),
  });

  if (!res.ok) throw new Error(`QC API error: ${res.status}`);

  const data = await res.json();
  const text = data.candidates[0].content.parts.map((p: { text?: string }) => p.text || "").join("");
  const cleaned = text.replace(/```json\s*/g, "").replace(/```\s*/g, "");
  const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
  if (!jsonMatch) return { pass: false, score: 0, issues: ["Could not parse QC"] };

  const result = JSON.parse(jsonMatch[0]);
  return {
    pass: result.pass || false,
    score: result.overall || 0,
    issues: result.issues || [],
  };
}

function pixelEdgeCheck(imagePath: string): boolean {
  const pyScript = path.join(process.cwd(), "scripts", "edge-check.py");

  // Create a minimal edge check script if it doesn't exist
  if (!fs.existsSync(pyScript)) {
    fs.writeFileSync(pyScript, `
import sys, json
from PIL import Image

img = Image.open(sys.argv[1]).convert("L")
w, h = img.size
# Downscale for speed
img = img.resize((200, int(200 * h / w)))
w, h = img.size
mx, my = max(int(w * 0.05), 3), max(int(h * 0.05), 3)
edges = {
    "top": [(x, y) for y in range(my) for x in range(w)],
    "bottom": [(x, y) for y in range(h - my, h) for x in range(w)],
    "left": [(x, y) for x in range(mx) for y in range(h)],
    "right": [(x, y) for x in range(w - mx, w) for y in range(h)],
}
for name, pixels in edges.items():
    dark = sum(1 for x, y in pixels if img.getpixel((x, y)) < 128)
    if dark / len(pixels) > 0.03:
        print(f"FAIL:{name}")
        sys.exit(1)
print("PASS")
`);
  }

  try {
    const result = execSync(`python3 "${pyScript}" "${imagePath}"`, {
      encoding: "utf-8",
      timeout: 15000,
    }).trim();
    return result === "PASS";
  } catch {
    return false;
  }
}

function resizeForPrint(imagePath: string) {
  try {
    execSync(`sips --resampleWidth 1200 --resampleHeight 1575 "${imagePath}" 2>/dev/null`);
    execSync(`sips --padToHeightWidth 1575 1200 --padColor FFFFFF "${imagePath}" 2>/dev/null`);
  } catch {
    // sips not available (Vercel), skip resize
  }
}

function applyWatermark(imageName: string) {
  const watermarkScript = path.join(process.cwd(), "scripts", "watermark.py");
  try {
    execSync(`python3 "${watermarkScript}" ${imageName}`, {
      timeout: 30000,
      cwd: process.cwd(),
    });
  } catch {
    // Watermark not available on Vercel, skip
  }
}

// --- Full Pipeline ---

export interface PipelineResult {
  success: boolean;
  page?: ColoringPage;
  topic?: GeneratedTopic;
  error?: string;
  qcAttempts?: number;
  qcScore?: number;
}

export async function generateAndPublishPage(): Promise<PipelineResult> {
  // Step 1: Brainstorm a topic
  console.log("[autopilot] Brainstorming topic...");
  let topics: GeneratedTopic[];
  try {
    topics = await brainstormTopics(3); // Generate 3, pick the best
  } catch (err) {
    return { success: false, error: `Topic brainstorm failed: ${err}` };
  }

  if (topics.length === 0) {
    return { success: false, error: "No topics generated" };
  }

  // Pick the first viable topic
  const existingSlugs = new Set(getAllPublishedPages().map((p) => p.slug));
  const topic = topics.find((t) => !existingSlugs.has(t.slug)) || topics[0];

  // Dedupe slug if needed
  if (existingSlugs.has(topic.slug)) {
    topic.slug = `${topic.slug}-${Date.now().toString(36)}`;
  }

  console.log(`[autopilot] Topic: ${topic.title}`);

  // Step 2: Generate image with QC loop
  const imageName = topic.slug;
  const imagePath = path.join(IMAGES_DIR, `${imageName}.png`);
  const thumbPath = path.join(IMAGES_DIR, `${imageName}-thumb.png`);

  let qcPassed = false;
  let attempts = 0;
  let lastScore = 0;
  const maxAttempts = 3;

  while (!qcPassed && attempts < maxAttempts) {
    attempts++;
    console.log(`[autopilot] Generating image (attempt ${attempts})...`);

    try {
      const imageBuffer = await generateImage(topic.imagenPrompt);
      fs.writeFileSync(imagePath, imageBuffer);
      fs.writeFileSync(thumbPath, imageBuffer);
    } catch (err) {
      console.log(`[autopilot] Image generation failed: ${err}`);
      continue;
    }

    // QC check
    try {
      const qc = await qcImage(imagePath);
      lastScore = qc.score;
      console.log(`[autopilot] QC score: ${qc.score}/10 ${qc.pass ? "PASS" : "FAIL"}`);

      if (qc.pass) {
        // Pixel edge check
        const edgeOk = pixelEdgeCheck(imagePath);
        if (edgeOk) {
          qcPassed = true;
        } else {
          console.log("[autopilot] Pixel edge check failed, retrying...");
        }
      }
    } catch (err) {
      console.log(`[autopilot] QC check failed: ${err}`);
    }
  }

  if (!qcPassed) {
    // Clean up failed images
    try { fs.unlinkSync(imagePath); } catch {}
    try { fs.unlinkSync(thumbPath); } catch {}
    return {
      success: false,
      topic,
      error: `Image QC failed after ${maxAttempts} attempts (best score: ${lastScore})`,
      qcAttempts: attempts,
      qcScore: lastScore,
    };
  }

  // Step 3: Print-fit resize + watermark
  console.log("[autopilot] Resizing and watermarking...");
  resizeForPrint(imagePath);
  fs.copyFileSync(imagePath, thumbPath);
  applyWatermark(imageName);

  // Step 4: Create the page entry
  const now = new Date().toISOString();
  const today = now.split("T")[0];
  const pageId = `page-${uuid().slice(0, 8)}`;

  const newPage: ColoringPage = {
    id: pageId,
    slug: topic.slug,
    title: topic.title,
    description: topic.description,
    metaDescription: topic.metaDescription,
    altText: topic.altText,
    imagePath: `/images/coloring-pages/${imageName}.png`,
    thumbnailPath: `/images/coloring-pages/${imageName}-thumb.png`,
    categoryIds: topic.categoryIds,
    difficulty: topic.difficulty,
    ageRange: topic.ageRange,
    status: "published",
    featured: false,
    publishDate: today,
    createdAt: now,
    updatedAt: now,
  };

  // Step 5: Add any new categories if needed
  ensureCategoriesExist(topic.categoryIds);

  // Step 6: Save to data file
  const pagesRaw = fs.readFileSync(PAGES_FILE, "utf-8");
  const pages = JSON.parse(pagesRaw);
  pages.push(newPage);
  fs.writeFileSync(PAGES_FILE, JSON.stringify(pages, null, 2));

  console.log(`[autopilot] Published: ${topic.title} (${topic.slug})`);

  return {
    success: true,
    page: newPage,
    topic,
    qcAttempts: attempts,
    qcScore: lastScore,
  };
}

function ensureCategoriesExist(categoryIds: string[]) {
  const raw = fs.readFileSync(CATEGORIES_FILE, "utf-8");
  const categories: Category[] = JSON.parse(raw);
  const existingIds = new Set(categories.map((c) => c.id));

  // Only existing categories are allowed — don't create phantom ones
  const valid = categoryIds.filter((id) => existingIds.has(id));
  if (valid.length < categoryIds.length) {
    console.log(
      `[autopilot] Warning: some category IDs don't exist: ${categoryIds.filter((id) => !existingIds.has(id)).join(", ")}`
    );
  }
}

// Run N pages in sequence
export async function runPipeline(count: number = 1): Promise<PipelineResult[]> {
  const results: PipelineResult[] = [];

  for (let i = 0; i < count; i++) {
    console.log(`\n[autopilot] === Generating page ${i + 1}/${count} ===`);
    const result = await generateAndPublishPage();
    results.push(result);

    if (!result.success) {
      console.log(`[autopilot] Failed: ${result.error}`);
    }
  }

  return results;
}
