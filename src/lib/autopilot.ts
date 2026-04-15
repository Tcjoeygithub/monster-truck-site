import Anthropic from "@anthropic-ai/sdk";
import { getAllPublishedPages, getAllCategories } from "./data";
import { ColoringPage, Category } from "./types";
import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { v4 as uuid } from "uuid";

const PAGES_FILE = path.join(process.cwd(), "src/data/coloring-pages.json");
const CATEGORIES_FILE = path.join(process.cwd(), "src/data/categories.json");
const BOARDS_FILE = path.join(process.cwd(), "src/data/pinterest-boards.json");
const IMAGES_DIR = path.join(process.cwd(), "public/images/coloring-pages");

const IMAGEN_API_KEY = (process.env.GOOGLE_IMAGEN_API_KEY || "").trim();
const ANTHROPIC_API_KEY = (process.env.ANTHROPIC_API_KEY || "").trim();

// =====================================================
// COLLECTION STRATEGY — simplified
// =====================================================
// One brand-new creative listicle every day. Consider upcoming major
// holidays. No SEO research rotation. No "fill existing" priority.

type Strategy = "creative";

function getTodayStrategy(): Strategy {
  return "creative";
}

// =====================================================
// COLLECTION BRAINSTORMING
// =====================================================

interface CollectionPlan {
  collectionName: string;
  collectionSlug: string;
  collectionDescription: string;
  collectionType: "truck-type" | "difficulty" | "age-range" | "theme";
  isNewCollection: boolean;
  existingCategoryId?: string;
  pages: GeneratedTopic[];
}

interface GeneratedTopic {
  title: string;
  slug: string;
  description: string;
  metaDescription: string;
  altText: string;
  imagenPrompt: string;
  difficulty: "easy" | "medium" | "hard";
  ageRange: "2-4" | "4-6" | "6-8";
}

const COLLECTION_SYSTEM_PROMPT = `You are a creative director for a children's monster truck coloring page website targeting kids ages 2-8 and their parents.

Your job is to invent ONE brand-new themed listicle of 10 coloring pages. Every day is a fresh theme — be genuinely creative.

Hard rules:
- Every page features a MONSTER TRUCK as the primary subject.
- All designs are ORIGINAL. Never use trademarked names (Grave Digger, El Toro Loco, Monster Jam, Max-D, Bigfoot-the-brand, Hot Wheels, etc). If inspired by a real truck, invent a new creative name.
- Collection NAME must end in exactly "Monster Truck Coloring Pages" (e.g. "Pirate Monster Truck Coloring Pages", "Hanukkah Monster Truck Coloring Pages", "Outer Space Monster Truck Coloring Pages").
- Collection SLUG must end in exactly "-monster-truck-coloring-pages" (e.g. "pirate-monster-truck-coloring-pages").
- The theme must NOT overlap meaningfully with any existing collection on the site.
- Mix difficulty across the 10 pages: ~3 easy / ~4 medium / ~3 hard.
  - Easy = 5–8 large shapes, very thick outlines, minimal detail, for 2–4 year olds.
  - Medium = moderate detail, 10–20 areas, a few accessories.
  - Hard = lots of detail, patterns, complex scenes.
- If a major holiday is within 6 weeks, feel free to theme around it (Christmas, Hanukkah, Easter, Halloween, Thanksgiving, Valentine's, Fourth of July, Father's Day, Mother's Day, Back to School, New Year's) — but don't force it every day.
- Think Pinterest: pick themes parents/teachers will actually want to save and print.`;

export async function brainstormCollection(
  _strategy: Strategy,
  count: number = 10
): Promise<CollectionPlan> {
  const anthropic = new Anthropic({ apiKey: ANTHROPIC_API_KEY });

  const existingPages = getAllPublishedPages();
  const existingTitles = existingPages.map((p) => p.title).join(", ");
  const existingCategories = getAllCategories();
  const categoryList = existingCategories
    .map((c) => `- ${c.name}`)
    .join("\n");

  const today = new Date();
  const month = today.toLocaleString("en-US", { month: "long" });
  const upcomingHolidays = getUpcomingHolidays(today);

  const strategyInstructions = {
    creative: `Invent ONE brand-new themed listicle of ${count} monster truck coloring pages. Theme must be genuinely original and visually distinctive from every existing collection.

Good example directions (don't pick one of these unless it's missing):
- Holiday-themed (only if the holiday is within 6 weeks)
- Seasonal (winter, summer, spring, fall)
- Location/setting mashups (underwater, outer space, medieval, pirate, wild west, jungle, arctic)
- Animal mashups (shark, dragon, tiger, elephant, octopus, robot, dinosaur varieties we haven't covered)
- Job/occupation mashups (firefighter, astronaut, chef, doctor)
- Emotion/personality (happy, superhero, sleepy, party)
- Materials/finishes (crystal, gold, patchwork, rainbow stripes)

The collection should make a parent say "oh cool, my kid will love that" and be instantly pinnable.`,
  };

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 8192,
    system: COLLECTION_SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: `${strategyInstructions.creative}

Current month: ${month}
Upcoming holidays within 6 weeks: ${upcomingHolidays}

Existing collection themes (DON'T overlap with any of these):
${categoryList}

Recent page titles to avoid duplicating: ${existingTitles}

Respond in this exact JSON format:
{
  "collectionName": "{Theme} Monster Truck Coloring Pages",
  "collectionSlug": "{theme}-monster-truck-coloring-pages",
  "collectionDescription": "2-3 sentence description. Lead with 'Free printable {theme} monster truck coloring pages for kids ages 2-8.' Then describe what makes this set fun.",
  "collectionType": "theme",
  "isNewCollection": true,
  "pages": [
    {
      "title": "Creative Page Title (no brand names)",
      "slug": "url-slug-without-collection-prefix",
      "description": "2-3 fun sentences about this specific truck, for kids and parents.",
      "metaDescription": "SEO meta under 160 chars, mentions 'free printable' and 'coloring page'",
      "altText": "Describe the black and white coloring page image for accessibility",
      "imagenPrompt": "Detailed prompt describing this specific monster truck, its pose, decorations. For EASY: 'very simple monster truck, only 5-6 large shapes, extra thick outlines, no small details'. For MEDIUM: moderate detail. For HARD: detailed with patterns. ALWAYS specify the truck as the only subject on a white background.",
      "difficulty": "easy|medium|hard",
      "ageRange": "2-4|4-6|6-8"
    }
    // ... ${count} total pages
  ]
}

Return ONLY the JSON.`,
      },
    ],
  });

  const text =
    response.content[0].type === "text" ? response.content[0].text : "";
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("Failed to parse collection plan from Claude");

  const plan: CollectionPlan = JSON.parse(jsonMatch[0]);

  // Enforce naming convention: "{Theme} Monster Truck Coloring Pages"
  if (!/monster truck coloring pages$/i.test(plan.collectionName)) {
    plan.collectionName = `${plan.collectionName.replace(/\s*coloring pages?$/i, "").trim()} Monster Truck Coloring Pages`;
  }
  if (!/-monster-truck-coloring-pages$/.test(plan.collectionSlug)) {
    plan.collectionSlug = `${plan.collectionSlug.replace(/-coloring-pages?$/, "").replace(/-monster-trucks?$/, "")}-monster-truck-coloring-pages`;
  }

  // If an existing collection already has this slug/name, bail — ask for a fresh one next run.
  const overlap = existingCategories.find(
    (c) =>
      c.slug === plan.collectionSlug ||
      c.name.toLowerCase() === plan.collectionName.toLowerCase()
  );
  if (overlap) {
    throw new Error(
      `Collection "${plan.collectionName}" overlaps with existing "${overlap.name}". Rerun for a fresh theme.`
    );
  }

  plan.isNewCollection = true;
  plan.existingCategoryId = undefined;
  return plan;
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

// =====================================================
// IMAGE GENERATION + QC
// =====================================================

const BASE_IMAGEN_PROMPT =
  "Black and white line art ONLY, coloring book style for young children ages 2-8, bold thick clean outlines only, simple shapes, NO COLOR, NO shading, NO gray fill, NO colored fills, strictly black outlines on white background, NO complex backgrounds, NO crowds, NO tiny details, NO text in image. The complete subject should be fully visible in the image.";

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

async function qcImage(
  imagePath: string
): Promise<{ pass: boolean; score: number; issues: string[] }> {
  const imageData = fs.readFileSync(imagePath);
  const base64 = imageData.toString("base64");

  const qcPrompt = `Analyze this coloring page image for children ages 2-8. Score 1-10 on each criterion:

1. SIMPLICITY: Bold outlines, age-appropriate detail, not too busy
2. ANATOMICAL_CORRECTNESS: Truck body correct, proportions reasonable, no AI artifacts
3. COLORING_FRIENDLINESS: Large enclosed areas, thick outlines, no gray shading
4. ENGAGEMENT: Looks cool/exciting, kids would want to color it
5. PRINT_QUALITY: Clean white background, no unrelated marks
6. ARTWORK_COMPLETENESS: Is every part of the truck FULLY DRAWN as a complete illustration?
   - Are ALL 4 tires/wheels completely drawn with their full circular shape? (not cut off, not partially drawn, not missing the bottom half)
   - Is the truck body complete from front bumper to rear?
   - Is the roof/top of the truck fully drawn?
   - Are all accessories (exhaust pipes, decorations, etc.) complete?
   - Score 1-3 if ANY wheel is not a complete circle, or if any major part of the truck appears incomplete
   - Score 4-6 if minor elements are slightly incomplete
   - Score 7-10 only if EVERY part of the truck is fully drawn as a complete piece of art
7. NO_COLORED_FILL: The entire image must be pure black line art on white. Are there ANY colored fills (orange beak, yellow body, red flames filled with color, etc.)? Gray shading also counts as fill.
   - Score 10 = perfectly black outlines on pure white, nothing filled
   - Score 6 = small patches of gray shading or faint color tint
   - Score 1-4 = any region is clearly colored in (solid orange, yellow, red, etc.)
8. NO_TEXT_ARTIFACTS: Is there ANY text, letters, numbers, fake words, logos, signatures, scribbled writing, or garbled AI-generated text-like squiggles drawn into the image? (The image is delivered as bare art — there is NO legitimate watermark or label present at QC time, so any text-shaped marks are failures.)
   - Score 10 = zero text anywhere in the image
   - Score 6 = one small ambiguous shape that might be a letter
   - Score 1-4 = any visible letters, numbers, or garbled AI text

Respond in JSON only: {"overall": <avg of all 8>, "completeness": <score>, "no_color": <score>, "no_text": <score>, "pass": <true if ALL scores >= 6 AND overall >= 7 AND completeness >= 7 AND no_color >= 9 AND no_text >= 9>, "issues": ["list"]}`;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${IMAGEN_API_KEY}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            { text: qcPrompt },
            { inlineData: { mimeType: "image/png", data: base64 } },
          ],
        },
      ],
      generationConfig: { temperature: 0.1, maxOutputTokens: 2048 },
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    console.log(`[autopilot]   QC HTTP ${res.status}: ${errText.slice(0, 300)}`);
    return { pass: false, score: 0, issues: [`QC HTTP ${res.status}`] };
  }

  const data = await res.json();
  const text = data.candidates?.[0]?.content?.parts
    ?.map((p: { text?: string }) => p.text || "")
    .join("") ?? "";
  if (!text) {
    console.log(`[autopilot]   QC empty response: ${JSON.stringify(data).slice(0, 300)}`);
    return { pass: false, score: 0, issues: ["Empty QC response"] };
  }
  const cleaned = text.replace(/```json\s*/g, "").replace(/```\s*/g, "");
  const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    console.log(`[autopilot]   QC unparseable: ${text.slice(0, 300)}`);
    return { pass: false, score: 0, issues: ["Could not parse QC"] };
  }

  let result: {
    overall?: number;
    completeness?: number;
    no_color?: number;
    no_text?: number;
    pass?: boolean;
    issues?: string[];
  };
  try {
    result = JSON.parse(jsonMatch[0]);
  } catch (e) {
    console.log(`[autopilot]   QC JSON parse fail: ${jsonMatch[0].slice(0, 300)}`);
    return { pass: false, score: 0, issues: [`JSON parse fail: ${e}`] };
  }
  const noColor = result.no_color ?? 10;
  const noText = result.no_text ?? 10;
  // Hard-fail any image where the AI sees colored fills or text artifacts,
  // even if the overall score would otherwise pass.
  const hardFail = noColor < 9 || noText < 9;
  const issues = result.issues || [];
  if (noColor < 9) issues.push(`Colored fill detected (no_color=${noColor})`);
  if (noText < 9) issues.push(`Text/letter artifacts detected (no_text=${noText})`);
  return {
    pass: (result.pass || false) && !hardFail,
    score: result.overall || 0,
    issues,
  };
}

function applyFrame(imagePath: string) {
  const frameScript = path.join(process.cwd(), "scripts", "frame-image.py");
  try {
    execSync(`python3 "${frameScript}" "${imagePath}"`, {
      encoding: "utf-8",
      timeout: 30000,
    });
  } catch (err) {
    console.log(`[autopilot] Frame failed: ${err}`);
  }
}

// =====================================================
// PINTEREST BOARD PROVISIONING (via Zippy)
// =====================================================
async function ensurePinterestBoard(
  categoryId: string,
  plan: CollectionPlan
): Promise<void> {
  if (!fs.existsSync(BOARDS_FILE)) return;
  const boardsMap = JSON.parse(fs.readFileSync(BOARDS_FILE, "utf-8"));
  if (boardsMap.boards?.[categoryId]) {
    return; // already have a board for this category
  }
  const zippyKey = process.env.ZIPPY_SCHEDULER_API_KEY;
  const accountId = boardsMap.account_id;
  if (!zippyKey || !accountId) {
    console.log(
      "[autopilot] Missing ZIPPY_SCHEDULER_API_KEY or account_id, skipping board creation"
    );
    return;
  }
  console.log(`[autopilot] Creating Pinterest board: ${plan.collectionName}`);
  const res = await fetch("https://www.zippyscheduler.com/api/v1/boards", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${zippyKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      account_id: accountId,
      name: plan.collectionName,
      description: `${plan.collectionDescription} Free printable at FreeMonsterTruckColoringPages.com`,
      privacy: "PUBLIC",
    }),
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Zippy board create failed: ${res.status} ${txt}`);
  }
  const body = await res.json();
  const zippyBoardId = body.board?.id;
  if (!zippyBoardId) throw new Error("No board id in Zippy response");

  boardsMap.boards ||= {};
  boardsMap.boards[categoryId] = zippyBoardId;
  fs.writeFileSync(BOARDS_FILE, JSON.stringify(boardsMap, null, 2));
  console.log(`[autopilot] Board created → ${zippyBoardId}`);
}

function checkBlackAndWhite(imagePath: string): boolean {
  const colorScript = path.join(process.cwd(), "scripts", "check-color.py");
  try {
    const result = execSync(`python3 "${colorScript}" "${imagePath}"`, {
      encoding: "utf-8",
      timeout: 15000,
    }).trim();
    console.log(`[autopilot] Color check: ${result}`);
    return result.startsWith("PASS");
  } catch {
    console.log("[autopilot] Color check FAIL: image has color, must regenerate");
    return false;
  }
}

function gradeDifficulty(imagePath: string): {
  difficulty: "easy" | "medium" | "hard";
  ageRange: "2-4" | "4-6" | "6-8";
} {
  const gradeScript = path.join(process.cwd(), "scripts", "grade-difficulty.py");
  try {
    const result = execSync(`python3 "${gradeScript}" "${imagePath}"`, {
      encoding: "utf-8",
      timeout: 30000,
    }).trim();
    const data = JSON.parse(result);
    return {
      difficulty: data.grade as "easy" | "medium" | "hard",
      ageRange: data.ageRange as "2-4" | "4-6" | "6-8",
    };
  } catch {
    return { difficulty: "medium", ageRange: "4-6" };
  }
}

// =====================================================
// COLLECTION PUBLISHING PIPELINE
// =====================================================

export interface PipelineResult {
  success: boolean;
  collectionName?: string;
  collectionSlug?: string;
  isNewCollection?: boolean;
  strategy?: Strategy;
  pagesPublished: number;
  pagesFailed: number;
  pages: {
    title: string;
    slug: string;
    success: boolean;
    qcAttempts?: number;
    qcScore?: number;
    difficulty?: string;
    error?: string;
  }[];
  error?: string;
}

export async function runDailyPipeline(
  pageCount: number = 10
): Promise<PipelineResult> {
  const strategy = getTodayStrategy();
  console.log(
    `[autopilot] === Daily Pipeline: strategy=${strategy}, pages=${pageCount} ===`
  );

  // Step 1: Brainstorm collection
  console.log("[autopilot] Brainstorming collection...");
  let plan: CollectionPlan;
  try {
    plan = await brainstormCollection(strategy, pageCount);
  } catch (err) {
    return {
      success: false,
      strategy,
      pagesPublished: 0,
      pagesFailed: 0,
      pages: [],
      error: `Brainstorm failed: ${err}`,
    };
  }

  console.log(
    `[autopilot] Collection: "${plan.collectionName}" (${plan.isNewCollection ? "NEW" : "existing"})`
  );
  console.log(`[autopilot] Pages planned: ${plan.pages.length}`);

  // Step 2: Create or find the category
  let categoryId: string;
  if (plan.isNewCollection || !plan.existingCategoryId) {
    categoryId = `cat-${plan.collectionSlug}`;
    const newCategory: Category = {
      id: categoryId,
      slug: plan.collectionSlug,
      name: plan.collectionName,
      description: plan.collectionDescription,
      type: plan.collectionType || "theme",
    };

    const catRaw = fs.readFileSync(CATEGORIES_FILE, "utf-8");
    const cats: Category[] = JSON.parse(catRaw);
    if (!cats.find((c) => c.id === categoryId)) {
      cats.push(newCategory);
      fs.writeFileSync(CATEGORIES_FILE, JSON.stringify(cats, null, 2));
      console.log(`[autopilot] Created new category: ${plan.collectionName}`);
    }
  } else {
    categoryId = plan.existingCategoryId;
  }

  // Step 3: Generate each page
  const results: PipelineResult["pages"] = [];
  const existingSlugs = new Set(getAllPublishedPages().map((p) => p.slug));

  for (let i = 0; i < plan.pages.length; i++) {
    const topic = plan.pages[i];
    console.log(
      `\n[autopilot] Page ${i + 1}/${plan.pages.length}: ${topic.title}`
    );

    // Dedupe slug
    let slug = topic.slug;
    if (existingSlugs.has(slug)) {
      slug = `${slug}-${Date.now().toString(36)}`;
    }
    existingSlugs.add(slug);

    const imagePath = path.join(IMAGES_DIR, `${slug}.png`);
    const thumbPath = path.join(IMAGES_DIR, `${slug}-thumb.png`);

    // Generate image with QC
    let qcPassed = false;
    let attempts = 0;
    let lastScore = 0;
    const maxAttempts = 5;

    while (!qcPassed && attempts < maxAttempts) {
      attempts++;
      try {
        const imageBuffer = await generateImage(topic.imagenPrompt);
        fs.writeFileSync(imagePath, imageBuffer);
      } catch (err) {
        console.log(`[autopilot] Image gen failed: ${err}`);
        continue;
      }

      try {
        const qc = await qcImage(imagePath);
        lastScore = qc.score;
        console.log(
          `[autopilot]   QC attempt ${attempts}: ${qc.score}/10 ${qc.pass ? "PASS" : "FAIL"}`
        );
        if (qc.pass) {
          // Check for color — coloring pages must be black and white only
          const isBW = checkBlackAndWhite(imagePath);
          if (isBW) {
            qcPassed = true;
          } else {
            console.log("[autopilot]   Image has color, regenerating...");
          }
        }
      } catch (err) {
        console.log(`[autopilot]   QC error: ${err}`);
      }
    }

    if (!qcPassed) {
      try { fs.unlinkSync(imagePath); } catch {}
      results.push({
        title: topic.title,
        slug,
        success: false,
        qcAttempts: attempts,
        qcScore: lastScore,
        error: `QC failed after ${maxAttempts} attempts`,
      });
      continue;
    }

    // Grade difficulty from actual image
    const { difficulty, ageRange } = gradeDifficulty(imagePath);

    // Apply frame (border + watermark)
    applyFrame(imagePath);
    fs.copyFileSync(imagePath, thumbPath);

    // Save page entry
    const now = new Date().toISOString();
    const today = now.split("T")[0];
    const pageId = `page-${uuid().slice(0, 8)}`;

    const newPage: ColoringPage = {
      id: pageId,
      slug,
      title: topic.title,
      description: topic.description,
      metaDescription: topic.metaDescription,
      altText: topic.altText,
      imagePath: `/images/coloring-pages/${slug}.png`,
      thumbnailPath: `/images/coloring-pages/${slug}-thumb.png`,
      categoryIds: [categoryId],
      difficulty,
      ageRange,
      status: "published",
      featured: false,
      publishDate: today,
      createdAt: now,
      updatedAt: now,
    };

    const pagesRaw = fs.readFileSync(PAGES_FILE, "utf-8");
    const pages = JSON.parse(pagesRaw);
    pages.push(newPage);
    fs.writeFileSync(PAGES_FILE, JSON.stringify(pages, null, 2));

    console.log(
      `[autopilot]   Published: ${topic.title} (${difficulty}, ${ageRange})`
    );

    results.push({
      title: topic.title,
      slug,
      success: true,
      qcAttempts: attempts,
      qcScore: lastScore,
      difficulty,
    });
  }

  const published = results.filter((r) => r.success).length;
  const failed = results.filter((r) => !r.success).length;

  // Step 4: If this is a new collection and at least one page published,
  // create a matching Pinterest board via Zippy and persist the mapping.
  if (published > 0) {
    try {
      await ensurePinterestBoard(categoryId, plan);
    } catch (err) {
      console.log(`[autopilot] Pinterest board creation failed: ${err}`);
    }
  }

  console.log(
    `\n[autopilot] === Done: ${published} published, ${failed} failed ===`
  );

  return {
    success: published > 0,
    collectionName: plan.collectionName,
    collectionSlug: plan.collectionSlug,
    isNewCollection: plan.isNewCollection,
    strategy,
    pagesPublished: published,
    pagesFailed: failed,
    pages: results,
  };
}
