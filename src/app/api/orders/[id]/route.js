import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Order from "@/models/Order";

export async function GET(request, { params }) {
  try {
    await connectDB();
    
    // Next.js ke naye versions ke liye params ko await karna zaroori hai
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ success: false, message: "Order ID is missing" }, { status: 400 });
    }

    const order = await Order.findById(id);

    if (!order) {
      return NextResponse.json({ success: false, message: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: order }, { status: 200 });
  } catch (error) {
    console.error("Fetch single order error:", error);
    return NextResponse.json({ success: false, message: "Server error", error: error.message }, { status: 500 });
  }
}