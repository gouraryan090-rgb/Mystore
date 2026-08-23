import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Order from "@/models/Order";

export async function POST(request) {
  try {
    await dbConnect();
    const { orderId, reason } = await request.json();

    if (!orderId) {
      return NextResponse.json(
        { success: false, message: "Order ID not found." },
        { status: 400 }
      );
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return NextResponse.json(
        { success: false, message: "Order not found in the database." },
        { status: 404 }
      );
    }

    if (order.orderStatus === "Cancelled") {
      return NextResponse.json(
        { success: false, message: "Order is already cancelled." },
        { status: 400 }
      );
    }

    // Update order status & cancellation reason
    order.orderStatus = "Cancelled";
    order.cancellationReason = reason || "User cancelled within 24 hours";
    await order.save();

    return NextResponse.json(
      { success: true, message: "Order successfully cancelled!" },
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