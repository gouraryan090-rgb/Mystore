// src/app/api/save-token/route.js
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function POST(req) {
  try {
    const { token, email } = await req.json();

    if (!token) {
      return NextResponse.json({ success: false, message: "Token is required" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("zentrobazaar");

    // Token ko database mein save ya update karein taaki duplicate entries na ho
    await db.collection("userTokens").updateOne(
      { token: token },
      { $set: { token, email: email || "guest", updatedAt: new Date() } },
      { upsert: true }
    );

    return NextResponse.json({ success: true, message: "Token saved successfully" });
  } catch (error) {
    console.error("Error saving token:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}