import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import mongoose from "mongoose";
import bcrypt from "bcrypt";

const ADMIN_HASH = "$2a$16$jMGHQBIDiSfF/YciIylklObdh2a3wEBQNyIfQJqpkTh.0E.m7Hgl6";

export async function POST(req) {
  try {
    const { password } = await req.json();

    if (!password) {
      return NextResponse.json({ success: false, error: "Password daalna zaroori hai!" }, { status: 400 });
    }

    await connectDB();
    const db = mongoose.connection.db;
    const adminUser = await db.collection("admin").findOne({});

    if (!adminUser) {
      return NextResponse.json({ success: false, error: "System mein koi admin nahi hai!" }, { status: 401 });
    }

    const isPasswordMatch = await bcrypt.compare(password, ADMIN_HASH);

    if (!isPasswordMatch) {
      return NextResponse.json({ success: false, error: "Galat Password!" }, { status: 401 });
    }

    const response = NextResponse.json({ success: true, message: "Login successful!" });
    
    // FIX: Ab cookie mein sirf "true" ki jagah hum ADMIN_HASH set kar rahe hain,
    // taaki bina password ke koi "true" cookie bana kar bypass na kar sake!
    response.cookies.set("admin_auth", ADMIN_HASH, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 1 Day
      path: "/",
    });

    return response;
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}