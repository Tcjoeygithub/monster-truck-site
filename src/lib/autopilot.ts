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

// =====================================================
// COLLECTION STRATEGY
// =====================================================
// The autopilot rotates between 3 strategies daily:
// Day 1: SEO-targeted (autocomplete/keyword inspired collections)
// Day 2: Demographic-targeted (age/audience specific)
// Day 3: Novel creative (original mashup ideas)

type Strategy = "seo" | "demographic" | "creative";

function getTodayStrategy(): Strategy {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) /
      (1000 * 60 * 60 * 24)
  );
  const strategies: Strategy[] = ["seo", "demographic", "creative"];
  return strategies[dayOfYear % 3];
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

Your job is to plan a THEMED COLLECTION of coloring pages. A collection is a group of 10 related coloring pages that share a theme and will live on one category page.

Rules:
- Every coloring page must feature a MONSTER TRUCK as the primary subject
- All designs must be ORIGINAL — never copy real trademarked trucks
- If inspired by real trucks (Grave Digger, El Toro Loco), create original designs with creative names
- Mix difficulty levels across the 10 pages: aim for ~3 easy, ~4 medium, ~3 hard
- Easy = very simple shapes, 5-8 large areas to color, thick outlines, minimal detail
- Medium = moderate detail, 10-20 areas, some accessories
- Hard = lots of detail, patterns, many small areas, complex scenes
- For easy pages, describe VERY SIMPLE trucks with minimal elements
- Think about what makes a great Pinterest collection`;

export async function brainstormCollection(
  strategy: Strategy,
  count: number = 10
): Promise<CollectionPlan> {
  const anthropic = new Anthropic({ apiKey: ANTHROPIC_API_KEY });

  const existingPages = getAllPublishedPages();
  const existingTitles = existingPages.map((p) => p.title).join(", ");
  const existingCategories = getAllCategories();
  const categoryList = existingCategories
    .map((c) => `${c.id}: ${c.name} (${c.type}) — ${c.pageCount || 0} pages`)
    .join("\n");

  const today = new Date();
  const month = today.toLocaleString("en-US", { month: "long" });
  const upcomingHolidays = getUpcomingHolidays(today);

  const strategyInstructions = {
    seo: `TODAY'S STRATEGY: SEO-TARGETED COLLECTION
Pick a collection theme based on what parents would actually search for on Google. Think about Google autocomplete phrases like:
- "[animal] monster truck coloring pages" (alligator, shark, dinosaur, dragon)
- "[theme] monster truck coloring pages" (fire, ice, jungle, ocean, space)
- "monster truck [action] coloring pages" (jumping, crushing, racing, mud)
- "[holiday] monster truck coloring pages" (if a holiday is coming up)
The collection name should read naturally as a search query. For example: "Dinosaur Monster Truck Coloring Pages" or "Monster Truck Racing Coloring Pages".`,

    demographic: `TODAY'S STRATEGY: DEMOGRAPHIC-TARGETED COLLECTION
Pick a collection theme targeting a specific age group or audience. Examples:
- "Easy Monster Truck Coloring Pages for Toddlers" (ages 2-3, VERY simple)
- "Monster Truck Coloring Pages for Kindergarten" (ages 4-5, moderate)
- "Detailed Monster Truck Coloring Pages for Big Kids" (ages 6-8, complex)
- "Monster Truck Coloring Pages for Girls" (fun colors, flowers + trucks, unicorn trucks)
- "Simple Monster Truck Coloring Pages for Preschool"
The collection should have ALL pages at the appropriate difficulty for that audience.`,

    creative: `TODAY'S STRATEGY: NOVEL CREATIVE COLLECTION
Come up with something totally unique and fun that no keyword research would surface:
- "Monster Trucks in Space" (trucks on the moon, Mars, floating in zero-G)
- "Monster Truck Food Trucks" (taco truck, ice cream truck, pizza truck — all monster-sized)
- "Baby Monster Trucks" (cute small trucks with big eyes)
- "Monster Trucks Through History" (medieval, pirate ship, wild west)
- "Monster Truck Mashups" (half truck half animal combos)
- Seasonal: if a holiday is within 6 weeks, do a themed collection
Think about what would make a kid say "WHOA COOL!" and a parent share on Pinterest.`,
  };

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 8192,
    system: COLLECTION_SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: `Plan a collection of ${count} monster truck coloring pages.

${strategyInstructions[strategy]}

Current month: ${month}
Upcoming holidays/events: ${upcomingHolidays}

Existing pages (don't duplicate these): ${existingTitles}

Existing collections (with current page counts):
${categoryList}

CRITICAL RULES — READ CAREFULLY:

1. MINIMUM 10 PAGES PER COLLECTION. Look at the page counts above. If ANY existing collection has fewer than 10 pages, you MUST add pages to that collection first. Do NOT create a new collection until all existing ones have at least 10 pages.

2. NO OVERLAPPING COLLECTIONS. Before creating a new collection, check if any existing collection already covers a similar theme. Examples of overlap to avoid:
   - "Dragon Trucks" overlaps with "Flame & Fire Trucks"
   - "Skull Monster Trucks" overlaps with "Skeleton & Skull Trucks"
   - "Racing Monster Trucks" overlaps with "Racing Trucks"
   If there's overlap, ADD to the existing collection instead.

3. PRIORITY ORDER:
   a) First: fill any existing collection that has fewer than 10 pages
   b) Second: if all collections have 10+, create a genuinely NEW collection that doesn't overlap with anything

Based on the page counts above, which collection needs filling? If all have 10+, what new DISTINCT theme should we create?

Respond in this exact JSON format:
{
  "collectionName": "Name for the collection page (should include 'coloring pages' if it doesn't already — this becomes the H1)",
  "collectionSlug": "url-slug-for-collection",
  "collectionDescription": "SEO-rich description for the collection page. 2-3 sentences explaining what these coloring pages are, who they're for, and why kids love them. Must mention 'free printable coloring pages' and 'monster truck'.",
  "collectionType": "truck-type|difficulty|age-range|theme",
  "isNewCollection": true/false,
  "existingCategoryId": "cat-id if adding to existing, omit if new",
  "pages": [
    {
      "title": "Creative Page Title",
      "slug": "url-slug",
      "description": "2-3 sentence fun description for kids/parents.",
      "metaDescription": "SEO meta description under 160 chars with 'free printable' and 'coloring page'",
      "altText": "Descriptive alt text for the black and white coloring page image",
      "imagenPrompt": "Detailed prompt for the monster truck design, pose, accessories. For EASY pages say: very simple monster truck, only 5-6 large shapes, extra thick outlines, no small details. For MEDIUM: moderate detail monster truck. For HARD: detailed monster truck with patterns and accessories.",
      "difficulty": "easy|medium|hard",
      "ageRange": "2-4|4-6|6-8"
    }
  ]
}

Return ONLY the JSON, no other text.`,
      },
    ],
  });

  const text =
    response.content[0].type === "text" ? response.content[0].text : "";
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("Failed to parse collection plan from Claude");

  const plan: CollectionPlan = JSON.parse(jsonMatch[0]);

  // Safety check 1: if Claude says "new" but an existing collection has the same slug
  // or very similar name, force it to use the existing one (true overlap)
  if (plan.isNewCollection) {
    const existing = existingCategories.find(
      (c) =>
        c.slug === plan.collectionSlug ||
        c.name.toLowerCase() === plan.collectionName.toLowerCase()
    );
    if (existing) {
      console.log(
        `[autopilot] Overlap detected: "${plan.collectionName}" matches existing "${existing.name}" — merging`
      );
      plan.isNewCollection = false;
      plan.existingCategoryId = existing.id;
      plan.collectionName = existing.name;
      plan.collectionSlug = existing.slug;
    }
  }

  // Safety check 2: if Claude says "new" but existing collections need filling,
  // ONLY redirect if the new collection isn't a genuinely distinct concept.
  // Seasonal, event, and clearly unique themes should be allowed as new collections
  // even when existing ones are underfilled — they're time-sensitive.
  if (plan.isNewCollection) {
    const underfilled = existingCategories
      .filter((c) => (c.pageCount || 0) < 10)
      .sort((a, b) => (a.pageCount || 0) - (b.pageCount || 0));

    // Check if this is a genuinely new concept (seasonal, demographic, unique mashup)
    const newConceptSignals = [
      "easter", "christmas", "halloween", "thanksgiving", "valentine",
      "summer", "winter", "spring", "birthday", "4th of july", "patriotic",
      "st patrick", "back to school", "father", "mother",
      "toddler", "kindergarten", "preschool", "girls", "boys",
      "baby", "space", "underwater", "food", "history", "robot",
      "dinosaur", "pirate", "superhero", "unicorn",
    ];
    const planNameLower = plan.collectionName.toLowerCase();
    const isGenuinelyNew = newConceptSignals.some((s) => planNameLower.includes(s));

    if (underfilled.length > 0 && !isGenuinelyNew) {
      const target = underfilled[0];
      console.log(
        `[autopilot] Redirecting: "${plan.collectionName}" → filling underfilled "${target.name}" (${target.pageCount || 0} pages)`
      );
      plan.isNewCollection = false;
      plan.existingCategoryId = target.id;
      plan.collectionName = target.name;
      plan.collectionSlug = target.slug;
    } else if (underfilled.length > 0 && isGenuinelyNew) {
      console.log(
        `[autopilot] Allowing new collection "${plan.collectionName}" despite underfilled collections — genuinely distinct concept`
      );
    }
  }

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
5. PRINT_QUALITY: Clean white background, no text/watermarks
6. ARTWORK_COMPLETENESS: This is the MOST IMPORTANT criterion.
   - Is every part of the truck FULLY DRAWN as a complete illustration?
   - Are ALL 4 tires/wheels completely drawn with their full circular shape? (not cut off, not partially drawn, not missing the bottom half)
   - Is the truck body complete from front bumper to rear?
   - Is the roof/top of the truck fully drawn?
   - Are all accessories (exhaust pipes, decorations, etc.) complete?
   - Does the artwork look like a FINISHED illustration, or does it look like parts are missing/cropped?
   - Score 1-3 if ANY wheel is not a complete circle, or if any major part of the truck appears incomplete
   - Score 4-6 if minor elements are slightly incomplete
   - Score 7-10 only if EVERY part of the truck is fully drawn as a complete piece of art

Respond in JSON only: {"overall": <avg of all 6>, "completeness": <score>, "pass": <true if ALL scores >= 6 AND overall >= 7 AND completeness >= 7>, "issues": ["list"]}`;

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
      generationConfig: { temperature: 0.1, maxOutputTokens: 1024 },
    }),
  });

  if (!res.ok) throw new Error(`QC API error: ${res.status}`);

  const data = await res.json();
  const text = data.candidates[0].content.parts
    .map((p: { text?: string }) => p.text || "")
    .join("");
  const cleaned = text.replace(/```json\s*/g, "").replace(/```\s*/g, "");
  const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
  if (!jsonMatch)
    return { pass: false, score: 0, issues: ["Could not parse QC"] };

  const result = JSON.parse(jsonMatch[0]);
  return {
    pass: result.pass || false,
    score: result.overall || 0,
    issues: result.issues || [],
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
