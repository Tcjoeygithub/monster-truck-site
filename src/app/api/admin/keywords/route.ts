import { NextResponse } from "next/server";
import { researchTopics } from "@/lib/topic-engine";
import { getAllPublishedPages } from "@/lib/data";
import { getUncoveredTopics } from "@/lib/topic-engine";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      includeTrademarkInspired = true,
      includeSeasonal = true,
      includeTropeMashups = true,
      includeDiscovery = true,
      limit = 100,
    } = body;

    const topics = await researchTopics({
      includeTrademarkInspired,
      includeSeasonal,
      includeTropeMashups,
      includeDiscovery,
      limit,
    });

    // Filter out topics we've already published
    const existingPages = getAllPublishedPages();
    const existingSlugs = existingPages.map((p) => p.slug);
    const uncovered = getUncoveredTopics(topics, existingSlugs);

    return NextResponse.json({
      total: topics.length,
      uncovered: uncovered.length,
      topics: uncovered,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
