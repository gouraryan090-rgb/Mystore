import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { password } = await req.json();
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

    if (password === ADMIN_PASSWORD) {
      const response = NextResponse.json({ success: true });
      // Cookie set kar rahe hain jo 1 din tak valid rahegi
      response.cookies.set("admin_auth", "true", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24, // 1 day
        path: "/",
      });
      return response;
    }

    return NextResponse.json({ success: false, error: "Galat Password!" }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}