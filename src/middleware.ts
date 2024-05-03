import { NextRequest, NextResponse } from "next/server";

export default function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  const signInUrl = new URL("/login", request.url);

  if (!token) {
    if (request.nextUrl.pathname === "/login") {
      return NextResponse.next();
    }
    return NextResponse.redirect(signInUrl);
  }
}

export const config = {
  matcher: [
    "/",
    "/manager",
    "/manager/expedition",
    "/manager/propose",
    "/customers",
    "/settings"
  ],
};
