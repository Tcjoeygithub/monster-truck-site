#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

for (const line of fs.readFileSync(path.join(ROOT, ".env.local"), "utf8").split("\n")) {
  const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
}

const ZIPPY_KEY = (process.env.ZIPPY_SCHEDULER_API_KEY || "").trim();
const ACCOUNT_ID = "0d697670-9c73-47a2-b2c8-7595958c9d6b";
const BOARD_NAME = "Wolverine Monster Truck Coloring Pages";
const CAT_ID = "cat-wolverine-monster-truck-coloring-pages";
const BASE = "https://www.zippyscheduler.com/api/v1";

async function getBoards() {
  const res = await fetch(`${BASE}/boards?account_id=${ACCOUNT_ID}`, {
    headers: { Authorization: `Bearer ${ZIPPY_KEY}` }
  });
  if (!res.ok) throw new Error(`GET /boards HTTP ${res.status}: ${await res.text()}`);
  return res.json();
}

async function createBoard() {
  const res = await fetch(`${BASE}/boards`, {
    method: "POST",
    headers: { Authorization: `Bearer ${ZIPPY_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ account_id: ACCOUNT_ID, name: BOARD_NAME, privacy: "PUBLIC" })
  });
  const body = await res.json();
  if (!res.ok) throw new Error(`POST /boards HTTP ${res.status}: ${JSON.stringify(body)}`);
  return body;
}

async function main() {
  const boardsData = await getBoards();
  const boards = Array.isArray(boardsData) ? boardsData : (boardsData.boards ?? []);
  const existing = boards.find(b => b.name === BOARD_NAME);
  let boardId;
  if (existing) {
    boardId = existing.id;
    console.log(`Board already exists: ${boardId}`);
  } else {
    const created = await createBoard();
    boardId = created.id ?? created.board?.id;
    console.log(`Created board: ${boardId}`);
  }

  const boardsPath = path.join(ROOT, "src", "data", "pinterest-boards.json");
  const data = JSON.parse(fs.readFileSync(boardsPath, "utf8"));
  if (data.boards[CAT_ID]) {
    console.log(`pinterest-boards.json already has ${CAT_ID}: ${data.boards[CAT_ID]}`);
  } else {
    data.boards[CAT_ID] = boardId;
    fs.writeFileSync(boardsPath, JSON.stringify(data, null, 2));
    console.log(`Added ${CAT_ID} => ${boardId} to pinterest-boards.json`);
  }
}
main().catch(e => { console.error(e); process.exit(1); });
