import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { DomainError } from "@/domain/errors";

const STATUS: Record<DomainError["code"], number> = {
  NOT_FOUND: 404,
  VALIDATION: 400,
  OUT_OF_STOCK: 409,
};

export function errorResponse(err: unknown): NextResponse {
  if (err instanceof DomainError) {
    return NextResponse.json({ error: err.code, message: err.message }, { status: STATUS[err.code] });
  }
  if (err instanceof ZodError) {
    return NextResponse.json({ error: "VALIDATION", message: "Invalid request", issues: err.issues }, { status: 400 });
  }
  if (err instanceof SyntaxError) {
    return NextResponse.json({ error: "VALIDATION", message: "Malformed JSON" }, { status: 400 });
  }
  console.error(err);
  return NextResponse.json({ error: "INTERNAL", message: "Internal server error" }, { status: 500 });
}
