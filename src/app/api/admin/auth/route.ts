import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  const { password } = await request.json();

  const hash = process.env.ADMIN_PASSWORD_HASH;

  if (!hash) {
    // If no hash set, use a simple default for development
    if (password === "monster-truck-admin-2026") {
      return NextResponse.json({ success: true });
    }
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const valid = await bcrypt.compare(password, hash);
  if (valid) {
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
