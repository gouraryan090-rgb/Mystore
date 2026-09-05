// src/app/api/send-broadcast/route.js
import { NextResponse } from "next/server";
import { adminMessaging } from "@/lib/firebaseAdmin";
import { connectDB } from "@/lib/db";
import mongoose from "mongoose";

export async function POST(req) {
  try {
    const { title, body } = await req.json();

    if (!title || !body) {
      return NextResponse.json({ success: false, message: "Title and body are required" }, { status: 400 });
    }

    await connectDB();

    const tokensDocs = await mongoose.connection.collection("userTokens").find({}).toArray();
    const tokens = tokensDocs.map(doc => doc.token).filter(Boolean);

    if (tokens.length === 0) {
      return NextResponse.json({ success: false, message: "No device tokens found in database" }, { status: 404 });
    }

    const message = {
      notification: { title, body },
      tokens: tokens,
    };

    const response = await adminMessaging.sendEachForMulticast(message);

    return NextResponse.json({ 
      success: true, 
      message: "Broadcast sent successfully", 
      successCount: response.successCount,
      failureCount: response.failureCount 
    });

  } catch (error) {
    console.error("CRITICAL BROADCAST ERROR:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal Server Error" }, 
      { status: 500 }
    );
  }
}