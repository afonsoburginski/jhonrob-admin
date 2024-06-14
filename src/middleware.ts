// middleware.ts
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

const secret = process.env.NEXTAUTH_SECRET;

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  const session = await getToken({ req, secret });

  const privateRoutes = [
    "/",
    "/manager/expedition",
    "/manager/propose",
    "/users",
    "/orders",
    "/settings",
  ];

  if (!session && privateRoutes.includes(path)) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (session) {
    if (path === "/login" || path === "/register") {
      return NextResponse.redirect(new URL("/", req.url));
    }

    // Allow users with role "Adm" to access all routes
    if (session.role === "Adm") {
      return NextResponse.next();
    }

    if ((session.role === "Exp" || session.role === "Amp") && path !== "/manager/expedition") {
      return NextResponse.redirect(new URL("/manager/expedition", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/manager/expedition",
    "/manager/propose",
    "/users",
    "/orders",
    "/settings",
    "/login",
    "/register"
  ],
};
