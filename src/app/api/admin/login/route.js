import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import mongoose from "mongoose";
import bcrypt from "bcrypt";

// Yeh raha aapka hash jo aapne bataya
const ADMIN_HASH = "$2a$16$jMGHQBIDiSfF/YciIylklObdh2a3wEBQNyIfQJqpkTh.0E.m7Hgl6";

export async function POST(req) {
  try {
    const { password } = await req.json();

    await connectDB();
    const db = mongoose.connection.db;
    const adminUser = await db.collection("admin").findOne({});

    if (!adminUser) {
      return NextResponse.json({ success: false, error: "System mein koi admin nahi hai!" }, { status: 401 });
    }

    // Yahan hum database ke password ki jagah aapka diya hua hash use kar rahe hain
    // Taki verification aapke hash ke according ho
    const isPasswordMatch = await bcrypt.compare(password, ADMIN_HASH);

    if (!isPasswordMatch) {
      return NextResponse.json({ success: false, error: "Galat Password!" }, { status: 401 });
    }

    const response = NextResponse.json({ success: true, message: "Login successful!" });
    
    response.cookies.set("admin_auth", "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24,
      path: "/",
    });

    return response;
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}