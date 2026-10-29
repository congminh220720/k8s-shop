import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/** Liveness: process is up. */
export function GET() {
  return NextResponse.json({ status: "ok" });
}
