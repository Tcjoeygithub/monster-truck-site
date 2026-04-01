import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { QueuedTopic } from "@/lib/topics-types";

const QUEUE_FILE = path.join(process.cwd(), "src/data/topic-queue.json");

function readQueue(): QueuedTopic[] {
  const raw = fs.readFileSync(QUEUE_FILE, "utf-8");
  return JSON.parse(raw);
}

function writeQueue(queue: QueuedTopic[]) {
  fs.writeFileSync(QUEUE_FILE, JSON.stringify(queue, null, 2));
}

// GET - list all queued topics
export async function GET() {
  const queue = readQueue();
  return NextResponse.json(queue);
}

// POST - add topics to queue (from keyword research results)
export async function POST(request: Request) {
  const body = await request.json();
  const { topics } = body as { topics: QueuedTopic[] };

  const queue = readQueue();
  const existingKeywords = new Set(queue.map((t) => t.keyword.toLowerCase()));

  let added = 0;
  for (const topic of topics) {
    if (!existingKeywords.has(topic.keyword.toLowerCase())) {
      queue.push({
        ...topic,
        id: `topic-${Date.now()}-${added}`,
        status: "pending",
        priority: topic.priority || topic.searchVolume,
        addedAt: new Date().toISOString(),
      });
      existingKeywords.add(topic.keyword.toLowerCase());
      added++;
    }
  }

  writeQueue(queue);
  return NextResponse.json({ added, total: queue.length });
}

// PUT - update a topic (approve, reject, reorder, edit)
export async function PUT(request: Request) {
  const body = await request.json();
  const { id, ...updates } = body;

  const queue = readQueue();
  const index = queue.findIndex((t) => t.id === id);
  if (index === -1) {
    return NextResponse.json({ error: "Topic not found" }, { status: 404 });
  }

  queue[index] = { ...queue[index], ...updates };

  if (updates.status === "approved" && !queue[index].approvedAt) {
    queue[index].approvedAt = new Date().toISOString();
  }

  writeQueue(queue);
  return NextResponse.json(queue[index]);
}

// DELETE - remove a topic from queue
export async function DELETE(request: Request) {
  const { id } = await request.json();
  let queue = readQueue();
  queue = queue.filter((t) => t.id !== id);
  writeQueue(queue);
  return NextResponse.json({ success: true, total: queue.length });
}
