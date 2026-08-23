import { NextResponse } from "next/server";

export function middleware(req) {
  const isAuth = req.cookies.get("admin_auth")?.value;
  const { pathname } = req.nextUrl;

  // 1. Agar koi direct /admin ya /admin/... khole, toh use turant secret path par redirect kar do
  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    const secretPath = pathname.replace("/admin", "/howtoopenadminpanel7");
    return NextResponse.redirect(new URL(secretPath, req.url));
  }

  // 2. Agar path /howtoopenadminpanel7 se shuru hota hai
  if (pathname === "/howtoopenadminpanel7" || pathname.startsWith("/howtoopenadminpanel7/")) {
    // Agar login nahi hai (cookie nahi hai), toh seedha /login par bhej do
    if (!isAuth) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    // Agar login hai, toh background mein /admin content dikhane ke liye rewrite karo
    const targetPath = pathname.replace("/howtoopenadminpanel7", "/admin");
    return NextResponse.rewrite(new URL(targetPath, req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin",
    "/admin/:path*",
    "/howtoopenadminpanel7",
    "/howtoopenadminpanel7/:path*"
  ],
};