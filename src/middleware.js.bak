import { NextResponse } from "next/server";

export function middleware(req) {
  const isAuth = req.cookies.get("admin_auth")?.value;
  const { pathname } = req.nextUrl;

  // Agar user dashboard par bina login kiye jaane ki koshish kare
  if (pathname.startsWith("/dashboard") && !isAuth) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Agar user already logged in hai aur dubara /login par jaye
  if (pathname === "/login" && isAuth) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login"],
};