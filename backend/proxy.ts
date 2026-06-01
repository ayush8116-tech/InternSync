import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const CORS_HEADERS = {
  "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Allow-Credentials": "true",
};

export function proxy(request: NextRequest) {
  const origin = request.headers.get("origin") ?? "*";

  if (request.method === "OPTIONS") {
    return NextResponse.json(
      {},
      {
        headers: {
          "Access-Control-Allow-Origin": origin,
          ...CORS_HEADERS,
        },
      }
    );
  }

  const response = NextResponse.next();
  response.headers.set("Access-Control-Allow-Origin", origin);
  Object.entries(CORS_HEADERS).forEach(([k, v]) => response.headers.set(k, v));

  return response;
}

export const config = {
  matcher: "/api/:path*",
};
