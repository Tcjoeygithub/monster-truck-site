import { NextResponse } from "next/server";
import { getAllPages } from "@/lib/data";
import fs from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "src/data/coloring-pages.json");

export async function GET() {
  const pages = getAllPages();
  return NextResponse.json(pages);
}

export async function PUT(request: Request) {
  const updatedPage = await request.json();

  const raw = fs.readFileSync(DATA_FILE, "utf-8");
  const pages = JSON.parse(raw);

  const index = pages.findIndex(
    (p: { id: string }) => p.id === updatedPage.id
  );
  if (index === -1) {
    return NextResponse.json({ error: "Page not found" }, { status: 404 });
  }

  pages[index] = updatedPage;
  fs.writeFileSync(DATA_FILE, JSON.stringify(pages, null, 2));

  return NextResponse.json(updatedPage);
}
