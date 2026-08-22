import { NextResponse } from "next/server";
import clientPromise from "@/lib/db"; // Yahan file ka sahi path use kiya hai
import bcrypt from "bcrypt";

export async function POST(req) {
  try {
    const { password } = await req.json();

    // MongoDB connection
    const client = await clientPromise;
    const db = client.db("ecommerce"); 
    
    // Yahan collection ka naam "admin" kar diya hai
    const adminUser = await db.collection("admin").findOne({});

    if (!adminUser) {
      return NextResponse.json({ success: false, error: "System mein koi admin nahi hai!" }, { status: 401 });
    }

    // Password match karein
    const isPasswordMatch = await bcrypt.compare(password, adminUser.password);

    if (!isPasswordMatch) {
      return NextResponse.json({ success: false, error: "Galat Password!" }, { status: 401 });
    }

    // Login successful
    const response = NextResponse.json({ success: true, message: "Login successful!" });
    
    // Cookie set karein
    response.cookies.set("admin_auth", "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 1 din
      path: "/",
    });

    return response;
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}