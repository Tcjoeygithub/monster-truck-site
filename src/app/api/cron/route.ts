import { NextResponse } from "next/server";
import { runPipeline } from "@/lib/autopilot";

// Vercel cron jobs send a secret to verify the request
const CRON_SECRET = process.env.CRON_SECRET;

export const maxDuration = 300; // 5 minutes max for Vercel function

export async function GET(request: Request) {
  // Verify cron secret (or allow in development)
  const authHeader = request.headers.get("authorization");
  if (CRON_SECRET && authHeader !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const count = parseInt(url.searchParams.get("count") || "1", 10);
  const pages = Math.min(Math.max(count, 1), 5); // 1-5 pages per run

  try {
    const results = await runPipeline(pages);

    const summary = {
      requested: pages,
      succeeded: results.filter((r) => r.success).length,
      failed: results.filter((r) => !r.success).length,
      pages: results.map((r) => ({
        success: r.success,
        title: r.topic?.title || "unknown",
        slug: r.page?.slug || r.topic?.slug || "unknown",
        qcAttempts: r.qcAttempts,
        qcScore: r.qcScore,
        error: r.error,
      })),
    };

    return NextResponse.json(summary);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
