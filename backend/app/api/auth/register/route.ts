import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { signJwt, COOKIE_NAME } from "@/lib/auth";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": process.env.FRONTEND_URL ?? "http://localhost:8000",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Credentials": "true",
};

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}

const USERNAME_RE = /^[a-zA-Z0-9_-]{3,30}$/;

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return Response.json({ error: "Username and password are required" }, { status: 400, headers: CORS_HEADERS });
    }
    if (!USERNAME_RE.test(username)) {
      return Response.json(
        { error: "Username must be 3–30 characters: letters, numbers, _ or -" },
        { status: 400, headers: CORS_HEADERS }
      );
    }
    if (password.length < 8) {
      return Response.json({ error: "Password must be at least 8 characters" }, { status: 400, headers: CORS_HEADERS });
    }

    await connectDB();

    const existing = await User.findOne({ login: username });
    if (existing) {
      return Response.json({ error: "Username already taken" }, { status: 409, headers: CORS_HEADERS });
    }

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ login: username, name: username, avatarUrl: "", password: hash });

    const token = signJwt({
      sub: String(user._id),
      login: user.login,
      name: user.name,
      avatarUrl: user.avatarUrl,
    });

    const response = Response.json(
      { login: user.login, name: user.name, avatarUrl: user.avatarUrl },
      { status: 201, headers: CORS_HEADERS }
    );
    const res = new NextResponse(response.body, response);
    res.cookies.set(COOKIE_NAME, token, { httpOnly: true, path: "/", sameSite: "lax", maxAge: 60 * 60 * 24 * 7 });
    return res;
  } catch (error) {
    console.error("[POST /api/auth/register]", error);
    return Response.json({ error: "Internal server error" }, { status: 500, headers: CORS_HEADERS });
  }
}
