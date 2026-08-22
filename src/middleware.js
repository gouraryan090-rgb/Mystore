import { NextResponse } from "next/server";

export function middleware(req) {
  const isAuth = req.cookies.get("admin_auth")?.value;
  const { pathname } = req.nextUrl;

  // 1. Agar koi /admin direct kholne ki koshish kare toh 404 (Not Found) dikha do
  if (pathname === "/admin") {
    return new NextResponse(null, { status: 404 });
  }

  // 2. Agar user dashboard par bina login kiye jaane ki koshish kare
  if (pathname.startsWith("/dashboard") && !isAuth) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // 3. Agar user already logged in hai aur dubara /login par jaye
  if (pathname === "/login" && isAuth) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // 4. Agar user /secure-portal khole, toh background mein usko /admin ka content dikha do
  if (pathname === "/howtoopenadminpanel7") {
    return NextResponse.rewrite(new URL("/admin", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/admin", "/secure-portal"],
};