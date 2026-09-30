import { NextResponse } from "next/server";
import { createQuoteRequest } from "@/lib/crm";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Corps JSON attendu." }, { status: 400 });
  }
  const result = await createQuoteRequest(body);
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: 400 });
  return NextResponse.json({ ok: true, reference: result.reference }, { status: 201 });
}
