import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

const PASSWORD_HASH = "$2a$12$YUvmYcPhRoXkIIiXH7tfAuVTBB7QMX2xMVqe3Snve8PHP16ORmOrO";
const PIN_HASH = "$2a$12$e7A5ci6HZwzeXMSMCiuDPuLRJiw0/4fAx5.fqENJ4vnycjHcSQRwy";

export async function POST(req) {
  try {
    const { password, pin } = await req.json();

    if (!password || !pin) {
      return NextResponse.json({ success: false, error: "Password aur PIN dono chahiye!" }, { status: 400 });
    }

    // Bcrypt se compare karein
    const isPasswordValid = await bcrypt.compare(password, PASSWORD_HASH);
    const isPinValid = await bcrypt.compare(pin, PIN_HASH);

    if (!isPasswordValid || !isPinValid) {
      return NextResponse.json({ success: false, error: "Galat Password ya PIN!" }, { status: 401 });
    }

    // Agar dono sahi hain, toh ek secure cookie set kar do pages ke liye
    const response = NextResponse.json({ success: true, message: "Verified!" });
    response.cookies.set("page_auth_token", "authorized", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 2, // 2 Hours
      path: "/",
    });

    return response;
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}