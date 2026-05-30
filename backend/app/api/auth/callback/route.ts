import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { signJwt, COOKIE_NAME } from "@/lib/auth";

const FRONTEND_URL = process.env.FRONTEND_URL ?? "http://localhost:8000";
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:3001";

// Mocked org check — set GITHUB_ORG env var to enable when ready
async function isOrgMember(
  _accessToken: string,
  _login: string
): Promise<boolean> {
  if (!process.env.GITHUB_ORG) return true;
  // TODO: call GET https://api.github.com/orgs/{org}/members/{login}
  return true;
}

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(`${FRONTEND_URL}/login?error=missing_code`);
  }

  try {
    // Exchange code for access token
    const tokenRes = await fetch(
      "https://github.com/login/oauth/access_token",
      {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          client_id: process.env.GITHUB_CLIENT_ID,
          client_secret: process.env.GITHUB_CLIENT_SECRET,
          code,
          redirect_uri: `${BACKEND_URL}/api/auth/callback`,
        }),
      }
    );

    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token as string | undefined;

    if (!accessToken) {
      return NextResponse.redirect(`${FRONTEND_URL}/login?error=token`);
    }

    // Fetch GitHub user profile
    const profileRes = await fetch("https://api.github.com/user", {
      headers: { Authorization: `Bearer ${accessToken}`, Accept: "application/vnd.github+json" },
    });

    if (!profileRes.ok) {
      return NextResponse.redirect(`${FRONTEND_URL}/login?error=profile`);
    }

    const profile = await profileRes.json();
    const { id: githubId, login, name, avatar_url: avatarUrl } = profile;

    // Org membership check (mocked)
    const allowed = await isOrgMember(accessToken, login);
    if (!allowed) {
      return NextResponse.redirect(`${FRONTEND_URL}/login?error=org`);
    }

    // Upsert user in MongoDB
    await connectDB();
    const user = await User.findOneAndUpdate(
      { githubId: String(githubId) },
      { login, name: name ?? login, avatarUrl },
      { upsert: true, new: true, runValidators: true }
    );

    // Sign JWT and set httpOnly cookie
    const token = signJwt({
      sub: String(user._id),
      login: user.login,
      name: user.name,
      avatarUrl: user.avatarUrl,
    });

    const response = NextResponse.redirect(FRONTEND_URL);
    response.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    console.error("[GET /api/auth/callback]", error);
    return NextResponse.redirect(`${FRONTEND_URL}/login?error=server`);
  }
}
