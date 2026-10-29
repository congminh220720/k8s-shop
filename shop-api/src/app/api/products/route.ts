import { NextResponse } from "next/server";
import { container } from "@/container";
import { errorResponse } from "../_http";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { listProducts } = await container();
    return NextResponse.json(await listProducts.execute());
  } catch (err) {
    return errorResponse(err);
  }
}
