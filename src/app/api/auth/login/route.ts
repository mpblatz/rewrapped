import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { cookies } from "next/headers";

const SPOTIFY_SCOPES = [
  "user-top-read",
  "user-read-recently-played",
  "playlist-read-private",
  "user-library-read",
].join(" ");

const BASE_URL = process.env.AUTH_URL || "http://127.0.0.1:3000";
const REDIRECT_URI = `${BASE_URL}/api/auth/callback`;

export async function GET() {
  const state = randomBytes(16).toString("hex");

  const cookieStore = await cookies();
  cookieStore.set("oauth_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 300,
  });

  const params = new URLSearchParams({
    response_type: "code",
    client_id: process.env.AUTH_SPOTIFY_ID!,
    scope: SPOTIFY_SCOPES,
    redirect_uri: REDIRECT_URI,
    state,
  });

  return NextResponse.redirect(
    `https://accounts.spotify.com/authorize?${params.toString()}`
  );
}
