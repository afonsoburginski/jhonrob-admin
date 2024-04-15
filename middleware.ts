// middleware.ts
import { getAuth } from "firebase/auth";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const auth = getAuth();
  const token = (req.cookies as any)['auth-token'];

  const privateRoutes = ["/", "/register", "/customers", "/analytics", "/database", "/settings"];

  if (token) {
    try {
      const userDoc = await getDoc(doc(db, "users", token));
      if (userDoc.exists() && userDoc.data().role === "admin") {
        if (path === "/login") {
          return NextResponse.redirect(new URL("/", req.url));
        }
      } else {
        if (privateRoutes.includes(path)) {
          return NextResponse.redirect(new URL("/login", req.url));
        }
      }
    } catch (error) {
      if (privateRoutes.includes(path)) {
        return NextResponse.redirect(new URL("/login", req.url));
      }
    }
  } else {
    // Se o usuário não estiver autenticado, redirecione-o para a página de login
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}