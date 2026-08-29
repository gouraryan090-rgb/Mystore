export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Order from "@/models/Order";
import { sendOrderEmail } from "@/lib/mailer";

export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { orderId } = body;

    console.log("Verify API hit for orderId:", orderId);

    if (!orderId) {
      return NextResponse.json({ success: false, message: "Order ID missing" }, { status: 400 });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      console.error("Order not found in DB for ID:", orderId);
      return NextResponse.json({ success: false, message: "Order not found" }, { status: 404 });
    }

    if (order.paymentStatus === "Paid") {
      return NextResponse.json({ success: true, message: "Order already verified" });
    }

    const cashfreeOrderId = order.cashfreeOrderId;
    if (!cashfreeOrderId) {
      console.error("Cashfree Order ID missing in order document:", order);
      return NextResponse.json({ success: false, message: "Cashfree Order ID not found in order" }, { status: 400 });
    }

    const clientId = process.env.CASHFREE_CLIENT_ID;
    const clientSecret = process.env.CASHFREE_SECRET_KEY;

    console.log("Fetching status from Cashfree for cashfreeOrderId:", cashfreeOrderId);

    const cashfreeRes = await fetch(`https://sandbox.cashfree.com/pg/orders/${cashfreeOrderId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-client-id": clientId,
        "x-client-secret": clientSecret,
        "x-api-version": "2026-01-01"
      }
    });

    const cashfreeData = await cashfreeRes.json();
    console.log("Cashfree Server Verification Response:", cashfreeData);

    if (cashfreeRes.ok && cashfreeData.order_status === "PAID") {
      order.paymentStatus = "Paid";
      order.status = "Placed";
      await order.save();

      const customerEmail = order.shippingAddress?.email;
      console.log("Attempting to send email to:", customerEmail);

      if (customerEmail) {
        sendOrderEmail(customerEmail, orderId, "created", {
          customerName: order.shippingAddress?.name || "Customer",
          phone: order.shippingAddress?.phone || "N/A",
          address: order.shippingAddress?.address || "N/A",
          items: order.items,
          amount: order.totalAmount,
          totalAmount: order.totalAmount,
        })
        .then(() => console.log("Email sent successfully!"))
        .catch((err) => console.error("Mailer execution error:", err));
      } else {
        console.warn("Customer email not found in shippingAddress, skipping email.");
      }

      return NextResponse.json({ success: true, message: "Payment verified successfully" });
    } else {
      return NextResponse.json({ 
        success: false, 
        message: "Payment not completed or failed", 
        status: cashfreeData.order_status || "UNKNOWN" 
      }, { status: 400 });
    }

  } catch (error) {
    console.error("Verification Route Fatal Error:", error);
    return NextResponse.json({ success: false, message: error.message || "Server Error" }, { status: 500 });
  }
}