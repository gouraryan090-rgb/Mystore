import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

const ADMIN_PIN_HASH = "$2a$12$JOzehmMVDT5BeBbXwWgKdejdlZXVBKW4M3OOLw7g3LBmyyhZ8K7zO";
const ADMIN_PASS_HASH = "$2a$12$zZRl0JNuDCjB/yevzMTkhOwwzSgVzVJx2mKYYfeDbV47eDZkq84va";

export async function POST(req) {
  try {
    const { pinInput, passInput } = await req.json();

    if (!pinInput || !passInput) {
      return NextResponse.json({ success: false, message: "PIN aur Password dono bharna zaroori hai!" }, { status: 400 });
    }

    // Dono ko unke respective hashes ke sath verify karo
    const isPinMatch = await bcrypt.compare(pinInput, ADMIN_PIN_HASH);
    const isPassMatch = await bcrypt.compare(passInput, ADMIN_PASS_HASH);

    if (isPinMatch && isPassMatch) {
      return NextResponse.json({ success: true });
    } else if (!isPinMatch && isPassMatch) {
      return NextResponse.json({ success: false, message: "Galat PIN hai!" }, { status: 401 });
    } else if (isPinMatch && !isPassMatch) {
      return NextResponse.json({ success: false, message: "Galat Password hai!" }, { status: 401 });
    } else {
      return NextResponse.json({ success: false, message: "PIN aur Password dono galat hain!" }, { status: 401 });
    }
  } catch (error) {
    console.error("Auth API Error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}