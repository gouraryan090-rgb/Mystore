import { NextResponse } from "next/server";

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Agar user login page (/admin) par ja raha hai, toh jaane dein
  if (pathname === "/admin") {
    return NextResponse.next();
  }

  // Agar URL me admin ke andar ke koi bhi pages access ho rahe hain
  // (Kyunki route group (admin) URL me nahi dikhta, isliye hum check kar rahe hain ki kya ye admin ke sub-paths hain)
  if (
    pathname.startsWith("/admin/") || 
    pathname.startsWith("/orders") || 
    pathname.startsWith("/products")
  ) {
    const token = request.cookies.get("admin_auth")?.value;

    // Agar token/cookie nahi hai, toh seedha login page par bhej do
    if (!token) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/orders/:path*",
    "/products/:path*",
  ],
};