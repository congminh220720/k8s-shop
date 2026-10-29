import { NextResponse } from "next/server";
import { getDataSource } from "@/infrastructure/typeorm/data-source";

export const dynamic = "force-dynamic";

/** Readiness: database is reachable. */
export async function GET() {
  try {
    const ds = await getDataSource();
    await ds.query("SELECT 1");
    return NextResponse.json({ status: "ready" });
  } catch {
    return NextResponse.json({ status: "not-ready" }, { status: 503 });
  }
}
