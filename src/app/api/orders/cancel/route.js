import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Order from "@/models/Order";

export async function POST(request) {
  try {
    await dbConnect();
    const { orderId, reason } = await request.json();

    if (!orderId) {
      return NextResponse.json(
        { success: false, message: "Order ID nahi mili." },
        { status: 400 }
      );
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return NextResponse.json(
        { success: false, message: "Database me order nahi mila." },
        { status: 404 }
      );
    }

    if (order.orderStatus === "Cancelled") {
      return NextResponse.json(
        { success: false, message: "Order pehle se cancel ho chuka hai." },
        { status: 400 }
      );
    }

    // Update order status & cancellation reason
    order.orderStatus = "Cancelled";
    order.cancellationReason = reason || "User cancelled within 24 hours";
    await order.save();

    return NextResponse.json(
      { success: true, message: "Order successfully cancel ho gaya hai!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Cancel Order API Error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}