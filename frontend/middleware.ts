import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const COOKIE_NAME = "auth_token";

export function middleware(request: NextRequest) {
  const token = request.cookies.get(COOKIE_NAME);
  const { pathname } = request.nextUrl;

  const needsAuth =
    pathname.startsWith("/create-post") ||
    /^\/posts\/[^/]+\/edit(\/|$)/.test(pathname);

  if (needsAuth && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/create-post", "/create-post/(.*)", "/posts/:id/edit", "/posts/:id/edit/(.*)"],
};
