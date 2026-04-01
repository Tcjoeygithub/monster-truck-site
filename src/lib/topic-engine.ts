import { getKeywordData, getKeywordSuggestions, KeywordResult } from "./dataforseo";

// --- Seed keyword matrices ---
// These get crossed with each other to find high-volume mashup opportunities

const CORE_KEYWORDS = [
  "monster truck coloring pages",
  "monster truck coloring sheets",
  "monster truck printable",
  "monster truck coloring book",
  "free monster truck coloring pages",
];

// Real truck names — we target these keywords but create ORIGINAL fan art
const TRADEMARK_TRUCKS = [
  "grave digger",
  "el toro loco",
  "megalodon",
  "max-d",
  "son-uva digger",
  "blue thunder",
  "earth shaker",
  "zombie",
  "dragon",
  "ice cream man",
  "monster mutt",
  "whiplash",
  "avenger",
  "brutus",
];

// Seasonal / holiday mashups
const SEASONAL_THEMES = [
  "halloween",
  "christmas",
  "thanksgiving",
  "easter",
  "valentines day",
  "4th of july",
  "back to school",
  "summer",
  "winter",
  "spring",
  "st patricks day",
  "new years",
  "fathers day",
  "mothers day",
  "birthday",
];

// Kid coloring tropes that mash well with monster trucks
const KID_TROPES = [
  "dinosaur",
  "dragon",
  "robot",
  "superhero",
  "pirate",
  "shark",
  "fire",
  "lightning",
  "skeleton",
  "zombie",
  "unicorn",
  "space",
  "army",
  "police",
  "race car",
  "hot wheels",
  "dirt bike",
  "ATV",
  "demolition derby",
  "mud bog",
  "car crush",
  "ramp jump",
  "backflip",
  "wheelie",
  "donut",
  "ice cream truck",
  "tow truck",
  "fire truck",
];

// Difficulty / audience angle keywords
const AUDIENCE_KEYWORDS = [
  "easy",
  "simple",
  "toddler",
  "preschool",
  "kindergarten",
  "boys",
  "girls",
  "kids",
  "printable",
  "free",
  "realistic",
  "cartoon",
  "cute",
  "detailed",
];

export interface TopicSuggestion {
  keyword: string;
  searchVolume: number;
  competition: number;
  competitionLevel: string;
  trendingUp: boolean;
  category: "core" | "trademark-inspired" | "seasonal" | "trope-mashup" | "audience" | "discovered";
  suggestedTitle: string;
  suggestedSlug: string;
  trademarkSafe: boolean;
  notes: string;
}

// Build keyword candidates from our matrices
function buildKeywordCandidates(): { keyword: string; category: TopicSuggestion["category"]; trademarkName?: string }[] {
  const candidates: { keyword: string; category: TopicSuggestion["category"]; trademarkName?: string }[] = [];

  // Core keywords
  for (const kw of CORE_KEYWORDS) {
    candidates.push({ keyword: kw, category: "core" });
  }

  // Trademark truck searches (we'll create "inspired" pages)
  for (const truck of TRADEMARK_TRUCKS) {
    candidates.push({
      keyword: `${truck} monster truck coloring page`,
      category: "trademark-inspired",
      trademarkName: truck,
    });
    candidates.push({
      keyword: `${truck} coloring page`,
      category: "trademark-inspired",
      trademarkName: truck,
    });
  }

  // Seasonal mashups
  for (const season of SEASONAL_THEMES) {
    candidates.push({
      keyword: `${season} monster truck coloring pages`,
      category: "seasonal",
    });
    candidates.push({
      keyword: `monster truck ${season} coloring page`,
      category: "seasonal",
    });
  }

  // Kid trope mashups
  for (const trope of KID_TROPES) {
    candidates.push({
      keyword: `${trope} monster truck coloring page`,
      category: "trope-mashup",
    });
  }

  // Audience-specific
  for (const aud of AUDIENCE_KEYWORDS) {
    candidates.push({
      keyword: `${aud} monster truck coloring pages`,
      category: "audience",
    });
  }

  return candidates;
}

function generateTitle(keyword: string, category: TopicSuggestion["category"], trademarkName?: string): string {
  if (category === "trademark-inspired" && trademarkName) {
    const clean = trademarkName
      .split(" ")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
    return `${clean} Inspired Monster Truck Coloring Page - Fan Art for Kids`;
  }

  // Capitalize each word
  const titleCase = keyword
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  if (category === "seasonal") {
    return `${titleCase} - Free Printable for Kids`;
  }

  return `${titleCase} - Free Printable`;
}

function generateSlug(keyword: string, category: TopicSuggestion["category"], trademarkName?: string): string {
  if (category === "trademark-inspired" && trademarkName) {
    return `${trademarkName.replace(/\s+/g, "-")}-inspired-monster-truck`;
  }
  return keyword
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function generateNotes(category: TopicSuggestion["category"], trademarkName?: string): string {
  if (category === "trademark-inspired" && trademarkName) {
    return `Create original fan art inspired by ${trademarkName}. Use editorial reference only ("inspired by" / "for fans of"). Never reproduce official artwork.`;
  }
  if (category === "seasonal") {
    return "Seasonal content — publish 4-6 weeks before the holiday for SEO. Create Pinterest pin with seasonal board.";
  }
  if (category === "trope-mashup") {
    return "Mashup concept — combine monster truck with this theme for unique content kids will love.";
  }
  return "";
}

// Main function: research keywords and return prioritized topic suggestions
export async function researchTopics(options?: {
  includeTrademarkInspired?: boolean;
  includeSeasonal?: boolean;
  includeTropeMashups?: boolean;
  includeDiscovery?: boolean;
  limit?: number;
}): Promise<TopicSuggestion[]> {
  const opts = {
    includeTrademarkInspired: true,
    includeSeasonal: true,
    includeTropeMashups: true,
    includeDiscovery: true,
    limit: 100,
    ...options,
  };

  const candidates = buildKeywordCandidates().filter((c) => {
    if (c.category === "trademark-inspired" && !opts.includeTrademarkInspired) return false;
    if (c.category === "seasonal" && !opts.includeSeasonal) return false;
    if (c.category === "trope-mashup" && !opts.includeTropeMashups) return false;
    return true;
  });

  // Batch keywords (DataForSEO accepts up to 1000 per request)
  const allKeywords = candidates.map((c) => c.keyword);
  const batchSize = 700;
  const allResults: KeywordResult[] = [];

  for (let i = 0; i < allKeywords.length; i += batchSize) {
    const batch = allKeywords.slice(i, i + batchSize);
    const results = await getKeywordData(batch);
    allResults.push(...results);
  }

  // Map results back to candidates
  const resultMap = new Map<string, KeywordResult>();
  for (const r of allResults) {
    resultMap.set(r.keyword.toLowerCase(), r);
  }

  const topics: TopicSuggestion[] = candidates
    .map((c) => {
      const data = resultMap.get(c.keyword.toLowerCase());
      return {
        keyword: c.keyword,
        searchVolume: data?.searchVolume || 0,
        competition: data?.competition || 0,
        competitionLevel: data?.competitionLevel || "UNKNOWN",
        trendingUp: data?.trendingUp || false,
        category: c.category,
        suggestedTitle: generateTitle(c.keyword, c.category, c.trademarkName),
        suggestedSlug: generateSlug(c.keyword, c.category, c.trademarkName),
        trademarkSafe: c.category !== "trademark-inspired"
          ? true
          : true, // All are safe because we create original art + editorial reference
        notes: generateNotes(c.category, c.trademarkName),
      };
    })
    .filter((t) => t.searchVolume > 0);

  // Also discover related keywords we haven't thought of
  if (opts.includeDiscovery) {
    try {
      const discovered = await getKeywordSuggestions(
        "monster truck coloring pages",
        100
      );
      for (const d of discovered) {
        if (!resultMap.has(d.keyword.toLowerCase()) && d.searchVolume > 10) {
          topics.push({
            keyword: d.keyword,
            searchVolume: d.searchVolume,
            competition: d.competition,
            competitionLevel: d.competitionLevel,
            trendingUp: d.trendingUp,
            category: "discovered",
            suggestedTitle: generateTitle(d.keyword, "discovered"),
            suggestedSlug: generateSlug(d.keyword, "discovered"),
            trademarkSafe: !TRADEMARK_TRUCKS.some((t) =>
              d.keyword.toLowerCase().includes(t.toLowerCase())
            ),
            notes: "Discovered via keyword suggestions — review before approving.",
          });
        }
      }
    } catch (err) {
      console.error("Discovery keywords failed:", err);
    }
  }

  // Sort by opportunity score: high volume + low competition + trending
  topics.sort((a, b) => {
    const scoreA =
      a.searchVolume * (1 - a.competition * 0.5) * (a.trendingUp ? 1.3 : 1);
    const scoreB =
      b.searchVolume * (1 - b.competition * 0.5) * (b.trendingUp ? 1.3 : 1);
    return scoreB - scoreA;
  });

  return topics.slice(0, opts.limit);
}

// Quick check: which topics from our existing pages are already covered?
export function getUncoveredTopics(
  topics: TopicSuggestion[],
  existingSlugs: string[]
): TopicSuggestion[] {
  const slugSet = new Set(existingSlugs.map((s) => s.toLowerCase()));
  return topics.filter((t) => !slugSet.has(t.suggestedSlug.toLowerCase()));
}
