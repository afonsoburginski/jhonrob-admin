// middleware.ts
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

const secret = process.env.NEXTAUTH_SECRET;

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  const session = await getToken({ req, secret });

  const privateRoutes = ["/", "/manager", "/propose", "/products", "/expedition"];

  if (privateRoutes.includes(path) && !session) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
  if (session && (path === "/login" || path === "/register")) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/manager",
    "/manager/expedition",
    "/manager/propose",
    "/products",
    "/expedition",
    "/login",
    "/register"
  ],
};