import { NextResponse } from "next/server";
import { z } from "zod";
import { container } from "@/container";
import { errorResponse } from "../_http";

const PlaceOrderBody = z.object({
  customerName: z.string().trim().min(1).max(200),
  customerEmail: z.email().max(320),
  items: z
    .array(z.object({ productId: z.uuid(), quantity: z.number().int().min(1).max(100) }))
    .min(1)
    .max(50),
});

export async function POST(req: Request) {
  try {
    const body = PlaceOrderBody.parse(await req.json());
    const { placeOrder } = await container();
    return NextResponse.json(await placeOrder.execute(body), { status: 201 });
  } catch (err) {
    return errorResponse(err);
  }
}
