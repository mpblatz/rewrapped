import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createSession } from "@/lib/session";

const BASE_URL = process.env.AUTH_URL || "http://127.0.0.1:3000";
const REDIRECT_URI = `${BASE_URL}/api/auth/callback`;

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const error = url.searchParams.get("error");

  if (error) {
    return NextResponse.redirect(`${BASE_URL}/dashboard?error=${error}`);
  }

  // Verify state
  const cookieStore = await cookies();
  const storedState = cookieStore.get("oauth_state")?.value;
  cookieStore.delete("oauth_state");

  if (!code || !state || state !== storedState) {
    return NextResponse.redirect(`${BASE_URL}/dashboard?error=state_mismatch`);
  }

  // Exchange code for tokens
  const tokenRes = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(
        `${process.env.AUTH_SPOTIFY_ID}:${process.env.AUTH_SPOTIFY_SECRET}`
      ).toString("base64")}`,
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: REDIRECT_URI,
    }),
  });

  const tokenData = await tokenRes.json();

  if (!tokenRes.ok) {
    console.error("Token exchange failed:", tokenData);
    return NextResponse.redirect(`${BASE_URL}/dashboard?error=token_exchange`);
  }

  // Fetch user profile
  const profileRes = await fetch("https://api.spotify.com/v1/me", {
    headers: { Authorization: `Bearer ${tokenData.access_token}` },
  });

  const profile = await profileRes.json();

  // Create session
  await createSession({
    accessToken: tokenData.access_token,
    refreshToken: tokenData.refresh_token,
    expiresAt: Math.floor(Date.now() / 1000 + tokenData.expires_in),
    user: {
      name: profile.display_name || "Spotify User",
      image: profile.images?.[0]?.url,
    },
  });

  return NextResponse.redirect(`${BASE_URL}/dashboard`);
}
