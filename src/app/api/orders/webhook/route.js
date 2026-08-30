export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Order from "@/models/Order";
import { sendOrderEmail } from "@/lib/mailer";

export async function POST(request) {
  try {
    await dbConnect();

    const body = await request.json();
    
    // Basic webhook validation or data extraction from Cashfree webhook payload
    const eventData = body.data;
    if (!eventData || !eventData.order) {
      return NextResponse.json({ success: false, message: "Invalid webhook payload" }, { status: 400 });
    }

    const orderId = eventData.order.order_id;
    const orderStatus = eventData.order.order_status;

    const order = await Order.findById(orderId);
    if (!order) {
      return NextResponse.json({ success: false, message: "Order not found" }, { status: 404 });
    }

    if (orderStatus === "PAID") {
      order.paymentStatus = "Paid";
      order.status = "Placed";
      await order.save();

      const customerEmail = order.email || order.shippingAddress?.email;
      if (customerEmail) {
        sendOrderEmail(
          customerEmail,
          orderId,
          "created",
          {
            customerName: order.shippingAddress?.name || "Customer",
            phone: order.shippingAddress?.phone || "9999999999",
            address: order.shippingAddress?.address || "N/A",
            items: order.items,
            amount: order.totalAmount,
            totalAmount: order.totalAmount,
            paymentMethod: "Online Webhook (Paid)"
          }
        ).catch((err) => console.error("Webhook email error:", err));
      }
    } else if (orderStatus === "FAILED") {
      order.paymentStatus = "Failed";
      order.status = "Payment Failed";
      await order.save();
    }

    return NextResponse.json({ success: true, message: "Webhook processed successfully" }, { status: 200 });

  } catch (error) {
    console.error("Webhook Error:", error);
    return NextResponse.json({ success: false, message: error.message || "Server Error" }, { status: 500 });
  }
}