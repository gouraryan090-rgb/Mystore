export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Order from "@/models/Order";
import { sendOrderEmail } from "@/lib/mailer";

export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { orderId, paymentStatus, status } = body;

    if (!orderId) {
      return NextResponse.json(
        { success: false, message: "Order ID is required" },
        { status: 400 }
      );
    }

    // Order find karke update karein
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      {
        paymentStatus: paymentStatus || "Paid",
        status: status || "Placed",
      },
      { new: true }
    );

    if (!updatedOrder) {
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 }
      );
    }

    // Payment successful hone par customer ko confirmation email bhej sakte hain
    const customerEmail = updatedOrder.shippingAddress?.email;
    if (customerEmail && paymentStatus === "Paid") {
      sendOrderEmail(customerEmail, orderId, "created", {
        customerName: updatedOrder.shippingAddress?.name || "Customer",
        phone: updatedOrder.shippingAddress?.phone || "N/A",
        address: updatedOrder.shippingAddress?.address || "N/A",
        items: updatedOrder.items,
        amount: updatedOrder.totalAmount,
        totalAmount: updatedOrder.totalAmount,
      }).catch((err) =>
        console.error("Background confirmation email error:", err)
      );
    }

    return NextResponse.json(
      { success: true, message: "Order status updated successfully", order: updatedOrder },
      { status: 200 }
    );
  } catch (error) {
    console.error("Update Order Status Error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Server Error" },
      { status: 500 }
    );
  }
}