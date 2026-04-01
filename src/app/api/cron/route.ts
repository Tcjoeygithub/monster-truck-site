import { NextResponse } from "next/server";
import { runDailyPipeline } from "@/lib/autopilot";

const CRON_SECRET = process.env.CRON_SECRET;

export const maxDuration = 300; // 5 minutes max

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (CRON_SECRET && authHeader !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const count = parseInt(url.searchParams.get("count") || "10", 10);
  const pages = Math.min(Math.max(count, 1), 15);

  try {
    const result = await runDailyPipeline(pages);
    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
