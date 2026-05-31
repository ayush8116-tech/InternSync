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

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return Response.json({ error: "Username and password are required" }, { status: 400, headers: CORS_HEADERS });
    }

    await connectDB();

    const user = await User.findOne({ login: username });
    if (!user) {
      return Response.json({ error: "Invalid username or password" }, { status: 401, headers: CORS_HEADERS });
    }

    if (!user.password) {
      return Response.json({ error: "This account uses GitHub login" }, { status: 401, headers: CORS_HEADERS });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return Response.json({ error: "Invalid username or password" }, { status: 401, headers: CORS_HEADERS });
    }

    const token = signJwt({
      sub: String(user._id),
      login: user.login,
      name: user.name,
      avatarUrl: user.avatarUrl,
    });

    const response = Response.json(
      { login: user.login, name: user.name, avatarUrl: user.avatarUrl },
      { status: 200, headers: CORS_HEADERS }
    );
    const res = new NextResponse(response.body, response);
    res.cookies.set(COOKIE_NAME, token, { httpOnly: true, path: "/", sameSite: "lax", maxAge: 60 * 60 * 24 * 7 });
    return res;
  } catch (error) {
    console.error("[POST /api/auth/login]", error);
    return Response.json({ error: "Internal server error" }, { status: 500, headers: CORS_HEADERS });
  }
}
