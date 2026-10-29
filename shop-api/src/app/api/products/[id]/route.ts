import { NextResponse } from "next/server";
import { z } from "zod";
import { container } from "@/container";
import { errorResponse } from "../../_http";

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    const id = z.uuid().parse((await ctx.params).id);
    const { getProduct } = await container();
    return NextResponse.json(await getProduct.execute(id));
  } catch (err) {
    return errorResponse(err);
  }
}
