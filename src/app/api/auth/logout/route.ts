import { NextResponse } from "next/server";
import { destroySession } from "@/lib/session";

const BASE_URL = process.env.AUTH_URL || "http://127.0.0.1:3000";

export async function GET() {
  await destroySession();
  return NextResponse.redirect(`${BASE_URL}/`);
}
