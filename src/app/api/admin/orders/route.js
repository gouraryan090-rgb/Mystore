import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Order from "@/models/Order";

export async function GET() {
  try {
    await dbConnect();

    // Database se saare orders fetch karein (Newest first)
    const orders = await Order.find({}).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: orders }, { status: 200 });
  } catch (error) {
    console.error("Admin Fetch Orders Error:", error);
    return NextResponse.json(
      { success: false, message: "Orders fetch nahi ho sake." },
      { status: 500 }
    );
  }
}