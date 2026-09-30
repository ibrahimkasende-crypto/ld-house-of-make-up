import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function requireApiAuth(request: Request) {
  const token = process.env.ADMIN_API_TOKEN;
  const header = request.headers.get("authorization");
  if (token && header === `Bearer ${token}`) return true;
  const session = await auth();
  return !!session?.user;
}

export function unauthorized() {
  return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
}
