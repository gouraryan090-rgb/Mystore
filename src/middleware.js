import { NextResponse } from "next/server";

export function middleware(req) {
  const { pathname } = req.nextUrl;

  // 1. Agar koi bhi direct /admin ya /admin/... khole, toh use seedha 404 (Block) kar do
  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    return new NextResponse(null, { status: 404 });
  }

  // 2. Agar koi /howtoopenadminpanel7 ya /howtoopenadminpanel7/... khole, toh use /admin par rewrite kar do (Open)
  if (pathname === "/howtoopenadminpanel7" || pathname.startsWith("/howtoopenadminpanel7/")) {
    const targetPath = pathname.replace("/howtoopenadminpanel7", "/admin");
    return NextResponse.rewrite(new URL(targetPath, req.url));
  }

  // 3. Baaki routes ke liye normal flow chalne do
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