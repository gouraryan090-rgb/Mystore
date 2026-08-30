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

    if (!orderId) {
      return NextResponse.json(
        { success: false, message: "Order ID is required." },
        { status: 400 }
      );
    }

    const cashfreeEnv = process.env.CASHFREE_ENVIRONMENT || "TEST";
    const cashfreeBaseUrl = cashfreeEnv === "PRODUCTION" 
      ? `https://api.cashfree.com/pg/orders/${orderId}` 
      : `https://sandbox.cashfree.com/pg/orders/${orderId}`;

    const cashfreeResponse = await fetch(cashfreeBaseUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-client-id": process.env.NEXT_PUBLIC_CASHFREE_CLIENT_ID,
        "x-client-secret": process.env.CASHFREE_CLIENT_SECRET,
        "x-api-version": process.env.CASHFREE_API_VERSION || "2022-09-01",
      },
    });

    const cashfreeData = await cashfreeResponse.json();

    if (!cashfreeResponse.ok) {
      return NextResponse.json(
        { success: false, message: "Failed to fetch payment status from Cashfree." },
        { status: 400 }
      );
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return NextResponse.json(
        { success: false, message: "Order not found in database." },
        { status: 404 }
      );
    }

    if (cashfreeData.order_status === "PAID") {
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
            paymentMethod: "Online (Paid)"
          }
        ).catch((err) => console.error("Background online email error:", err));
      }

      return NextResponse.json({ success: true, message: "Payment verified successfully!" }, { status: 200 });
    } else {
      order.paymentStatus = "Failed";
      order.status = "Payment Failed";
      await order.save();

      return NextResponse.json({ success: false, message: `Payment status: ${cashfreeData.order_status}` }, { status: 400 });
    }

  } catch (error) {
    console.error("Payment Verification Error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Server Error" },
      { status: 500 }
    );
  }
}