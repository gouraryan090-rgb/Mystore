import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import ContactMessage from "@/models/ContactMessage";

// Naya message save karne ke liye (POST)
export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { name, email, phone, topic, message } = body; // 📱 Phone number received

    if (!name || !email || !phone || !topic || !message) {
      return NextResponse.json(
        { success: false, message: "Sabhi fields bharna anivarya hai!" },
        { status: 400 }
      );
    }

    const newMessage = await ContactMessage.create({
      name,
      email,
      phone, // 📱 Saved phone in DB
      topic,
      message,
    });

    return NextResponse.json(
      { success: true, message: "Message successfully sent!", data: newMessage },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// Admin panel ke liye saare messages fetch karne ke liye (GET) - Isme phone number bhi fetch hoga[cite: 10]
export async function GET() {
  try {
    await dbConnect();
    const messages = await ContactMessage.find({}).sort({ createdAt: -1 });
    return NextResponse.json(
      { success: true, data: messages },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// 🗑️ Admin panel se messages delete karne ke liye (DELETE)
export async function DELETE(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email parameter is required!" },
        { status: 400 }
      );
    }

    const result = await ContactMessage.deleteMany({ email });

    return NextResponse.json(
      { success: true, message: "Messages deleted successfully!", result },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}